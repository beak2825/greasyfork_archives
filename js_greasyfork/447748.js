// ==UserScript==
// @name         SMP
// @namespace    Ken
// @version      1.6
// @description  Auto play gundam game by Tiger
// @author       Ken
// @match        *://www.gundamhk.com/smp.html*
// @match        *://gundamhk.com/smp.html*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require      http://code.jquery.com/ui/1.9.2/jquery-ui.js
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447748/SMP.user.js
// @updateURL https://update.greasyfork.org/scripts/447748/SMP.meta.js
// ==/UserScript==
//===== config =====
const StorageKey = "SMP" + document.domain;
const DefaultDelay = 1 * 1000;
const DefaultMsNumber = 3;
const DefaultVsWait = 5;
//
const DefaultUIPositionTop = 10;
const DefaultUIPositionLeft = 10;
//
const ControllerInterval = 1.5 * 1000;
//
const HomePage = "/smp.html&menu=home";
const VersusPage = "/smp.html&menu=versus";
const Storehouse = "/smp.html&menu=ms";
const Factory = "/smp.html&menu=mill";
const Shop = "/smp.html&menu=mshop";
//==================

//===== Debug config =====
const ShowLog = false;
const ShowInfo = false;
const ShowWarnLog = false;
const ShowErrorLog = true;
const DebugMode = false;
//=========================
class OverrideFetch
{
    Initialize()
    {
        this.newFetch();
    }

    newFetch()
    {
        unsafeWindow.fetch = new Proxy(unsafeWindow.fetch, {
            apply(fetch, that, args) {
                // Forward function call to the original fetch
                const result = fetch.apply(that, args);

                // Do whatever you want with the resulting Promise
                result.then((response) => {
                    if(response.status == 200 && response.url.includes("&menu=versus&action=result"))
                    {
                        _VersusChecker.SetIsBattleEnded(true);
                    }
                    _Logger.logInfo("fetch completed!", args, response);
                });

                return result;
            }
        });
    }
}

class Selector
{
    has(object, key)
    {
        return object ? hasOwnProperty.call(object, key) : false;
    }

    async $(selector, rootnode = unsafeWindow, retry = true, getAll = false)
    {
        var result = rootnode.document.querySelector(selector);
        if(getAll)
        {
            result = rootnode.document.querySelectorAll(selector);
            _Logger.logInfo(typeof result);
        }
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

class CountDownChecker
{
    async DoScript()
    {
        let currentLocation = unsafeWindow.location;
        if(currentLocation.pathname.includes(HomePage))
        {
            let homeCancelButton = (await _Selector.$("#cancel_war", unsafeWindow, false));
            if(homeCancelButton != undefined)
            {
                homeCancelButton.click();
            }
            let homeSecondField = (await _Selector.$("#tdis > #timedis", unsafeWindow, false));
            if(homeSecondField == undefined)
            {
                unsafeWindow.location = Storehouse;
            }
        }
    }
}

class VersusChecker
{
    constructor()
    {
        this.isBattleEnded = false;
    }

    SetIsBattleEnded(bool)
    {
        this.isBattleEnded = bool;
    }

    async DoScript()
    {
        let currentLocation = unsafeWindow.location;
        if(currentLocation.pathname.includes(VersusPage))
        {
            let battleButton = (await _Selector.$("#submit_classbattle", unsafeWindow, false)),
                startButton = (await _Selector.$("#form1 > table > tbody > tr > td > #submit", unsafeWindow, false)),
                selectPlayGrid = (await _Selector.$("span[class='enemyalbum'][onclick*=\"challenge\"]:not([onclick=\"challenge('ai');\"])", unsafeWindow, false, true));
            if($("#IsLeveling").attr('checked') && selectPlayGrid.length > 0)
            {
                let randomSelect = Math.floor(Math.random() * selectPlayGrid.length) + 1;
                selectPlayGrid[randomSelect].click();
            }
            else if(battleButton != undefined)
            {
                await _DelayHelper.sleep();
                battleButton.click();
            }
            else if(startButton != undefined)
            {
                await _DelayHelper.sleep();
                startButton.click();
            }
            else if(currentLocation.pathname.includes('&action=print'))
            {
                await _DelayHelper.sleep();
                if(this.isBattleEnded)
                {
                    await _DelayHelper.sleep(2000);
                    _Logger.logInfo("Battle Ended");
                    unsafeWindow.location = Storehouse;
                }
            }
            else
            {
                var sleepSec = DefaultVsWait;
                let remainTime = (await _Selector.$(".grayfont", unsafeWindow, false));
                if(remainTime != undefined && remainTime.innerText.includes('你還有分'))
                {
                    var remainSec = parseInt(remainTime.innerText.replace(/[^0-9]+/gm, "")) * 60;
                    if(remainSec > 0)
                    {
                        sleepSec = remainSec;
                    }
                }
                await _DelayHelper.sleep(sleepSec * 1000);
                _Logger.logInfo("Versus Page Timer Ended, back to store house");
                unsafeWindow.location = Storehouse;
            }
        }
    }
}

class StorehouseChecker
{
    async DoScript()
    {
        let currentLocation = unsafeWindow.location;
        if(currentLocation.pathname.includes(Storehouse) && !currentLocation.pathname.includes(Shop))
        {
            var repairButton;
            while(repairButton = (await _Selector.$("a[onclick*='javascript:ajax_repair']", unsafeWindow, false)))
            {
                repairButton.click();
                await _DelayHelper.sleep(2000);
            }
            unsafeWindow.location = Factory;
        }
    }
}

class FactoryChecker
{
    async DoScript()
    {
        let currentLocation = unsafeWindow.location;
        if(currentLocation.pathname.includes(Factory))
        {
            let notification = (await _Selector.$(".textfield")).innerText,
                countDown = (await _Selector.$("span[id*='time_']", unsafeWindow, false)),
                countDownAll = (await _Selector.$("span[id*='time_']", unsafeWindow, false, true));
            _Logger.logInfo(notification);
            _Logger.logInfo(countDown);
            if(notification == "管工：「報告，工場內暫時並沒有任何生產中或維修中機體！」")
            {
                unsafeWindow.location = VersusPage;
            }
            else if(countDown == undefined)
            {
                unsafeWindow.location = Factory;
            }
            else
            {
                let factoryAll = (await _Selector.$(".mspic > img", unsafeWindow, false, true)),
                    buildingAll = (await _Selector.$("img[src*='words_prepare.gif']", unsafeWindow, false, true)),
                    imgSrc;
                _Logger.logInfo(factoryAll.length);
                _Logger.logInfo(countDownAll.length);
                _Logger.logInfo(buildingAll.length);
                if(countDownAll.length != factoryAll.length)
                {
                    _Logger.logInfo('Some repair finished');
                    unsafeWindow.location = Factory;
                }
                else if(factoryAll.length == buildingAll.length)
                {
                    _Logger.logInfo('All MS building');
                    unsafeWindow.location = VersusPage;
                }
            }
        }
    }
}

class DelayHelper
{
    async sleep(ms = DefaultDelay)
    {
        return new Promise(r => setTimeout(r, ms));
    }
}

class ConfirmOverride
{
    Initialize()
    {
        this.toConfirm();
    }

    toConfirm()
    {
        window.confirm=function(){
            return true;
        };
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
        this.IsActivate = _StorageManager.Get("isActivate", false);
        this._ZIndex = 0;
        this._top = _StorageManager.Get("top", DefaultUIPositionTop);
        this._left = _StorageManager.Get("left", DefaultUIPositionLeft);
        this.UpdateZIndex();
        this.CreateMainWindow();

        this.CreateControlButton();
    }

    OnLeave()
    {
        _StorageManager.Set("top", this._top);
        _StorageManager.Set("left", this._left);
        _StorageManager.Set("IsLeveling", $("#IsLeveling").attr('checked') == "checked");
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
        $('body').append('<div id = "MainWindow" class = "ui-widget-header">SMP Automation</div>');

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
        $("#MainWindow").append("<div><input type=\"checkbox\" id=\"IsLeveling\">升級機體<div>");
        if(this.IsActivate){
             this.ActiveRoutine();
        }
        $("#StartButton").click(() => {
            if(this.IsActivate)
                return;
            this.IsActivate = true;
            this.ActiveRoutine();
            let currentLocation = unsafeWindow.location;
            if(!currentLocation.pathname.includes(VersusPage))
            {
                unsafeWindow.location = Storehouse;
            }
        });
        $("#StopButton").click(() => {
            if(this.IsActivate == false)
                return;
            this.IsActivate = false;
            _StorageManager.Set('isActivate', false);
            $("#status").html("暫停中");
            $("#status").css("color", "red");
            $("#StopButton").attr("disabled", "disabled");
            $("#StartButton").removeAttr("disabled");

            _TaskController.StopInterval();
            _TaskController.ClearTask();
        });
        if(_StorageManager.Get("IsLeveling", true))
        {
            $("#IsLeveling").attr('checked','checked')
        }
        else
        {
            $("#IsLeveling").removeAttr("checked");
        }
    }

    ActiveRoutine()
    {
        _StorageManager.Set('isActivate', true);
        $("#status").html("執行中");
        $("#status").css("color", "green");
        $("#StartButton").attr("disabled", "disabled");
        $("#StopButton").removeAttr("disabled");

        _TaskController.AddTask(_CountDownChecker.DoScript.bind(_CountDownChecker), 1000);
        _TaskController.AddTask(_VersusChecker.DoScript.bind(_VersusChecker), 1000);
        _TaskController.AddTask(_StorehouseChecker.DoScript.bind(_StorehouseChecker), 1000);
        _TaskController.AddTask(_FactoryChecker.DoScript.bind(_FactoryChecker), 1000);

        _TaskController.StartInterval();
    }
}

unsafeWindow.Init = async function()
{
    unsafeWindow._StorageManager = new StorageManager();
    unsafeWindow._UIManager = new UIManager();
    unsafeWindow._Selector = new Selector();
    unsafeWindow._Logger = new Logger();
    unsafeWindow._CountDownChecker = new CountDownChecker();
    unsafeWindow._VersusChecker = new VersusChecker();
    unsafeWindow._StorehouseChecker = new StorehouseChecker();
    unsafeWindow._FactoryChecker = new FactoryChecker();
    unsafeWindow._DelayHelper = new DelayHelper();
    unsafeWindow._ConfirmOverride = new ConfirmOverride();
    unsafeWindow._OverrideFetch = new OverrideFetch();
    unsafeWindow._TaskController = new TaskController();

    unsafeWindow._StorageManager.Initialize();
    unsafeWindow._UIManager.Initialize();
    unsafeWindow._OverrideFetch.Initialize();
    unsafeWindow._ConfirmOverride.Initialize();
}

unsafeWindow.Init().catch(console.error);

unsafeWindow.onunload = (async function() {
    unsafeWindow._UIManager.OnLeave();
    unsafeWindow._StorageManager.OnLeave();
});