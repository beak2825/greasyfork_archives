// ==UserScript==
// @name         MugenHelper
// @namespace    Joeyvan@Joybrick
// @version      2.7.2
// @description  use at your own risk
// @author       Joeyvan
// @match        *://badgameshow.com/top.cgi
// @match        *://www.badgameshow.com/top.cgi
// @match        *://laborrtious.ddns.net/top.cgi
// @match        *://behind.laborrtious.tk/top.cgi
// @match        *://172.104.88.92/hero/top.cgi
// @match        *://catding.tw/hero/top.cgi
// @match        *://changame.ml/top.cgi
// @match        *://changame2.ml/top.cgi
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require      http://code.jquery.com/ui/1.9.2/jquery-ui.js
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/401529/MugenHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/401529/MugenHelper.meta.js
// ==/UserScript==

//===== config =====
const StorageKey = "MugenHelper" + document.domain;
const DefaultDelay = 1 * 1000;
const DefaultRetryTimes = 3;
//
const DefaultUIPositionTop = 10;
const DefaultUIPositionLeft = 10;
//
const ControllerInterval = 1.5 * 1000;
//
const IsHeartBeatActivate = true;
const HeartbeatInterval = 10 * 1000;
const HeartbeatMaxCount = 2;
const IsForceRefresh = false;
const ForceRefreshInterval = 15 * 1000;
//
const QuestInterval = 5 * 1000;
//
const BankInterval = 5 * 1000;
//
const InnInterval = 5 * 1000;
const InnHPThreshold = 50;
const InnMPThreshold = 50;
//
const MajoInterval = 5 * 1000;
//
const CleanConsoleInterval = 30 * 60 * 1000;
//
const validMap = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,20,21,22,23,24,30,31,32,40,41,42,43,44,50,51,55,56];
const savedMap = [1,2,3,4,30,31,40,41,42,43,51,55,56];
const IsCatDingVersion = document.domain.indexOf("catding") >= 0 || document.domain.indexOf("172.104.88.92") >= 0;
//==================

//===== Debug config =====
const ShowLog = false;
const ShowInfo = false;
const ShowWarnLog = false;
const ShowErrorLog = true;
const DebugMode = false;
//=========================

class XHR
{
    MakeRequest(method, url, param)
    {
        return new Promise(function (resolve, reject)
        {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = () =>
            {
                if (xhr.status >= 200 && xhr.status < 300)
                {
                    resolve(xhr.response);
                }
                else
                {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }
            };

            xhr.onerror = () =>
            {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            };

            if(param != undefined)
                xhr.send(param);
            else
                xhr.send();

            _Logger.log(`${method} ${param} to ${url}`);
        });
    }
}

class Selector
{
    has(object, key)
    {
        return object ? hasOwnProperty.call(object, key) : false;
    }

    async $(selector, rootnode = unsafeWindow, retry = true)
    {
        var result = rootnode.document.querySelector(selector);
        if(result)
        {
            _Logger.logInfo("found \"" + selector + "\" at \"" + rootnode + "\" : \"" + result + "\"");
            return result;
        }
        else
        {
            if(retry)
            {
                _Logger.logWarning("can't find element : " + selector + "\n at " + rootnode);
                await _DelayHelper.sleep();
                return await this.$(selector, rootnode);
            }
        }

        return undefined;
    }

    async getIframeWindow(selector, rootnode = unsafeWindow, targetProperty = undefined)
    {
        var iframe_object = await this.$(selector, rootnode);
        var doc;
        var result = undefined;

        if (iframe_object.contentWindow)
        {
            result = iframe_object.contentWindow;
        }

        if (iframe_object.unsafeWindow)
        {
            result = iframe_object.unsafeWindow;
        }

        if (!doc && iframe_object.contentDocument)
        {
            doc = iframe_object.contentDocument;
        }

        if (!doc && iframe_object.document)
        {
            doc = iframe_object.document;
        }

        if (doc && doc.defaultView)
        {
            result = doc.defaultView;
        }

        if (doc && doc.parentWindow)
        {
            result = doc.parentWindow;
        }

        if(result == undefined || targetProperty != undefined && this.has(result, targetProperty) == false)
        {
            _Logger.logWarning("can't get iframe unsafeWindow.");
            await _DelayHelper.sleep();
            return await this.getIframeWindow(selector, rootnode, targetProperty);
        }
        return result;
    }
}

class Logger
{
    constructor()
    {
        unsafeWindow.actionframe.alert = (message) => this.log(message);
        unsafeWindow.alert = (message) => this.log(message);
    }

    log(message)
    {
        if(ShowLog) console.log(message);
    }

    logInfo(message)
    {
        if(ShowInfo) console.info(message);
    }

    logError(message)
    {
        if(ShowErrorLog) console.error(message);
    }

    logWarning(message)
    {
        if(ShowWarnLog) console.warn(message)
    }

    clear()
    {
        console.clear();
    }
}

class GameCoreWrapper
{
    constructor()
    {
        this.main = unsafeWindow;
        this.frame = unsafeWindow.actionframe;
    }

    async retry(callback, times = DefaultRetryTimes)
    {
        if(typeof(callback) != "function")
        {
            throw "callback is not a function.";
        }

        if(times == 0)
        {
            throw "something wrong happened, please contact script author.";
        }

        try
        {
            return await callback();
        }
        catch(ex)
        {
            _Logger.logError(ex);
            
            if(ex.status == 503)
            {
                let statusButton = await _Selector.$("#statusbutton");
                statusButton.click();
                await _DelayHelper.sleep(100000);
                await _GameWrapper.BackTown();
            }

            await _DelayHelper.sleep();
            return await this.retry(callback, times - 1);
        }
    }

    async BackTown()
    {
        await this.retry(() => {
            this.main.backtown();
        });
        _Logger.logInfo("Back to town.");
    }

    async Teleport(place, facility)
    {
        await this.retry(() => {
            this.main.fastkeyform(place, facility);
        });
        _Logger.logInfo("Teleport to " + place + "'s " + facility + ".");
    }

    async Refresh()
    {
        await this.retry(() => {
            this.main.get_all_data();
        });

        _Logger.logInfo("Refresh.");
    }

    async GetObj(id)
    {
        return await this.retry(() => {
            return this.main.getObj(id);
        });
    }

    async GetServerSyncTime()
    {
        return parseInt(this.main.moya);
    }

    async SetNextBattleTime(value)
    {
        this.main.BTIME = value;
    }

    async GetNextBattleTime()
    {
        return parseInt(this.main.BTIME);
    }

    async WaitUntilNextBattleEnd()
    {
        let second = await this.retry(() => {
            return this.GetNextBattleTime();
        });
        let millisecond = ((second + 1) * 1000) + DefaultDelay;

        await _DelayHelper.sleep(millisecond);
    }

    async GetAutoAttack()
    {
        return await this.GetObj('autoattack');
    }

    async DoBattle()
    {
        let id = (await _Selector.$("#battlef > input[type=hidden]:nth-child(1)")).value;
        let pass = (await _Selector.$("#battlef > input[type=hidden]:nth-child(2)")).value;
        let rnd = moya;
        let mode = (await _Selector.$("select[name=mode]")).value;

        let url = "battle.cgi";
        let param = `id=${id}&pass=${pass}&rmode=&rnd=${rnd}&mode=${mode}&rnd2=${rnd}`;

        await this.retry(async () => {
            let result = await _XHR.MakeRequest('POST', url, param);
            if(DebugMode)
            {
                let regex = result.match(/離下次可戰鬥時間剩([\d]+)[\W]?秒。/);
                if(regex != undefined && regex[1] <= 1)
                    throw regex[0];
            }
        });

        _Logger.logInfo(`${new Date()} 進行了一次戰鬥`);

        await this.Refresh();
    }
}

class DelayHelper
{
    async sleep(ms = DefaultDelay)
    {
        return new Promise(r => setTimeout(r, ms));
    }
}

class Task
{
    constructor(callback, interval, immediate = true)
    {
        if(typeof(callback) != "function")
        {
            throw "Task type error"
        }

        this.callback = callback;
        this.interval = interval;

        if(immediate)
        {
            this.nextTime = Date.now();
        }
        else
        {
            this.SetNextTime();
        }
    }

    SetUniqureId(id)
    {
        this.id = id;
    }

    SetNextTime()
    {
        let now = Date.now();
        this.nextTime = now + this.interval;
    }

    IsOverdue()
    {
        let now = Date.now();
        return now >= this.nextTime;
    }

    async Excute()
    {
        await this.callback();
        this.SetNextTime();
    }
}

class TaskController
{
    constructor()
    {
        this.Tasks = [];
        this.handle = undefined;
        this.IsBusy = false;
    }

    AddTask(callback, interval)
    {
        let task = new Task(callback, interval);
        task.SetUniqureId(this.taskCounter++);

        this.Tasks.push(task);

        return task.id;
    }

    ClearTask()
    {
        this.Tasks.length = 0;
    }

    RemoveTask(id)
    {
        this.Tasks = this.Tasks.filter(x => x.id != id);
    }

    async DoTasks()
    {
        if(this.IsBusy)
            return;

        try
        {
            this.IsBusy = true;

            for(let task of this.Tasks)
            {
                if(task.IsOverdue())
                {
                    await task.Excute();
                    await _DelayHelper.sleep();
                }
            }
        }
        catch(ex)
        {
            _Logger.logError(ex);
        }
        finally
        {
            this.IsBusy = false;
        }
    }

    StartInterval(timeout = ControllerInterval)
    {
        if(this.handle != undefined)
        {
            throw "TaskController was ready";
        }

        this.handle = setInterval(this.DoTasks.bind(this), timeout);
    }

    StopInterval()
    {
        if(this.handle == undefined)
        {
            return;
        }

        clearInterval(this.handle);
        this.handle = undefined;
    }
}

class StorageManager
{
    Initialize()
    {
        this._data = {};
        let data = GM_getValue(StorageKey, "{}");
        this._data = JSON.parse(data);
    }

    OnLeave()
    {
        let data = JSON.stringify(this._data);
        GM_setValue(StorageKey, data);
    }

    Get(key, defaultValue)
    {
        if(this._data[key] == undefined)
            this._data[key] = defaultValue;

        return this._data[key];
    }

    Set(key, value)
    {
        this._data[key] = value;
    }
}

class UIManager
{
    Initialize()
    {
        this.IsActivate = false;
        this._ZIndex = 0;
        this._top = _StorageManager.Get("top", DefaultUIPositionTop);
        this._left = _StorageManager.Get("left", DefaultUIPositionLeft);
        this.UpdateZIndex();
        this.CreateMainWindow();

        _HeartBeat.SetupUI();
        _Quest.SetupUI();
        _Bank.SetupUI();
        _Inn.SetupUI();
        _WareHouse.SetupUI();
        _Majo.SetupUI();

        this.CreateControlButton();
    }

    OnLeave()
    {
        _StorageManager.Set("top", this._top);
        _StorageManager.Set("left", this._left);
    }

    UpdateZIndex()
    {
        $("div").each((index, obj) => {
            let _current = parseInt($(obj).css("zIndex"), 10);

            if(isNaN(_current) == false && _current > this._ZIndex) {
                this._ZIndex = _current + 1;
            }
        });
    }

    CreateMainWindow()
    {
        $('body').append('<div id = "MainWindow" class = "ui-widget-header">MugenHelper v2.7.2</div>');

        $("#MainWindow").css("position", "absolute");
        $("#MainWindow").css("top", this._top + "px");
        $("#MainWindow").css("left", this._left + "px");
        $("#MainWindow").css("z-index", this._ZIndex);
        $("#MainWindow").css("background", "#ecebeb");
        $("#MainWindow").css("border", 1 + "px solid #333");
        $("#MainWindow").css("border-radius", 5 + "px");
        $("#MainWindow").css("height", "auto");
        $("#MainWindow").css("width", 280);
        $("#MainWindow").css("margin", "0px auto");
        $("#MainWindow").draggable();
        $("#MainWindow").mouseup((event) => {
            this._top = parseInt($("#MainWindow").css("top")) - $(unsafeWindow).scrollTop();
            this._left = parseInt($("#MainWindow").css("left"));
        });

        $(unsafeWindow).scroll((event) => {
            let topValue = $(unsafeWindow).scrollTop();
            $("#MainWindow").css("top", (topValue + this._top) + "px");
        });
    }

    CreateControlButton()
    {
        $("#MainWindow").append("<div><input type=\"button\" id=\"StartButton\" value=\"開始\"></input><input type=\"button\" id=\"StopButton\" value=\"暫停\"></input><span id=\"status\">未執行</span><div>");
        $("#StartButton").click(() => {
            if(this.IsActivate)
                return;
            this.IsActivate = true;
            $("#status").html("執行中");
            $("#status").css("color", "green");
            $("#StartButton").attr("disabled", "disabled");
            $("#StopButton").removeAttr("disabled");
            this.UpdateUI();

            if($("#IsMajoActivate").attr('checked'))
                _TaskController.AddTask(_Majo.DoScript.bind(_Majo), MajoInterval);
            if($("#IsHeartBeatActivate").attr('checked'))
            {
                _TaskController.AddTask(_HeartBeat.DoScript.bind(_HeartBeat), HeartbeatInterval);
            }
            if($("#IsBankActivate").attr('checked'))
                _TaskController.AddTask(_Bank.DoScript.bind(_Bank), BankInterval);
            if($("#IsInnActivate").attr('checked'))
                _TaskController.AddTask(_Inn.DoScript.bind(_Inn), InnInterval);
            if($("#IsQuestActivate").attr('checked'))
                _TaskController.AddTask(_Quest.DoScript.bind(_Quest), QuestInterval);
            if($("#IsWareHouseActivate").attr('checked'))
                _TaskController.AddTask(_WareHouse.DoScript.bind(_WareHouse), Math.min(Math.max(parseInt($("#WareHouseInterval").val()), 30), 8640) * 1000);

            _TaskController.AddTask(_Logger.clear.bind(_Logger), CleanConsoleInterval);
            _TaskController.StartInterval();
        });

        $("#StopButton").click(() => {
            if(this.IsActivate == false)
                return;
            this.IsActivate = false;
            $("#status").html("暫停中");
            $("#status").css("color", "red");
            $("#StopButton").attr("disabled", "disabled");
            $("#StartButton").removeAttr("disabled");
            this.UpdateUI();

            _HeartBeat.counter = 0;
            _Quest.CompleteCount = -1;
            _TaskController.StopInterval();
            _TaskController.ClearTask();
        });
    }

    UpdateUI()
    {
        _HeartBeat.UpdateUI(this.IsActivate);
        _Quest.UpdateUI(this.IsActivate);
        _Bank.UpdateUI(this.IsActivate);
        _Inn.UpdateUI(this.IsActivate);
        _Majo.UpdateUI(this.IsActivate);
        _WareHouse.UpdateUI(this.IsActivate);
    }
}

class HeartBeat
{
    constructor()
    {
        this.counter = 0;
        this.temp = undefined;
    }

    SetupUI()
    {
        $("#MainWindow").append("<div><input type=\"checkbox\" id=\"IsHeartBeatActivate\"></input>維持連線</div>");
        $("#ForceRefreshInterval").css("width", 25);
        $("#IsHeartBeatActivate").change(() => {
            if($("#IsHeartBeatActivate").attr('checked'))
                $("#IsForceRefresh").removeAttr("disabled");
            else
                $("#IsForceRefresh").attr("disabled", "disabled");
        });
        $("#IsForceRefresh").change(() => {
            if($("#IsForceRefresh").attr('checked'))
                $("#ForceRefreshInterval").removeAttr("disabled");
            else
                $("#ForceRefreshInterval").attr("disabled", "disabled");
        });
        this.UpdateUI();
        $("#ForceRefreshInterval").val(_StorageManager.Get("ForceRefreshInterval", ForceRefreshInterval / 1000));
        if(_StorageManager.Get("IsHeartBeatActivate", IsHeartBeatActivate))
        {
            $("#IsHeartBeatActivate").attr('checked','checked')
            if(_StorageManager.Get("IsForceRefresh", IsForceRefresh))
            {
                $("#IsForceRefresh").attr('checked','checked')
            }
            else
            {
                $("#IsForceRefresh").removeAttr("checked");
            }
        }
        else
        {
            $("#ForceRefreshInterval").attr("disabled", "disabled");
            $("#IsForceRefresh").attr("disabled", "disabled");
            $("#IsHeartBeatActivate").removeAttr("checked");
        }


    }

    UpdateUI(isActivate = false)
    {
        if(isActivate)
        {
            $("#IsHeartBeatActivate").attr("disabled", "disabled");
            $("#IsForceRefresh").attr("disabled", "disabled");
            $("#ForceRefreshInterval").attr("disabled", "disabled");
        }
        else
        {
            $("#IsHeartBeatActivate").removeAttr("disabled");
            $("#IsForceRefresh").removeAttr("disabled");
            $("#ForceRefreshInterval").removeAttr("disabled");
        }
    }

    async DoScript()
    {
        let systime = await _GameWrapper.GetServerSyncTime();

        if(this.temp == systime)
        {
            this.counter++;

            if(this.counter > HeartbeatMaxCount)
            {
                await this.Refresh();
                this.counter = 0;
            }
        }
        else
        {
            this.counter = 0;
            this.temp = systime;
        }
    }

    async Refresh()
    {
        await _GameWrapper.Refresh();
        _Logger.logInfo("Revive! - " + new Date());

        let autoattck = await _GameWrapper.GetAutoAttack();
        autoattck.checked = true;
    }

    OnLeave()
    {
        _StorageManager.Set("IsHeartBeatActivate", $("#IsHeartBeatActivate").attr('checked') == "checked");
        _StorageManager.Set("IsForceRefresh", $("#IsForceRefresh").attr('checked') == "checked");
        _StorageManager.Set("ForceRefreshInterval", $("#ForceRefreshInterval").val());
    }
}

class Quest
{
    constructor()
    {
        this.CompleteCount = -1;
    }

    SetupUI()
    {
        $("#MainWindow").append("<div><input type=\"checkbox\" id=\"IsQuestActivate\">自動任務<div>");
        this.UpdateUI();
        if(_StorageManager.Get("IsQuestActivate", true))
        {
            $("#IsQuestActivate").attr('checked','checked')
        }
        else
        {
            $("#IsQuestActivate").removeAttr("checked");
        }
    }

    UpdateUI(isActivate = false)
    {
        if(isActivate)
        {
            $("#IsQuestActivate").attr("disabled", "disabled");
        }
        else
        {
            $("#IsQuestActivate").removeAttr("disabled");
        }
    }

    async DoScript()
    {
        let now = IsCatDingVersion ? parseInt((await _Selector.$("#mtotal")).innerText) : parseInt((await _Selector.$("#mname")).innerText.match(/([\d]+)/)[1]);

        if(this.CompleteCount > 0 && now < this.CompleteCount)
            return;

        await _GameWrapper.WaitUntilNextBattleEnd();

        let autoattck = await _GameWrapper.GetAutoAttack();
        let temp = autoattck.checked;

        await _GameWrapper.Teleport('town','quest');
        await _DelayHelper.sleep();

        let status = await this.GetStatus();

        if(status.IsDone)
        {
            let button = await _Selector.$("body > table > tbody > tr:nth-child(3) > td > form:nth-child(3) > input.FC", unsafeWindow.actionframe);
            button.click();
            await _DelayHelper.sleep();

            await _GameWrapper.Teleport('town','quest');
            await _DelayHelper.sleep();

            button = await _Selector.$("body > table > tbody > tr:nth-child(3) > td > form:nth-child(3) > input.FC", unsafeWindow.actionframe);
            button.click();
            await _DelayHelper.sleep();

            await _GameWrapper.Teleport('town','quest');
            await _DelayHelper.sleep();

            status = await this.GetStatus();
            this.CompleteCount = now + status.count;
        }
        else if(status.fuckingBug)
        {
            this.CompleteCount = now + 1;
        }
        else if(status.IsNotGet)
        {
            let button = await _Selector.$("body > table > tbody > tr:nth-child(3) > td > form:nth-child(3) > input.FC", unsafeWindow.actionframe);
            button.click();
            await _DelayHelper.sleep();

            await _GameWrapper.Teleport('town','quest');
            await _DelayHelper.sleep();

            status = await this.GetStatus();
            this.CompleteCount = now + status.count;
        }
        else if(status.IsIng)
        {
            this.CompleteCount = now + status.count;
        }

        _Logger.logInfo("QuestStatus: " + status);
        _Logger.logInfo("Quest Complete when " + this.CompleteCount + "battles achieved.")

        await _GameWrapper.BackTown();
        await _DelayHelper.sleep();

        autoattck.checked = temp;
    }

    async GetStatus()
    {
        let target = await _Selector.$("body > table > tbody > tr:nth-child(3) > td", unsafeWindow.actionframe);
        let content = target.innerText.trim().split('\n', 1)[0];
        let IsNotGet = content.indexOf("最近各城鎮地怪物變多，請幫忙村民消滅牠們(請在任意城鎮何意地圖打怪)") > 0;
        let IsIng = content.indexOf("目前正在進行") > 0;
        let IsDone = content.indexOf("感謝你的幫忙") > 0;
        let fuckingBug = content.indexOf("購買指定的裝備給指定的任務屋") > 0;
        let count = IsIng ? parseInt(content.match(/怪([\d]+)隻/)[1]) : undefined;

        let result = {IsNotGet: IsNotGet, IsIng: IsIng, IsDone: IsDone, fuckingBug: fuckingBug, count: count};

        return result;
    }

    OnLeave()
    {
        _StorageManager.Set("IsQuestActivate", $("#IsQuestActivate").attr('checked') == "checked");
    }
}

class Bank
{
    SetupUI()
    {
        $("#MainWindow").append("<div><input type=\"checkbox\" id=\"IsBankActivate\">自動存錢:<input type=\"text\" id=\"BankThrehold\"></input>萬</div>");
        $("#BankThrehold").css("width", 50);
        $("#IsBankActivate").change(() => {
            if($("#IsBankActivate").attr('checked'))
                $("#BankThrehold").removeAttr("disabled");
            else
                $("#BankThrehold").attr("disabled", "disabled");
        });
        this.UpdateUI();
        $("#BankThrehold").val(_StorageManager.Get("BankThrehold", 100));
        if(_StorageManager.Get("IsBankActivate", true))
        {
            $("#IsBankActivate").attr('checked','checked')
        }
        else
        {
            $("#IsBankActivate").removeAttr("checked");
            $("#BankThrehold").attr("disabled", "disabled");
        }
    }

    UpdateUI(isActivate = false)
    {
        if(isActivate)
        {
            $("#IsBankActivate").attr("disabled", "disabled");
            $("#BankThrehold").attr("disabled", "disabled");
        }
        else
        {
            $("#IsBankActivate").removeAttr("disabled");
            if($("#IsBankActivate").attr('checked'))
                $("#BankThrehold").removeAttr("disabled");
        }
    }

    async DoScript()
    {
        let threhold = Math.min(Math.max($("#BankThrehold").val(), 10), 100000000);
        let gold = IsCatDingVersion ? (await _Selector.$("#mgold")).innerText : (await _Selector.$("#mgold > font:nth-child(1)")).innerText; 
        let regex = gold.match(/([\d]*[億.萬.])/g);
        if(regex == undefined)
            return;

        let result = 0;
        for(let ele of regex)
        {
            if(ele.indexOf("億") > 0)
                result += parseInt(ele) * 10000;
            else if(ele.indexOf("萬") > 0)
            result += parseInt(ele);
        }

        if(result >= threhold)
        {
            let autoattck = await _GameWrapper.GetAutoAttack();
            let temp = autoattck.checked;

            await _GameWrapper.Teleport('town','bank');
            await _DelayHelper.sleep();

            let button = await _Selector.$("body > table > tbody > tr:nth-child(3) > td > form:nth-child(4) > input.MFC", unsafeWindow.actionframe);
            button.click();
            await _DelayHelper.sleep();

            _GameWrapper.BackTown()
            await _DelayHelper.sleep();

            autoattck.checked = temp;
        }
    }

    OnLeave()
    {
        _StorageManager.Set("BankThrehold", $("#BankThrehold").val());
        _StorageManager.Set("IsBankActivate", $("#IsBankActivate").attr('checked') == "checked");
    }
}

class Inn
{
    SetupUI()
    {
        $("#MainWindow").append("<div><input type=\"checkbox\" id=\"IsInnActivate\">自動住宿:  HP<input type=\"text\" id=\"InnHPThreshold\"></input>%以下  MP<input type=\"text\" id=\"InnMPThreshold\"></input>%以下</div></div>");
        $("#InnHPThreshold").css("width", 25);
        $("#InnMPThreshold").css("width", 25);
        $("#IsInnActivate").change(() => {
            if($("#IsInnActivate").attr('checked'))
            {
                $("#InnHPThreshold").removeAttr("disabled");
                $("#InnMPThreshold").removeAttr("disabled");
            }
            else
            {
                $("#InnHPThreshold").attr("disabled", "disabled");
                $("#InnMPThreshold").attr("disabled", "disabled");
            }
        });
        this.UpdateUI();

        $("#InnHPThreshold").val(_StorageManager.Get("InnHPThreshold", InnHPThreshold));
        $("#InnMPThreshold").val(_StorageManager.Get("InnMPThreshold", InnMPThreshold));
        if(_StorageManager.Get("IsInnActivate", true))
        {
            $("#IsInnActivate").attr('checked','checked')
        }
        else
        {
            $("#IsInnActivate").removeAttr("checked");
            $("#InnHPThreshold").attr("disabled", "disabled");
            $("#InnMPThreshold").attr("disabled", "disabled");
        }
    }

    UpdateUI(isActivate = false)
    {
        if(isActivate)
        {
            $("#IsInnActivate").attr("disabled", "disabled");
            $("#InnHPThreshold").attr("disabled", "disabled");
            $("#InnMPThreshold").attr("disabled", "disabled");
        }
        else
        {
            if($("#IsInnActivate").attr('checked'))
            {
                $("#InnHPThreshold").removeAttr("disabled");
                $("#InnMPThreshold").removeAttr("disabled");
            }

            $("#IsInnActivate").removeAttr("disabled");
        }
    }

    async DoScript()
    {
        let hpRegex = (await _Selector.$("#mhp", this.outer)).textContent.match(/([\d]+)\/([\d]+)/);
        let currenthp = hpRegex[1];
        let maxhp = hpRegex[2];

        let mpRegex = (await _Selector.$("#mmp", this.outer)).textContent.match(/([\d]+)\/([\d]+)/);
        let currentmp = mpRegex[1];
        let maxmp = mpRegex[2];

        let hpThreshold = Math.min(Math.max($("#InnHPThreshold").val(), 0), 100) / 100;
        let mpThreshold = Math.min(Math.max($("#InnMPThreshold").val(), 0), 100) / 100;

        if(((currenthp / maxhp) < hpThreshold) || ((currentmp / maxmp) < mpThreshold))
        {
            let autoattck = await _GameWrapper.GetAutoAttack();
            let temp = autoattck.checked;

            await _GameWrapper.Teleport('town','bank');
            await _DelayHelper.sleep();

            let button = await _Selector.$("body > table > tbody > tr:nth-child(3) > td > form:nth-child(4) > input.MFC", unsafeWindow.actionframe);
            button.click();
            await _DelayHelper.sleep();

            await _GameWrapper.Teleport('town','inn');
            await _DelayHelper.sleep();

            _GameWrapper.BackTown()
            await _DelayHelper.sleep();

            autoattck.checked = (currenthp == 0) ? true : temp;
        }
    }

    OnLeave()
    {
        _StorageManager.Set("InnHPThreshold", $("#InnHPThreshold").val());
        _StorageManager.Set("IsInnActivate", $("#IsInnActivate").attr('checked') == "checked");
    }
}

class Majo
{
    SetupUI()
    {
        $("#MainWindow").append("<div><input type=\"checkbox\" id=\"IsMajoActivate\">魔女商店:<select id='MajoOption'></select><div>");
        $("#MajoOption").css("width", 180);

        if(IsCatDingVersion)
        {
            $("#MajoOption").append("<option value='0'>力量之果(4000000 Gold)</option>");
            $("#MajoOption").append("<option value='1'>生命之果(4000000 Gold)</option>");
            $("#MajoOption").append("<option value='2'>智慧之果(4000000 Gold)</option>");
            $("#MajoOption").append("<option value='3'>精神之果(4000000 Gold)</option>");
            $("#MajoOption").append("<option value='4'>幸運之果(4000000 Gold)</option>");
            $("#MajoOption").append("<option value='5'>速度之果(4000000 Gold)</option>");
            $("#MajoOption").append("<option value='6'>火之石(10000000 Gold)</option>");
            $("#MajoOption").append("<option value='7'>水之石(10000000 Gold)</option>");
            $("#MajoOption").append("<option value='8'>風之石(10000000 Gold)</option>");
            $("#MajoOption").append("<option value='9'>星之石(10000000 Gold)</option>");
            $("#MajoOption").append("<option value='10'>雷之石(10000000 Gold)</option>");
            $("#MajoOption").append("<option value='11'>光之石(10000000 Gold)</option>");
            $("#MajoOption").append("<option value='12'>暗之石(10000000 Gold)</option>");
            $("#MajoOption").append("<option value='13'>太陽之鑰(12000000 Gold)</option>");
            $("#MajoOption").append("<option value='14'>贊助點數10點(30000000 Gold)</option>");
        }
        else
        {
            $("#MajoOption").append("<option value='0'>神秘的果實(500000 Gold)</option>");
            $("#MajoOption").append("<option value='1'>熟練之玉(2000000 Gold)</option>");
            $("#MajoOption").append("<option value='2'>伊莉亞之角(2000000 Gold)</option>");
            $("#MajoOption").append("<option value='3'>巴羅之花(2000000 Gold)</option>");
            $("#MajoOption").append("<option value='4'>獸之肉(2000000 Gold)</option>");
            $("#MajoOption").append("<option value='5'>長壽之素(2000000 Gold)</option>");
            $("#MajoOption").append("<option value='6'>魔女之粉(2000000 Gold)</option>");
            $("#MajoOption").append("<option value='7'>仙人之御握(2000000 Gold)</option>");
            $("#MajoOption").append("<option value='8'>精神安定劑(2000000 Gold)</option>");
            $("#MajoOption").append("<option value='9'>香純之飴(2000000 Gold)</option>");
            $("#MajoOption").append("<option value='10'>小矮人種子(2000000 Gold)</option>");
            $("#MajoOption").append("<option value='11'>力量之果(4000000 Gold)</option>");
            $("#MajoOption").append("<option value='12'>生命之果(4000000 Gold)</option>");
            $("#MajoOption").append("<option value='13'>智慧之果(4000000 Gold)</option>");
            $("#MajoOption").append("<option value='14'>精神之果(4000000 Gold)</option>");
            $("#MajoOption").append("<option value='15'>幸運之果(4000000 Gold)</option>");
            $("#MajoOption").append("<option value='16'>速度之果(4000000 Gold)</option>");
            $("#MajoOption").append("<option value='17'>熟練之書(10000000 Gold)</option>");
            $("#MajoOption").append("<option value='18'>太陽之鑰(12000000 Gold)</option>");
            $("#MajoOption").append("<option value='19'>希望之果(50000000 Gold)</option>");
        }

        $("#IsMajoActivate").change(() => {
            if($("#IsMajoActivate").attr('checked'))
                $("#MajoOption").removeAttr("disabled");
            else
                $("#MajoOption").attr("disabled", "disabled");
        });
        this.UpdateUI();
        $("#MajoOption").val(_StorageManager.Get("MajoOption", 0));
        if(_StorageManager.Get("IsMajoActivate", true))
        {
            $("#IsMajoActivate").attr('checked','checked')
        }
        else
        {
            $("#IsMajoActivate").removeAttr("checked");
            $("#MajoOption").attr("disabled", "disabled");
        }
    }

    UpdateUI(isActivate = false)
    {
        if(isActivate)
        {
            $("#IsMajoActivate").attr("disabled", "disabled");
            $("#MajoOption").attr("disabled", "disabled");
        }
        else
        {
            if($("#IsMajoActivate").attr('checked'))
                $("#MajoOption").removeAttr("disabled");
            $("#IsMajoActivate").removeAttr("disabled");
        }
    }

    async DoScript()
    {
        let facility = (await _Selector.$("#townf > select:nth-child(4)")).value.trim();

        if(facility == "rshop")
        {
            let autoattck = await _GameWrapper.GetAutoAttack();
            let temp = autoattck.checked;

            await _GameWrapper.Teleport('town','bank');
            await _DelayHelper.sleep();

            let button = await _Selector.$("body > table > tbody > tr:nth-child(3) > td > form:nth-child(6) > input.MFC", unsafeWindow.actionframe);
            button.click();
            await _DelayHelper.sleep();

            await _GameWrapper.Teleport('town','rshop');
            await _DelayHelper.sleep();

            let target = $("#MajoOption").val();
            let radio = await _Selector.$("html > body > table.TC > tbody > tr > td > table.TC > tbody > tr > td > input", unsafeWindow.actionframe);
            radio.value = target;
            radio.checked = true;
            button = await _Selector.$("html > body > table.TC > tbody > tr > td > table.TC > tbody > tr > td > input.FC", unsafeWindow.actionframe);
            button.click();
            await _DelayHelper.sleep();

            await _GameWrapper.Teleport('town','bank');
            await _DelayHelper.sleep();

            button = await _Selector.$("body > table > tbody > tr:nth-child(3) > td > form:nth-child(4) > input.MFC", unsafeWindow.actionframe);
            button.click();
            await _DelayHelper.sleep();

            _GameWrapper.BackTown()
            await _DelayHelper.sleep();

            autoattck.checked = temp;
        }
    }

    OnLeave()
    {
        _StorageManager.Set("MajoOption", $("#MajoOption").val());
        _StorageManager.Set("IsMajoActivate", $("#IsMajoActivate").attr('checked') == "checked");
    }
}

class WareHouse
{
    SetupUI()
    {
        $("#MainWindow").append("<div><input type=\"checkbox\" id=\"IsWareHouseActivate\">自動存倉:<input type=\"text\" id=\"WareHouseInterval\"></input>秒<div>");
        $("#WareHouseInterval").css("width", 50);
        $("#IsWareHouseActivate").change(() => {
            if($("#IsWareHouseActivate").attr('checked'))
                $("#WareHouseInterval").removeAttr("disabled");
            else
                $("#WareHouseInterval").attr("disabled", "disabled");
        });
        this.UpdateUI();
        $("#WareHouseInterval").val(_StorageManager.Get("WareHouseInterval", 1800));
        if(_StorageManager.Get("IsWareHouseActivate", true))
        {
            $("#IsWareHouseActivate").attr('checked','checked')
        }
        else
        {
            $("#IsWareHouseActivate").removeAttr("checked");
            $("#WareHouseInterval").attr("disabled", "disabled");
        }
    }

    UpdateUI(isActivate = false)
    {
        if(isActivate)
        {
            $("#IsWareHouseActivate").attr("disabled", "disabled");
            $("#WareHouseInterval").attr("disabled", "disabled");
        }
        else
        {
            if($("#IsWareHouseActivate").attr('checked'))
                $("#WareHouseInterval").removeAttr("disabled");
            $("#IsWareHouseActivate").removeAttr("disabled");
        }
    }

    async DoScript()
    {
        await _GameWrapper.WaitUntilNextBattleEnd();

        let autoattck = await _GameWrapper.GetAutoAttack();
        let temp = autoattck.checked;
        let id = (await _Selector.$("#battlef > input[type=hidden]:nth-child(1)")).value;
        let pass = (await _Selector.$("#battlef > input[type=hidden]:nth-child(2)")).value;

        await _GameWrapper.Teleport('town','storage');
        await _DelayHelper.sleep();

        let header = (await _Selector.$("body > table > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > font", unsafeWindow.actionframe)).innerText;
        let result = parseInt(header.match(/手持物品一覽\(([\d]+)\/[\d]+\)/)[1]);

        if(result > 0)
        {
            let no = Array.from(Array(result).keys()).join(",");
            let url = "town.cgi";
            let param = `id=${id}&pass=${pass}&rmode=&itype=0&mode=storage_in&no=${no}`;

            await _XHR.MakeRequest('POST', url, param);
            await _DelayHelper.sleep();
        }

        await _GameWrapper.BackTown();
        await _DelayHelper.sleep();

        autoattck.checked = temp;
    }

    OnLeave()
    {
        _StorageManager.Set("WareHouseInterval", $("#WareHouseInterval").val());
        _StorageManager.Set("IsWareHouseActivate", $("#IsWareHouseActivate").attr('checked') == "checked");
    }
}

function Override()
{
    let SelfMake_to = async () =>
    {
        let interval = document.hidden ? 1000 : 100;
        try
        {
            if(BTIME > 0)
            {
                BTIME -= (interval / 1000);
                BTIME = Math.round(BTIME * 10) / 10;
                let output = (BTIME < 0) ? "<font color=black><b>行動ＯＫ</b></font>" : `<font color=black>距下次行動剩餘${BTIME}秒</font>`;
                getObj("tok").innerHTML = output;
            }
            else
            {
                let form = getObj('battlef');
                let nmp = form.mode.options[form.mode.selectedIndex].value;

                if(nmp == 42)
                {
                    let Proficiency = parseInt(getObj("mabp").innerText);
                    if(Proficiency < 3000)
                    {
                        _Logger.log("熟練度不足以繼續刷藍天之下");
                        getObj("autoattack").checked = false;
                    }
                }

                if (getObj("autoattack").checked)
                {
                    getObj("tok").innerHTML = "<font color=blue>剩餘秒數讀取中...</font>";

                    if (validMap.indexOf(parseInt(nmp)) >= 0)
                    {
                        if(savedMap.indexOf(parseInt(nmp)) >= 0)
                            battlemap = nmp;

                        spshow = true;

                        await _GameWrapper.DoBattle();
                    }
                }
                else
                {
                    getObj("tok").innerHTML = "<font color=black><b>行動ＯＫ</b></font>";
                }
            }

        }
        catch(ex)
        {
            _Logger.logError(ex);
        }

        setTimeout(to, interval);
    }

    let SelfMake_loading = (msgs, disb) =>
    {
        getObj("tok").innerHTML =("<font color=blue>剩餘秒數讀取中...</font>");
        getObj('rbutton').value=msgs;
        getObj('rbutton').disabled=disb;
        getObj('rbutton2').value=msgs;
        getObj('rbutton2').disabled=disb;
        getObj('rebutton').disabled=disb;
        getObj('rebutton').value=msgs;
        getObj('battlebutton').disabled=disb;
        getObj('townbutton').disabled=disb;
        getObj('statusbutton').disabled=disb;
        getObj('countrybutton').disabled=disb;
    }

    if(DebugMode)
    {
        unsafeWindow.to = SelfMake_to;
        unsafeWindow.loading = SelfMake_loading;

        unsafeWindow.addEventListener('visibilitychange', async () => {
            await _GameWrapper.Refresh();
        }, false);
    }
}

unsafeWindow.Init = async function()
{
    unsafeWindow._XHR = new XHR();
    unsafeWindow._StorageManager = new StorageManager();
    unsafeWindow._UIManager = new UIManager();
    unsafeWindow._HeartBeat = new HeartBeat();
    unsafeWindow._Quest = new Quest();
    unsafeWindow._Bank = new Bank();
    unsafeWindow._Inn = new Inn();
    unsafeWindow._Majo = new Majo();
    unsafeWindow._WareHouse = new WareHouse();
    unsafeWindow._Selector = new Selector();
    unsafeWindow._Logger = new Logger();
    unsafeWindow._DelayHelper = new DelayHelper();
    unsafeWindow._TaskController = new TaskController();
    unsafeWindow._GameWrapper = new GameCoreWrapper();

    unsafeWindow._StorageManager.Initialize();
    unsafeWindow._UIManager.Initialize();

    if(IsCatDingVersion)
        savedMap.push(50);
    Override();
}

unsafeWindow.Init().catch(console.error);

unsafeWindow.onunload = (async function() {
    unsafeWindow._WareHouse.OnLeave();
    unsafeWindow._Majo.OnLeave();
    unsafeWindow._Inn.OnLeave();
    unsafeWindow._Bank.OnLeave();
    unsafeWindow._Quest.OnLeave();
    unsafeWindow._HeartBeat.OnLeave();
    unsafeWindow._UIManager.OnLeave();
    unsafeWindow._StorageManager.OnLeave();
});