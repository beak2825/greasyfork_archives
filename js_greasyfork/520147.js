auto.waitFor();
global.AppName = "快手极速版";
global.packageName = "com.kuaishou.nebula";
global.running = false; //是否正在刷视频中
global.working = false; //是否正在刷视频中
global.pause = false; //是否暂停
global.startSec = Date.now();//刷视频计时
global.img_block = storages.create("gifshow").get('img_block');
global.ver = 'v1.5';//版本号
if (!auto.service || device.width == 0) {
    console.warn("2.请重新开启无障碍服务");
    auto.service.disableSelf();
    app.startActivity({ action: "android.settings.ACCESSIBILITY_SETTINGS" });
    android.os.Process.killProcess(android.os.Process.myPid());
}
if (device.fingerprint + '/' + ver != storages.create("gifshow").get('device_info')) { setTimeout(function () { update(); }, 60 * 1000); }
engines.all().map((ScriptEngine) => { if (engines.myEngine().toString() !== ScriptEngine.toString()) { ScriptEngine.forceStop(); } });

//判断签到层
function singlecheck() {
    toastLog('判断签到提示');
    var xbox = textMatches(/倒计时结束.*|开宝箱奖励.*/).visibleToUser(true).findOne(1000);
    if (xbox) { click(xbox.parent().parent().parent().child(0).bounds()); }
    var today = new Date();
    if (storages.create("gifshow").get('singlecheck') == today.getDate()) {
        toastLog('今天已完成签到');
        return;
    }
    //查找立即签到
    var single = className('Button').textMatches(/立即签到/).clickable(true).visibleToUser(true).findOne(1000);
    if (single) {
        toastLog('1.点击立即签到');
        single.click();
        sleep(3000);

        toastLog('2.再次点击签到');
        click(single.bounds());
        sleep(3000);
        back();

        toastLog('3.签到结束关闭');
    } else {
        toastLog('没有签到提示');
    }
    storages.create("gifshow").put('singlecheck', today.getDate());//记录是否检测过签到
}
//装载任务列表
function tasklist() {
    toastLog('查找金币暴涨tasklist');
    if (!textMatches(/金币暴涨|我的现金/).visibleToUser(true).findOne(1000)) {
        gotask();
        sleep(8000);
        singlecheck();//判断签到层
        //关闭弹出层
        var popup = className('Image').text('huge_sign_marketing_popup').visibleToUser(true).findOne(1000);
        if (popup) { popup.parent().parent().find(className('Image'))[0].click(); }
        //弹出宝箱层
        var xbox = textMatches(/倒计时结束.*|开宝箱奖励.*/).visibleToUser(true).findOne(1000);
        if (xbox) { click(xbox.parent().parent().parent().child(0).bounds()); }
    }
    var temparr = [];
    var TempArray = new Array();
    if (textMatches(/金币暴涨|我的现金/).visibleToUser(true).findOne(1000)) {
        toast('装载任务');
        idMatches(/.*dailyTask/).visibleToUser(true).find().forEach(function (tv) {
            let list = tv.children();
            //log(list);
            for (i = 0; i < list.length; i++) {
                let title = list[i].find(className('android.view.View'));
                for (j = 0; j < title.length; j++) {
                    if (title[j]) {
                        //log(title[j].text());
                        if (title[j].text().match(/.*个作品|看广告得.*|连续签到.*|.*次直播领金币|刷广告视频赚金币|看指定视频赚金币|搜索看广告赚金币/)) {
                            if (title[j].parent().parent().find(text('已完成').clickable(true)).length == 0) {
                                let btn = title[j].parent().parent().find(className('android.view.View').clickable(true));
                                //log(title[j].text());
                                temparr.push(title[j].text());
                                let temp = [title[j].text(), btn[1]];
                                TempArray.push(temp);
                            }
                        }
                    }
                }
            }
        });
        console.error('装载完成:', temparr);
        toast('装载完成');
        var btn = className('android.view.View').textMatches(/.*金币立即领取/).visibleToUser(true).findOne(1000);
        if (btn) { btn.parent().click(); sleep(2000); }
        var btn = className('Button').textMatches(/继续赚钱/).visibleToUser(true).findOne(1000);
        if (btn) { click(btn.parent().child(0).bounds()); }
        var btn = textMatches(/倒计时结束.*|开宝箱奖励.*/).visibleToUser(true).findOne(1000);
        if (btn) { click(btn.parent().parent().parent().child(0).bounds()); }
    } else {
        toastLog('没有找到金币暴涨tasklist');
    }
    return TempArray;
}
//点击右下角宝箱函数
function moneybox() {
    toastLog('查找右下角宝箱moneybox');
    if (!textMatches(/金币暴涨|我的现金/).visibleToUser(true).findOne(1000)) {
        gotask();
        sleep(8000);
        singlecheck();//判断签到层
        //关闭弹出层
        var popup = className('Image').text('huge_sign_marketing_popup').visibleToUser(true).findOne(1000);
        if (popup) { popup.parent().parent().find(className('Image'))[0].click(); }
        //弹出宝箱层
        var xbox = textMatches(/倒计时结束.*|开宝箱奖励.*/).visibleToUser(true).findOne(1000);
        if (xbox) { click(xbox.parent().parent().parent().child(0).bounds()); }
    }

    if (textMatches(/金币暴涨|我的现金/).visibleToUser(true).findOne(1000)) {
        console.error('开宝箱');
        click(device.width - 150, device.height - 300);
        sleep(4000);
    } else {
        toastLog('没有找到金币暴涨moneybox');
        return;
    }

    var xbox = textMatches(/倒计时结束.*|开宝箱奖励.*/).visibleToUser(true).findOne(1000);
    if (xbox) { click(xbox.parent().parent().parent().child(0).bounds()); }

    if (1 == 2) {
        //倒计时结束，才能开宝箱哦
        xbtn = className('Button').textMatches(/去看广告得最高.*/).visibleToUser(true).findOne(1000);
        if (xbtn) {
            console.error('点宝箱:', xbtn.text());
            click(xbtn.bounds());//再次点弹出宝箱层中的红色按钮
            sleep(5000);
        } else {
            var popdiv = textMatches(/倒计时结束.*/).visibleToUser(true).findOne(1000);
            if (popdiv) {
                toastLog('宝箱：' + popdiv.text());
                click(popdiv.parent().parent().parent().child(0).bounds());
            } else {
                toastLog('1.未进入宝箱视频');
            }
            return;
        }
    }

    //如果进入看视频赚金币则观看视频
    let advedio = idMatches(/.*countdown_info_container/).boundsInside(0, 0, device.width, 500).visibleToUser(true).findOne(1000);
    let liveing = idMatches(/.*live_close_container/).boundsInside(device.width - 500, 0, device.width, 500).visibleToUser(true).findOne(1000);
    if (advedio || liveing) {
        playvideo('BOX');
        console.error('宝箱任务结束moneybox');
    } else {
        toastLog('2.未进入宝箱视频');
    }
}

//判断进入看广告视频赚金币
function playvideo(m) {
    //签到日历
    if (text('签到日历').visibleToUser(true).findOne(1000)) { back(); return; }
    working = true;
    console.error('开始循环赚金币playvideo');
    function stopvideo(n) {
        sleep(1000);
        if (textMatches(/金币暴涨|我的现金/).visibleToUser(true).findOne(1000)) {
            console.log(n + '.end');
            return;
        }
        //操作弹出提示
        var okbtn = className('TextView').textMatches(/再看[0-9]+秒.*/).visibleToUser(true).findOne(1000);
        if (okbtn) {
            let btn = className('TextView').text('放弃奖励').visibleToUser(true).findOne(1000);
            if (btn) click(btn.bounds().centerX(), btn.bounds().centerY() - 120);
            var b = okbtn.text().match(/\d+/)[0] || 1;
            var t = 1 * b + random(9, 15);
            cutDownBySleep(t, '再看');
        }
        okbtn = className('TextView').textMatches(/领取奖励/).visibleToUser(true).findOne(1000);
        if (okbtn) {
            if (className('TextView').textMatches(/再看一个.*/).visibleToUser(true).findOne(1000)) {
                console.log(n + '.end');
                click(okbtn.bounds());
                console.log(n + '.再看一个');
                playvideo(n);
                return;
            }
            click(okbtn.bounds());
            console.log(n + '.' + okbtn.text());
        }
        okbtn = className('Button').textMatches(/继续赚金币/).visibleToUser(true).findOne(1000);
        if (okbtn) {
            console.log(n + '.继续赚金币');
            click(okbtn.bounds());
            cutDownBySleep(random(9, 15), okbtn.text());
        }
        okbtn = idMatches(/.*live_close_container/).visibleToUser(true).findOne(1000);
        if (okbtn) {
            console.log(n + '.退出直播间');
            click(okbtn.bounds());
            sleep(1000);
        }
        okbtn = className('TextView').textMatches(/放弃奖励|退出.*/).visibleToUser(true).findOne(1000);
        if (okbtn) {
            console.log(n + '.' + okbtn.text());
            click(okbtn.bounds());
        }
        okbtn = textMatches(/倒计时结束.*|开宝箱奖励.*/).visibleToUser(true).findOne(1000);
        if (okbtn) {
            console.log(n + '.' + okbtn.text());
            click(okbtn.parent().parent().parent().child(0).bounds());
        }
        console.log(n + '.end');
        sleep(1000);
    }
    function stoplive(n) {
        sleep(1000);
        let okbtn = className('TextView').textMatches(/继续观看|领取奖励|退出.*/).visibleToUser(true).findOne(1000);
        while (okbtn) {
            working = true;
            click(okbtn.bounds());
            sleep(1000);
            if (okbtn.text() == '继续观看') {
                console.log('点击继续观看');
                let a = idMatches(/.*close_dialog_title/).className('TextView').visibleToUser(true).findOne(1000);
                let t = a ? a.text().match(/\d+/)[0] : random(5, 9);
                cutDownBySleep(t, n);
                liveing = idMatches(/.*live_close_container/).boundsInside(0, 0, device.width, 500).visibleToUser(true).findOne(2000);
                if (liveing) {
                    console.log('点击退出直播间2');
                    click(liveing.bounds());
                    sleep(2000);
                    okbtn = className('TextView').textMatches(/继续观看|领取奖励|退出.*/).visibleToUser(true).findOne(1000);
                } else {
                    console.log('点击退出看广告2');
                    stopvideo(n);
                    okbtn = null;
                }
            } else {
                break;
            }
        }
        sleep(1000);
    }
    var block = className('TextView').textMatches(/.*进入直播间.*/).clickable(true).visibleToUser(true).findOne(1000);
    while (block) {
        slidingByCurve();
        sleep(2000);
        block = className('TextView').textMatches(/.*进入直播间.*/).clickable(true).visibleToUser(true).findOne(1000);
    }

    if (m == '点赞1个作品') { toastLog(m); randomHeart(9); sleep(1000); working = false; gotask(); return; }
    if (m == '评论1个作品') { toastLog(m); randomHeart(8); sleep(1000); working = false; gotask(); return; }
    if (m == '收藏1个作品') { toastLog(m); randomHeart(7); sleep(1000); working = false; gotask(); return; }

    //看广告得金币/宝箱中看广告
    let i = 0;
    var liveing = idMatches(/.*live_close_container/).boundsInside(0, 0, device.width, 500).visibleToUser(true).findOne(2000);
    var okbtn = className('TextView').textMatches(/[0-9]+s后可领取.*|.*领取观看奖励|已成功领取.*/).boundsInside(0, 0, device.width / 2, 300).visibleToUser(true).findOne(1000);
    while (okbtn || liveing) {
        i++;
        console.log(m + '.1.' + i);
        working = true;
        if (okbtn) {
            var b = okbtn.text().match(/^\d+/);
            var t = 1 * (b ? b[0] : 1) + random(9, 15);
            cutDownBySleep(t, m);
            //点击左上角或back()
            click(okbtn.bounds());
            stopvideo(m);
        }
        if (liveing) {
            var t = random(9, 15);
            cutDownBySleep(t, m);
            //点击右上角退出直播间
            click(liveing.bounds());
            sleep(1000);
            stoplive(m);
        }
        if (i < 60 && m != 'BOX') {
            sleep(1000);
            //如果退出到任务页面，则再次进入
            let tips = className('android.view.View').textMatches(/看广告得[0-9.]+万金币/).findOne(1000);
            //log('再次进入::::',tips);
            if (tips) {
                let progress = tips.parent().find(textMatches(/单日最高赚[0-9.]+万金币.*/));
                //log('再次进入####',progress[0]);
                if (progress) {
                    //如果没完成100/100
                    if (!percent(progress[0].text())) {
                        console.log('再次进入:', progress[0].text());//进度不刷新，需要重启软件
                        //再次进入看广告得金币
                        tips.parent().parent().click();//因为不在视窗范围内，所以不可以点坐标
                        sleep(3000);
                        okbtn = className('TextView').textMatches(/[0-9]+s后可领取.*|已成功领取.*/).boundsInside(0, 0, device.width / 2, 300).visibleToUser(true).findOne(1000);
                        continue;
                    } else {
                        toastLog(m + '已完成');
                        break;
                    }
                }
            }
        } else {
            break;
        }
        okbtn = className('TextView').textMatches(/[0-9]+s后可领取.*|已成功领取.*/).boundsInside(0, 0, device.width / 2, 300).visibleToUser(true).findOne(1000);
    }

    //看n次直播领金币
    let title = className('TextView').text('看直播领金币').visibleToUser(true).findOne(1000);
    if (title) {
        var btn = idMatches(/.*progress_display/).visibleToUser(true).findOne(1000);
        if (btn) { if (percent(btn.text())) { toastLog(m + btn.text()); idMatches(/.*left_btn/).desc("返回").clickable(true).click(); return; } }
        //选择直播间
        let view = idMatches(/.*recycler_view/).findOne(1000);
        if (view) {
            var livingarr = new Array(); i = 0;
            while (i < 99 && title) {
                console.log(m + '.2.' + i);
                for (j = 0; j < view.childCount(); j++) {
                    if (view.child(j)) {
                        var tip = view.child(j).find(className('TextView'))[0].text();
                        if (!livingarr.includes(tip)) {
                            i++;
                            toastLog(m + '.' + i + '.' + tip);
                            livingarr[j] = tip;
                            view.child(j).click();//进入直播间
                            sleep(5000);
                            var liveing = idMatches(/.*live_close_container/).boundsInside(0, 0, device.width, 500).visibleToUser(true).findOne(2000);
                            if (liveing) {
                                cutDownBySleep(random(10, 15), tip);
                                click(liveing.bounds());
                                sleep(1000);
                                stoplive(tip);
                            } else {
                                toastLog('未进入:' + tip);
                            }
                            var btn = idMatches(/.*\/close|.*\/anchor_close/).visibleToUser(true).findOne(1000);
                            if (btn) { console.log('关闭弹出'); click(btn.bounds()); sleep(1000); }
                            var btn = className('TextView').textMatches(/放弃奖励|退出.*/).visibleToUser(true).findOne(1000);
                            if (btn) { click(btn.bounds()); sleep(1000); }
                            var btn = idMatches(/.*progress_display/).visibleToUser(true).findOne(1000);
                            if (btn) { if (percent(btn.text())) { toastLog(m + btn.text()); idMatches(/.*left_btn/).desc("返回").clickable(true).click(); return; } }
                            view = idMatches(/.*recycler_view/).findOne(1000);
                            if (!view) break;
                        }
                    }
                    var liveing = idMatches(/.*live_close_container/).boundsInside(0, 0, device.width, 500).visibleToUser(true).findOne(2000);
                    if (liveing) {
                        click(liveing.bounds());
                        var btn = idMatches(/.*\/close|.*\/anchor_close/).visibleToUser(true).findOne(1000);
                        if (btn) { console.log('关闭弹出'); click(btn.bounds()); sleep(1000); }
                        var btn = className('TextView').textMatches(/放弃奖励|退出.*/).visibleToUser(true).findOne(1000);
                        if (btn) { click(btn.bounds()); sleep(1000); }
                        var btn = idMatches(/.*progress_display/).visibleToUser(true).findOne(1000);
                        if (btn) { if (percent(btn.text())) { toastLog(m + btn.text()); idMatches(/.*left_btn/).desc("返回").clickable(true).click(); return; } }
                    }
                    //log('看直播：',j);
                }
                if (i > random(10, 15)) {
                    log('=============', (i * 4 + j + 1));
                    break;
                }
                view.scrollForward(); sleep(3000);
                view = idMatches(/.*recycler_view/).findOne(1000);
                title = className('TextView').text('看直播领金币').visibleToUser(true).findOne(1000);
            }
        }
    }
    //刷广告视频赚金币/看指定视频赚金币
    let back_btn = idMatches(/.*left_btn/).desc("返回").clickable(true).boundsInside(0, 0, 500, 500).visibleToUser(true).findOne(1000);
    if (back_btn) {
        i = 0;//刷广告
        var award = idMatches(/.*award_shopping_count_text_view/).visibleToUser(true).findOne(1000);
        while (award) {
            i++;
            console.log(m + '.3.' + award.text().split("/")[0]);
            cutDownBySleep(random(9, 25), m);
            slidingByCurve();
            award = idMatches(/.*award_shopping_count_text_view/).visibleToUser(true).findOne(1000);
            if (award && percent(award.text())) break;
            if (i > 20) break;
        }
        i = 0;//看视频
        var award = idMatches(/.*camera_btn/).clickable(true).visibleToUser(true).findOne(1000);
        while (award) {
            i++;
            console.log(m + '.4.' + i);
            let tip = className('TextView').textMatches(/看视频|查看收益/).visibleToUser(true).findOne(1000);
            if (tip) {
                if (tip.text() == '看视频') {
                    cutDownBySleep(random(9, 25), m);
                } else {
                    i = 45;
                }
            }
            slidingByCurve();
            award = idMatches(/.*camera_btn/).clickable(true).visibleToUser(true).findOne(1000);
            if (i > 50) break;
        }
        click(back_btn.bounds());
    }
    //看短剧得金币
    let player = null;//className('com.kwai.kds.player.TextureRenderView').visibleToUser(true).findOne(1000);
    if (player) {
        for (i = 0; i < 5; i++) {
            console.log(m + '.5.' + i);
            cutDownBySleep(random(6, 20), m);
            click(player.bounds().left + 70, player.bounds().top - 70);
            var okbtn = className('TextView').textMatches(/再看[0-9]+秒.*/).visibleToUser(true).findOne(1000);
            if (okbtn) {
                sleep(1500);
                let btn = className('TextView').text('放弃奖励').visibleToUser(true).findOne(1000);
                if (btn) click(btn.bounds().centerX(), btn.bounds().centerY() - 120);
                var b = okbtn.text().match(/\d+/)[0] || 1;
                var t = 1 * b + random(5, 9);
                cutDownBySleep(t, m);
            }
            slidingByCurve();
            player = className('com.kwai.kds.player.TextureRenderView').visibleToUser(true).findOne(1000);
            if (!player) break;
        }
        if (player) { click(player.bounds().left + 70, player.bounds().top - 70); }
        sleep(3000);
    }
    //搜索：看视频/直播最高赚，已完成20/20
    var living = className('TextView').text('看视频/直播最高赚').visibleToUser(true).findOne(1000);
    if (living) {
        var btn = textMatches(/已完成.*/).visibleToUser(true).findOne(1000);
        if (btn) { if (percent(btn.text())) { toastLog(m + btn.text()); idMatches(/.*left_btn/).desc("返回").clickable(true).click(); return; } }
        let view = className('android.widget.ScrollView').visibleToUser(true).findOne(1000);
        if (view) {
            var livingarr = new Array(); i = 0;
            while (i < 99 && view) {
                console.log(m + '.2.' + view.childCount());
                for (j = 0; j < view.childCount(); j++) {
                    if (view.child(j)) {
                        var tips = view.child(j).find(className('TextView'));
                        var tip = tips ? tips[tips.length - 1].text() : '无法取得标题';
                        if (!livingarr.includes(tip)) {
                            i++;
                            toastLog(m + '.' + i + '.' + tip);
                            livingarr[j] = tip;
                            view.child(j).click();//点击进入
                            sleep(5000);
                            var okbtn = className('TextView').textMatches(/.*后可领取.*|已成功领取奖励|已完成.*/).boundsInside(0, 0, device.width / 2, 500).visibleToUser(true).findOne(1000);
                            if (okbtn) {
                                i++;
                                console.log(m + '.1.' + i);
                                var b = okbtn.text().match(/^\d+/);
                                var t = 1 * (b ? b[0] : 1) + random(5, 9);
                                cutDownBySleep(t, m);
                                //点击左上角或back()
                                click(okbtn.bounds());
                                sleep(1000);
                                stopvideo(m);
                            }
                            var liveing = idMatches(/.*live_close_container/).boundsInside(device.width - 500, 0, device.width, 500).visibleToUser(true).findOne(1000);
                            if (liveing) {
                                toastLog('已进入2:' + tip);
                                sleep(5000);
                                var videoDuration = 0;
                                var durationText = idMatches(/.*neo_count_down_text/).visibleToUser(true).findOne(1000);
                                if (durationText) {
                                    videoDuration = getDouyinVideoDuration(durationText.text());
                                }
                                var sleepTime = (videoDuration > 0 && videoDuration < 90) ? videoDuration : random(6, 30);
                                cutDownBySleep(sleepTime, tip);
                                click(liveing.bounds());
                                sleep(1000);
                                stoplive(m);
                            }
                            okbtn = className('TextView').textMatches(/退出.*|放弃奖励|已成功领取奖励/).visibleToUser(true).findOne(1000);
                            if (okbtn) {
                                click(okbtn.bounds());
                            } else {
                                back();
                            }
                            btn = textMatches(/已完成.*/).visibleToUser(true).findOne(1000);
                            if (btn) { if (percent(btn.text())) { toastLog(m + btn.text()); idMatches(/.*left_btn/).desc("返回").clickable(true).click(); return; } }
                            sleep(2000);
                        }
                    }
                }
                view.scrollForward(); sleep(3000);
                view = className('android.widget.ScrollView').visibleToUser(true).findOne(1000);
            }
        }
    }

    //返回
    if (!textMatches(/金币暴涨|我的现金/).visibleToUser(true).findOne(1000)) {
        back(); sleep(1000);
        var btn = className('TextView').text('放弃奖励').visibleToUser(true).findOne(1000);
        if (btn) { click(btn.bounds()); sleep(1000); }
        gotask();
        sleep(1000);
    }
    console.error('循环赚金币结束playvideo');
    working = false;
}


//主程序函数===============================================================
function Main() {
    var loopTimes = random(3, 5); //work循环次数
    function work() {
        toastLog("开始工作work");
        var listArray = tasklist();
        if (listArray.length > 0) {
            sleep(3000);
            toastLog('开始做任务');
            for (i = 0; i < listArray.length; i++) {
                if (listArray[i][1]) {
                    toastLog(i + '.' + listArray[i][0]);
                    //点击任务,这里不可以用坐标点击，因为有的条目可能会在屏幕外面
                    listArray[i][1].click();
                    sleep(1000);
                    playvideo(listArray[i][0]);
                }
            }
        } else {
            toastLog('任务装载失败，需要重启软件');
            sleep(2000);
            return;
        }
        //开宝箱
        moneybox();
        //回到首页准备刷视频
        console.error("开始刷视频模式+++++++++++++");
        gohome(); startSec = Date.now(); gogogo(999);
        console.error("刷视频模式结束+++++++++++++");
    }
    //打开快手App
    if (getPackageName(AppName)) {
        openApp(AppName);
        //等待进入主界面成功
        toastLog('进入主函数' + ver);
        gohome();
        sleep(3000);
        toastLog("刚启动先刷视频提高活跃度");
        startSec = Date.now();
        gogogo(999);

        while (loopTimes > 0) {
            gotask();
            work();//开始工作
            //由于看广告得金币进度不刷新，所以需要重启软件
            sleep(1000);
            closeApp(AppName);
            sleep(5000);
            openApp(AppName);
            sleep(3000);
            loopTimes--;
        }

        console.clear();
        console.warn('运行结束关闭应用');
    } else {
        console.warn("未安装:" + AppName);
        work_thread.interrupt();
        device.cancelKeepingAwake();
        engines.myEngine().forceStop();
        return;
    }
    console.show();
    console.warn('执行完成用时' + SecondsToHMS((Date.now() - starttime) / 1000));
    cutDownBySleep(5, '5秒后进入息屏挂机模式');
    console.hide();
    closeApp(AppName);
    sleep(3000);
    oled(random(600, 900));//熄屏挂机约10~15分钟左右
}
function getHomeBtn() {
    var homepage = idMatches(/.*left_btn|.*thanos_home_top_search/).clickable(true).boundsInside(0, 0, 500, 500).visibleToUser(true).findOne(1000);
    var topbtn = descMatches(/发现|关注/).selected(true).boundsInside(0, 0, device.width, 500).visibleToUser(true).findOne(1000);
    return (homepage != null && topbtn != null);
}
function gohome() {
    function closediv() {
        toastLog('检测关闭弹出层');
        //关闭弹出层
        var btn = className('TextView').text('放弃奖励').visibleToUser(true).findOne(1000);
        if (btn) { click(btn.bounds()); sleep(1000); }
        var popdiv = className('Image').text('huge_sign_marketing_popup').visibleToUser(true).findOne(1000);
        if (popdiv) { click(popdiv.parent().parent().child(0).bounds()); sleep(1000); }
        var liveing = idMatches(/.*live_close_container/).boundsInside(0, 0, device.width, 500).visibleToUser(true).findOne(2000);
        if (liveing) {
            click(liveing.bounds()); sleep(1000);
            let okbtn = className('TextView').textMatches(/.*退出.*/).visibleToUser(true).findOne(1000);
            if (okbtn) { click(okbtn.bounds()); sleep(1000); }
        }
    }
    toastLog('回到首页gohome');
    closediv();
    var homepage = idMatches(/.*left_btn|.*thanos_home_top_search/).clickable(true).boundsInside(0, 0, 500, 500).visibleToUser(true).findOne(1000);
    if (!homepage) {
        var MaxLoop = 5;
        while (!homepage && MaxLoop > 0) {
            MaxLoop--;
            back(); sleep(3000); closediv();
            var okbtn = className('TextView').textMatches(/退出.*/).visibleToUser(true).findOne(1000);
            if (okbtn) { okbtn.click(); sleep(3000); }
            homepage = idMatches(/.*left_btn|.*thanos_home_top_search/).clickable(true).boundsInside(0, 0, 500, 500).visibleToUser(true).findOne(1000);
        }
    }
    if (homepage) {
        var btn = idMatches(/.*textView/).desc("发现").visibleToUser(true).findOne(1000);
        if (btn) { click(btn.bounds()); sleep(3000); }
    } else {
        toastLog('需要重启软件【截图】');
        //截图保存界面，以备后续查看
        captureScreen(files.getSdcardPath() + '/脚本/gohome1_' + currentActivity() + '.jpg');
        sleep(1000);
        device.wakeUp();//唤醒设备
        sleep(1000);
        left2right(1);
        sleep(1000);
        closeApp(AppName);
        sleep(5000);
        openApp(AppName);
        sleep(1000);
    }
}
function gotask() {
    let moneybtn = className('androidx.appcompat.app.ActionBar$c').desc('去赚钱').clickable(true).boundsInside(device.width / 2, device.height - 300, device.width, device.height).visibleToUser(true).findOne(1000);
    if (!moneybtn) {
        gohome();
        moneybtn = className('androidx.appcompat.app.ActionBar$c').desc('去赚钱').clickable(true).boundsInside(device.width / 2, device.height - 300, device.width, device.height).visibleToUser(true).findOne(1000);
    }
    if (moneybtn) {
        console.error('点击去赚钱gotask');
        click(moneybtn.bounds());
    }
}
function weightedRandom(weights) {
    let sum = 0;
    for (let key in weights) {
        sum += weights[key];
    }
    let randomNumber = Math.random() * sum;
    for (let key in weights) {
        randomNumber -= weights[key];
        if (randomNumber <= 0) {
            return key;
        }
    }
}
function randomHeart(num) {
    if (idMatches(/.*center/).text('请完成安全验证').visibleToUser(true).findOne(1000)) { return; }
    const weights = {
        1: 0.01, 2: 0.02, 3: 0.03, 4: 0.04, 5: 0.05,
        6: 0.06, 7: 0.07, 8: 0.08, 9: 0.09, 0: 0.55
    };
    let randomIndex = num ? num : weightedRandom(weights);
    //随机下滑
    if (randomIndex == 1) {
        console.log('拟人:随机下滑');
        swipe(device.width / 2, device.height * 0.1 + randomIndex, device.width / 2, device.height * 0.9 - randomIndex, random(500, 1500));
        return;
    }
    //连续上滑
    if (randomIndex == 2) {
        console.log('拟人:连续上滑');
        var k = random(2, 4);
        for (var i = 0; i < k; i++) {
            var j = random(2, 5);
            if (j == 3) {
                swipe(device.width / j, device.height * 0.2 + j * k, device.width / j, device.height * 0.8 - j * k, j * 50);
            } else {
                swipe(device.width / j, device.height * 0.8 - j * k, device.width / j, device.height * 0.2 + j * k, j * 50);
            }
            sleep(j * 250);
        }
        return;
    }

    //随机恢复到首页
    if (randomIndex == 4) {
        console.log('拟人:随机回首页');
        gohome();
        return;
    }
    //加速播放
    if (randomIndex == 5) {
        var seekBar = className('android.widget.SeekBar').descMatches(/.*进度条.*/).findOne(1000);
        if (seekBar) {
            let x1 = random(90, 120);
            let y1 = device.height / 3;
            gestures([0, 1500, [x1, y1], [x1, y1]], [1400, 1500, [x1, y1], [1.1 * x1, 2 * y1]]);
            return;
        }
    }

    //随机收藏
    if (randomIndex == 7) {
        var collect = idMatches(/.*click_area_collect/).clickable(true).boundsInside(device.width - 500, device.height / 2, device.width, device.height).visibleToUser(true).findOne(1000);
        if (collect) {
            console.log('拟人:随机收藏');
            click(collect.bounds());
            sleep(3000);
            slidingByCurve();
            return;
        }
    }
    //随机评论
    if (randomIndex == 8) {
        var plug = idMatches(/.*comment_element_click_layout/).longClickable(true).boundsInside(device.width - 500, device.height / 2, device.width, device.height).visibleToUser(true).findOne(1000);
        if (plug) {
            console.log('拟人:随机评论');
            //长按评论按钮
            longClick(plug.bounds());
            sleep(1000);
            var plugdiv = idMatches(/.*emoji_quick_send_list/).visibleToUser(true).findOne(1000);
            if (plugdiv) {
                let emoji = plugdiv.find(className('ImageView'));
                let icoY = emoji[0].bounds().centerY();
                let icoX = [
                    emoji[0].bounds().centerX(),
                    emoji[1].bounds().centerX(),
                    emoji[2].bounds().centerX(),
                    emoji[3].bounds().centerX()
                ];
                let index = random(2, icoX.length) - 1;
                //console.log(icoX[index],icoY);
                click(icoX[index], icoY);
                sleep(3000);
                slidingByCurve();
                return;
            }
        }
    }
    //随机点赞
    if (randomIndex == 9) {
        var like = idMatches(/.*like_element_click_layout/).clickable(true).boundsInside(device.width - 500, device.height / 2, device.width, device.height).visibleToUser(true).findOne(1000);
        if (like) {
            console.log('拟人:随机点赞');
            click(like.bounds());
            sleep(3000);
            slidingByCurve();
            return;
        }
    }
    //上滑
    slidingByCurve();
}
function isvideoPage() {
    console.verbose("检测是否视频播放中isvideoPage");
    var isvideo = false;
    var homepage = getHomeBtn();
    if (homepage) {
        //关闭自动弹出的层
        var div1 = idMatches(/.*design_bottom_sheet.*|.*content_nest.*|.*recyclerView.*/).visibleToUser(true).findOne(1000);
        if (div1) {
            isvideo = true;
            toastLog('0.关闭弹出层');
            click(80, 150);
            sleep(1000);slidingByCurve();sleep(1000);
        }
        var living = idMatches(/.*live_close_container/).boundsInside(0, 0, device.width, 500).visibleToUser(true).findOne(1000);//直播间
        if (living) {
            isvideo = true;
            toastLog("1.退出直播间");
            click(living.bounds());
            sleep(1000);slidingByCurve();sleep(1000);
            var div0 = text('退出直播间').visibleToUser(true).findOne(1000);
            if (div0) click(div0.bounds());
            sleep(1000);slidingByCurve();sleep(1000);
        }
        var block = textMatches(/.*进入直播间.*/).clickable(true).visibleToUser(true).findOne(1000);
        if (block) {
            isvideo = true;
            slidingByCurve();
            sleep(2000);
        }
        isvideo = idMatches(/.*nasa_groot_view_pager/).visibleToUser(true).findOne(1000);
        var block = textMatches(/.*填充拼图|.*使图片角度为正|请依次点击.*/).visibleToUser(true).findOne(1000);
        if (block) { isvideo = false; }
        //log(isvideo);
    }
    return isvideo;
}
function gogogo(n) {
    let gotime = random(15, 20); //刷视频每n分钟结束一次
    for (var i = 1; i <= n; i++) {
        running = true;
        let flashtime = parseInt((Date.now() - startSec) / 1000);
        console.log('第' + i + '次刷视频，累计用时:', flashtime, '秒');
        if (flashtime > gotime * 60) { console.warn(gotime + '分种超时，停止刷视频'); running = false; floaty.closeAll(); break; }
        if (!pause) {
            if (isvideoPage()) {
                var videoDuration = 0;
                var seekBar = idMatches(/.*\/root/).desc('暂停视频').visibleToUser(true).findOne(1000);
                if (seekBar) {
                    let duration_thread = threads.start(function () {
                        var durationText = className('TextView').textMatches(/[0-9]+:[0-9]+/).boundsInside(device.width / 2, 2 * device.height / 3, device.width, device.height).findOne(2000);
                        if (durationText) {
                            videoDuration = getDouyinVideoDuration(durationText.text());
                        }
                        duration_thread.interrupt();
                    });
                    let block = className('android.widget.HorizontalScrollView').idMatches(/.*\/tab_layout/).findOne(1000);
                    let y1 = block.bounds().top - 10;
                    let x1 = random(300, 400);
                    let x2 = random(600, 700);
                    gesture(random(800, 1200), [[x1, y1], [x2, y1], [10 + x1, y1]]);
                    console.log("视频时长:", videoDuration + 's');
                }
                var sleepTime = (videoDuration > 0 && videoDuration < 90) ? videoDuration : random(6, 30);
                cutDownBySleep(sleepTime, '观看视频:');//每个视频随机时间 6-30s
                randomHeart();//拟人化
            } else {
                running = false;
                toastLog('not at the video page');
                var dialog = currentActivity();
                if (!dialog.match(/android\.app\.Dialog|android\.widget\.FrameLayout|.*creenCaptureRequestActivity|.*IdentityDialogActivity|.*FaceRecognitionActivity/)) {
                    //截图保存界面，以备后续查看
                    console.info('【gogogo截图】', dialog);
                    captureScreen(files.getSdcardPath() + '/脚本/gogogo_' + dialog + '.jpg');
                    gohome();
                }
                sleep(3000);
            }
        } else {
            sleep(3000);
            i--;
        }
    }
    running = false;
}
function cutDownBySleep(lasterSecend, message) {
    message = message || "";
    floaty.closeAll();
    var fwin = floaty.rawWindow(
        `<vertical id="frame" alpha="0" w="{{device.width-500}}px" h="150px">
            <card id="card" w="auto" h="auto" layout_gravity="center" cardCornerRadius="5dp" cardBackgroundColor="#eeeeee" >
                <text id="title" text="" w="auto" textColor="#333333" textSize="13sp" padding="12 8" />
            </card>
        </vertical>`
    );
    fwin.setTouchable(true);
    fwin.frame.on("click", () => {
        pause = !pause;
        console.log(pause ? '脚本暂停:' + message : '脚本继续:' + message);
        fwin.card.attr("cardBackgroundColor", pause ? "#ff0000" : "#eeeeee");
    });
    sleep(500);
    for (let i = lasterSecend; i > 0; i--) {
        if (!running && !working) { log('sleep1', running, working); break; }
        if (!fwin || !fwin.title) { log('sleep2', fwin, fwin.title); break; }
        if (pause) { i++; }
        ui.run(() => {
            fwin.title.setText(pause ? '脚本已暂停，点击继续' : message + "剩余" + i + "秒");
            fwin.frame.attr("alpha", 0.8);
            let x = parseInt((device.width - fwin.width) / 2);
            let y = device.height - 550;
            fwin.setPosition(x, y);
        });
        sleep(1000);
    }
    fwin = null;
    floaty.closeAll();
    sleep(500);
}
function getDouyinVideoDuration(durationStr) {
    if (durationStr) {
        //log('1',durationStr);
        var durationMatch = durationStr.match(/[0-9]+:[0-9]+/);
        if (durationMatch) {
            //log('2',durationMatch);
            var minutes = 0, seconds = 0;
            var parts = durationMatch[0].split(":");
            if (parts.length === 2) {
                //log('3',parts);
                let minutes = parseInt(parts[0], 10);
                let seconds = parseInt(parts[1], 10);
                return minutes * 60 + seconds;
            }
        }
    }
    return 0;
}
function percent(str) {
    var strMatch = str.match(/[0-9]+\/[0-9]+/);
    if (strMatch) {
        var parts = strMatch[0].split("/");
        if (parts.length === 2) {
            let a = parseInt(parts[0], 10);
            let b = parseInt(parts[1], 10);
            return a == b;
        }
    } else {
        return true;
    }
    return false;
}
function slidingByLine() {
    // top X,Y范围
    tx = randomPointLoc(parseInt(device.width / 3), parseInt(device.width / 2));
    ty = randomPointLoc(parseInt(device.height / 5), parseInt(device.height / 4));
    // bottom X，Y 范围
    bx = randomPointLoc(parseInt(device.width / 3), parseInt(device.width / 2));
    by = randomPointLoc(parseInt(3 * device.height / 4), parseInt(4 * device.height / 5));

    slidingTime = randomRangeTime(0.8, 1.3);
    log("上滑:随机直线");
    //log("X: "+ Math.abs(bx-tx) + " Y: "+ Math.abs(by - ty));
    swipe(bx, by, tx, ty, slidingTime);
}
function left2right(direction) {
    var intX = parseInt(Math.random() * 200 + 400);
    var intY = parseInt(Math.random() * 200 + 200);
    var distance = parseInt(Math.random() * 100 + device.height / 4);
    switch (direction) {
        case 1:
            //向上小距离
            sml_move(intX, intY + distance, intX, intY, 400);
            break;
        case 2:
            //向下小距离
            sml_move(intX, intY, intX, intY + distance, 400);
            break;
        case 3:
            //向左翻屏
            sml_move(
                device.width / 2 + parseInt(Math.random() * 100) + 300,
                device.height / 4 - parseInt(Math.random() * 200) + 100,
                0 + parseInt(Math.random() * 100),
                device.height / 5 + parseInt(Math.random() * 100),
                500
            );
            break;
        case 4:
            //向右翻屏
            sml_move(
                device.width / 2 - parseInt(Math.random() * 100) - 300,
                device.height / 5 - parseInt(Math.random() * 200) + 100,
                device.width - parseInt(Math.random() * 100),
                device.height / 4 + parseInt(Math.random() * 100),
                500
            );
            break;
    }
    sleep(1000);
}
function slidingByCurve() {
    if (idMatches(/.*center/).text('请完成安全验证').visibleToUser(true).findOne(1000)) { log('正在完成安全验证'); return; }
    // top X,Y范围
    tx = randomPointLoc(parseInt(device.width / 3), parseInt(device.width / 2));
    ty = randomPointLoc(200, 300);
    // bottom X，Y 范围
    bx = randomPointLoc(parseInt(device.width / 3), parseInt(device.width / 2));
    by = randomPointLoc(device.height - 500, device.height - 400);

    slidingTime = randomRangeTime(0.5, 0.9);
    log("上滑:仿真曲线");
    //log("X: "+ Math.abs(bx-tx) + " Y: "+ Math.abs(by - ty));
    sml_move(bx, by, tx, ty, slidingTime);
}
function randomPointLoc(start, end) {
    len = Math.abs(end - start);
    loc = Math.floor(Math.random() * len) + start;
    return loc;
}
function randomRangeTime(start, end) {
    len = Math.abs(end - start) * 1000;
    ms = Math.floor(Math.random() * len) + start * 1000;
    return ms;
}
function radmoRect(rect) {
    let xy = rect;
    if (rect) {
        xy.left = random(100, rect.width() - 100);
        xy.top = random(100, rect.height() - 100);
        xy.bottom = xy.top + 120;
        xy.right = xy.left + 120;
    }
    return xy;
}
function sml_move(qx, qy, zx, zy, time) {
    var xxy = [time];
    var point = [];
    var dx0 = { "x": qx, "y": qy };
    var dx1 = { "x": random(qx - 100, qx + 100), "y": random(qy, qy + 50) };
    var dx2 = { "x": random(zx - 100, zx + 100), "y": random(zy, zy + 50) };
    var dx3 = { "x": zx, "y": zy };
    for (var i = 0; i < 4; i++) {
        eval("point.push(dx" + i + ")");
    }
    // log(point[3].x)
    for (let i = 0; i < 1; i += 0.08) {
        let newPoint = bezier_curves(point, i);
        xxyy = [parseInt(newPoint.x), parseInt(newPoint.y)]
        xxy.push(xxyy);
    }
    try {
        gesture.apply(null, xxy);
    } catch (e) {
        log('error:', xxy);
    }
}
function bezier_curves(cp, t) {
    cx = 3.0 * (cp[1].x - cp[0].x);
    bx = 3.0 * (cp[2].x - cp[1].x) - cx;
    ax = cp[3].x - cp[0].x - cx - bx;
    cy = 3.0 * (cp[1].y - cp[0].y);
    by = 3.0 * (cp[2].y - cp[1].y) - cy;
    ay = cp[3].y - cp[0].y - cy - by;
    tSquared = t * t;
    tCubed = tSquared * t;
    result = { "x": 0, "y": 0 };
    result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
    result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
    return result;
}
function SecondsToHMS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return (hours > 0 ? hours + "时" : "") + (minutes > 0 ? minutes + "分" : "") + remainingSeconds + "秒";
}
function getindexInParent(child) {
    var parent = child.parent();
    for (var i = 0; i < parent.childCount(); i++) {
        if (parent.child(i).find(className('CheckBox').checked(true).visibleToUser(true)).length > 0) {
            return i;
        }
    }
    return -1; // 如果找不到子元素，则返回-1
}
function isRectInScreen(bounds) {
    var x = bounds.left, y = bounds.top,
        a = bounds.right, b = bounds.bottom;
    return (
        x >= 0 && x <= device.width &&
        y >= 0 && y <= device.height &&
        a > 0 && a <= device.width &&
        b > 0 && b <= device.height
    );
}
function openApp(appname) {
    console.warn('启动应用:' + appname);
    var appstate = launchApp(appname);
    sleep(5000);
    if (appstate) {
        toastLog("应用正在运行");
    } else {
        toastLog("无法自启动，需模拟点击");
        home();//要启动的APP必须放在第一页中
        sleep(3000);
        var app = id("item_title").text(appname).visibleToUser(true).findOne(2000);
        if (app) {
            click(app.bounds().centerX(), app.bounds().top - 50);
            sleep(8000);
        } else {
            toastLog('要启动的APP必须放在首页，即按Home能看到的那一页');
            work_thread.interrupt();
            engines.myEngine().forceStop();
            exit();
        }
    }
}
function closeApp(appname) {
    let packageName = getPackageName(appname);
    // 使用ADB命令强行结束进程
    //shell("adb shell am force-stop " + packageName);
    console.warn('关闭应用:' + appname);
    app.openAppSetting(packageName);
    text(app.getAppName(packageName)).waitFor();
    let is_sure = textMatches(/.*强行停止.*/).visibleToUser(true).findOne(1000);
    if (is_sure && is_sure.enabled()) {
        try {
            var btn = className("Button").text('强行停止').visibleToUser(true).findOne(1000);
            if (btn) btn.click();
            sleep(1000);
            btn = className("Button").text('强行停止').visibleToUser(true).findOne(1000);
            if (btn) btn.click();
            sleep(1000);
            btn = className("Button").text('确定').visibleToUser(true).findOne(1000);
            if (btn) btn.click();
            back(); back(); back();
            home();
        } catch (e) {
            log(app.getAppName(packageName) + "应用已被关闭");
            sleep(1000);
            back(); back(); back();
            home();
        }
    } else {
        log(app.getAppName(packageName) + "应用不能被正常关闭");
        back(); back(); back();
        home();
    }
}
function update() {
    http.get('https://update.greasyfork.org/scripts/520135/%E5%BF%AB%E6%89%8B%E8%84%9A%E6%9C%AC.js', {}, function (res, err) {
        if (res.statusCode == 200) {
            var Source = res.body.bytes();
            if (Source) {
                files.writeBytes(files.getSdcardPath() + '/脚本/快手脚本.js', Source);
                console.verbose('更新主程序:成功', ver);
            } else {
                console.verbose('更新主程序:错误', ver);
            }
        } else {
            console.verbose('更新主程序:失败', ver);
        }
    });
}


importClass(org.opencv.imgproc.Imgproc);
importClass(org.opencv.core.Core);
importClass(org.opencv.core.Rect);
importClass(org.opencv.core.Mat);
importClass(org.opencv.core.Point);
importClass(org.opencv.core.Size);
importClass(org.opencv.core.CvType);
importClass(org.opencv.core.Scalar);
importClass(org.opencv.imgcodecs.Imgcodecs);

/**
 * @param {number[]} region 是一个两个或四个元素的数组。
 * (region[0], region[1])表示找色区域的左上角；region[2]*region[3]表示找色区域的宽高。如果只有region只有两个元素，则找色区域为(region[0], region[1])到屏幕右下角。
 * 如果不指定region选项，则找色区域为整张图片。
 * @param {*} img
 * @returns {org.opencv.core.Rect}
 */
function buildRegion(region, img) {
    if (region == undefined) { region = []; }
    let x = region[0] === undefined ? 0 : region[0];
    let y = region[1] === undefined ? 0 : region[1];
    let width = region[2] === undefined ? img.getWidth() - x : region[2];
    let height = region[3] === undefined ? img.getHeight() - y : region[3];
    if (x < 0 || y < 0 || x + width > img.width || y + height > img.height) {
        throw new Error(
            'out of region: region = [' + [x, y, width, height] + '], image.size = [' + [img.width, img.height] + ']'
        );
    }
    return new Rect(x, y, width, height);
}

/**
 * @param {number} threshold 图片相似度。取值范围为0~1的浮点数。默认值为0.9
 * @param {number[]} region 找图区域
 * @param {number[]} scaleFactors 大图的宽高缩放因子，默认为 [1, 0.9, 1.1, 0.8, 1.2]
 * @param {number} max 找图结果最大数量，默认为5
 * @param {boolean} grayTransform 是否进行灰度化预处理，默认为true。
 * 通常情况下将图像转换为灰度图可以简化匹配过程并提高匹配的准确性，当然，如果你的匹配任务中颜色信息对匹配结果具有重要意义，
 * 可以跳过灰度化步骤，直接在彩色图像上进行模板匹配。
 */
function MatchOptions(threshold, region, scaleFactors, max, grayTransform) {
    this.threshold = threshold;
    this.region = region;
    this.scaleFactors = scaleFactors;
    this.max = max;
    this.grayTransform = grayTransform;
}

const defaultMatchOptions = new MatchOptions(0.9, undefined, [[1, 1], [0.9, 0.9], [1.1, 1.1], [0.8, 0.8], [1.2, 1.2]], 5, true);
// 校验参数
MatchOptions.check = function (options) {
    if (options == undefined) {
        return defaultMatchOptions;
    }
    // deep copy
    let newOptions = JSON.parse(JSON.stringify(options));
    if (newOptions.threshold == undefined) {
        newOptions.threshold = defaultMatchOptions.threshold;
    }
    if (newOptions.region && !Array.isArray(newOptions.region)) {
        throw new TypeError('region type is number[]');
    }
    if (newOptions.max == undefined) {
        newOptions.max = defaultMatchOptions.max;
    }
    if (newOptions.scaleFactors == undefined) {
        newOptions.scaleFactors = defaultMatchOptions.scaleFactors;
    } else if (!Array.isArray(newOptions.scaleFactors)) {
        throw new TypeError('scaleFactors');
    }
    for (let index = 0; index < newOptions.scaleFactors.length; index++) {
        let factor = newOptions.scaleFactors[index];
        if (Array.isArray(factor) && factor[0] > 0 && factor[1] > 0) {
            // nothing
        } else if (typeof factor === 'number') {
            newOptions.scaleFactors[index] = [factor, factor];
        } else {
            throw new TypeError('scaleFactors');
        }
    }
    if (newOptions.grayTransform === undefined) {
        newOptions.grayTransform = defaultMatchOptions.grayTransform;
    }

    return newOptions;
};

function Match(point, similarity, scaleX, scaleY) {
    this.point = point;
    this.similarity = similarity;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
}

/**
 * 找图，在图中找出所有匹配的位置
 * @param {Image} img
 * @param {Image} template
 * @param {MatchOptions} options 参数见上方定义
 * @returns {Match[]}
 */
function matchTemplate(img, template, options) {
    if (img == null || template == null) {
        throw new Error('ParamError');
    }
    options = MatchOptions.check(options);
    //console.log('参数：', options);

    let largeMat = img.mat;
    let templateMat = template.mat;
    let largeGrayMat;
    let templateGrayMat;
    if (options.region) {
        options.region = buildRegion(options.region, img);
        largeMat = new Mat(largeMat, options.region);
    }
    // 灰度处理
    if (options.grayTransform) {
        largeGrayMat = new Mat();
        Imgproc.cvtColor(largeMat, largeGrayMat, Imgproc.COLOR_BGR2GRAY);
        templateGrayMat = new Mat();
        Imgproc.cvtColor(templateMat, templateGrayMat, Imgproc.COLOR_BGR2GRAY);
    }
    // =================================================
    let finalMatches = [];
    for (let factor of options.scaleFactors) {
        let [fx, fy] = factor;
        let resizedTemplate = new Mat();
        Imgproc.resize(templateGrayMat || templateMat, resizedTemplate, new Size(), fx, fy, Imgproc.INTER_LINEAR);
        // 执行模板匹配，标准化相关性系数匹配法
        let matchMat = new Mat();
        Imgproc.matchTemplate(largeGrayMat || largeMat, resizedTemplate, matchMat, Imgproc.TM_CCOEFF_NORMED);

        let currentMatches = _getAllMatch(matchMat, resizedTemplate, options.threshold, factor, options.region);
        //console.log('缩放比：', factor, '可疑目标数：', currentMatches.length);
        for (let match of currentMatches) {
            if (finalMatches.length === 0) {
                finalMatches = currentMatches.slice(0, options.max);
                break;
            }
            if (!isOverlapping(finalMatches, match)) {
                finalMatches.push(match);
            }
            if (finalMatches.length >= options.max) {
                break;
            }
        }
        resizedTemplate.release();
        matchMat.release();
        if (finalMatches.length >= options.max) {
            break;
        }
    }
    largeMat !== img.mat && largeMat.release();
    largeGrayMat && largeGrayMat.release();
    templateGrayMat && templateGrayMat.release();

    return finalMatches;
}

function _getAllMatch(tmResult, templateMat, threshold, factor, rect) {
    let currentMatches = [];
    let mmr = Core.minMaxLoc(tmResult);

    while (mmr.maxVal >= threshold) {
        // 每次取匹配结果中的最大值和位置，从而使结果按相似度指标从高到低排序
        let pos = mmr.maxLoc; // Point
        let value = mmr.maxVal;

        let start = new Point(Math.max(0, pos.x - templateMat.width() / 2), Math.max(0, pos.y - templateMat.height() / 2));
        let end = new Point(
            Math.min(tmResult.width() - 1, pos.x + templateMat.width() / 2),
            Math.min(tmResult.height() - 1, pos.y + templateMat.height() / 2)
        );
        // 屏蔽已匹配到的区域
        Imgproc.rectangle(tmResult, start, end, new Scalar(0), -1);
        mmr = Core.minMaxLoc(tmResult);

        if (rect) {
            pos.x += rect.x;
            pos.y += rect.y;
            start.x += rect.x;
            start.y += rect.y;
            end.x += rect.x;
            end.y += rect.y;
        }
        let match = new Match(pos, value, factor[0], factor[1]);
        // 保存匹配点的大致范围，用于后续去重。设置enumerable为false相当于声明其为私有属性
        Object.defineProperty(match, 'matchAroundRect', { value: new Rect(start, end), writable: true, enumerable: false });
        currentMatches.push(match);
    }

    return currentMatches;
}

/**
 * 判断新检测到的点位是否与之前的某个点位重合。
 * @param {Match[]} matches
 * @param {Match} newMatch
 * @returns {boolean}
 */
function isOverlapping(matches, newMatch) {
    for (let existingMatch of matches) {
        // 也可判断两点间的距离，但是平方、开方运算不如比较范围简单高效
        if (existingMatch.matchAroundRect.contains(newMatch.point)) {
            if (newMatch.similarity > existingMatch.similarity) {
                existingMatch.point = newMatch.point;
                existingMatch.similarity = newMatch.similarity;
                existingMatch.scaleX = newMatch.scaleX;
                existingMatch.scaleY = newMatch.scaleY;
                existingMatch.matchAroundRect = newMatch.matchAroundRect;
            }
            return true;
        }
    }
    return false;
}
/**
 * 根据搜图结果在原图上画框
 * @param {Match[]} matches
 * @param {*} srcMat
 * @param {*} templateMat
 */
function showMatchRectangle(matches, srcMat, templateMat) {
    for (let match of matches) {
        let start = match.point;
        let end = new Point(
            match.point.x + templateMat.width() * match.scaleX,
            match.point.y + templateMat.height() * match.scaleY
        );
        Imgproc.rectangle(srcMat, start, end, new Scalar(0, 0, 255), 3);
    }

    const saveName = '/sdcard/Download/temp.jpg';
    let img2 = images.matToImage(srcMat);
    images.save(img2, saveName);
    app.viewFile(saveName);
    img2.recycle();
}

/** 图像识别定位
 * @param {images} templateImage64 预定的搜索模板图片base64
 * @param {images} ScreenImage 被搜索图片，如果不提供则全屏截图
 * @param {number[]} option 配置参数
 * @return {result[]}[ { point: {27.0, 1615.0}, similarity: 1, scaleX: 1, scaleY: 1 } ]
 * @return {bounds{}}{ left: 27,top: 1615,right: 157,bottom: 1745,centerX: 92,centerY: 1680 }
//option：{ threshold: 0.85, region: [0, 0], grayTransform: true, max: 3 }
//img_block     region: [device.width / 2, 200, device.width / 2, device.height / 3],grayTransform:true,
*/
function FindPicture(tempBase64, ScreenImage) {
    let templateImage64 = '', options = null;
    if (tempBase64 == 'img_block') {
        if (!img_block) return;
        templateImage64 = img_block;
        options = { threshold: 0.8, region: [device.width / 2, 200, device.width / 2, device.height / 3], grayTransform: true, max: 3 };
    } else {
        return;
    }

    let largeImage = ScreenImage ? ScreenImage : captureScreen();
    let template = images.fromBase64(templateImage64);
    //images.read(files.getSdcardPath() + '/脚本/template.jpg');

    //console.log('大图尺寸:', [largeImage.getWidth(), largeImage.getHeight()]);
    //console.log('模板尺寸:', [template.getWidth(), template.getHeight()]);
    let bounds = null;
    let startTs = Date.now();
    let result = matchTemplate(largeImage, template, options);
    if (result.length > 0) {
        let left = result[0].point.x;
        let top = result[0].point.y;
        let right = parseInt(left + template.getWidth() * result[0].scaleX);
        let bottom = parseInt(top + template.getHeight() * result[0].scaleY);
        let centerX = parseInt(left + (right - left) / 2);
        let centerY = parseInt(top + (bottom - top) / 2);
        bounds = { left: left, top: top, right: right, bottom: bottom, centerX: centerX, centerY: centerY };
    }
    //console.log('识别耗时:', (Date.now() - startTs) / 1000);
    console.log(tempBase64, result.length == 0 ? {} : result[0].point);
    // 将结果画框展示
    //showMatchRectangle(result, largeImage.mat, template.mat);
    template.recycle();
    setTimeout(function () { largeImage.recycle(); }, 6000);
    return bounds;
}

/** 拖动滑块*/
function dragSlider(ax, by, br, bigimg) {
    var img = bigimg;
    if (!bigimg) {
        var pic = images.grayscale(captureScreen());
        //img = images.adaptiveThreshold(images.grayscale(pic), 255, "MEAN_C", "BINARY", 5, 10);
        img = images.inRange(pic, '#000000', '#444444');
    }
    var newimg = images.cvtColor(img, "GRAY2RGBA");
    //if(bigimg){
    //    images.save(newimg, files.getSdcardPath() + '/脚本/2.jpg', "jpg", 100);
    //    app.viewFile(files.getSdcardPath() + '/脚本/2.jpg');
    //}
    var t = random(1234, 2234);
    var xy = FindPicture('img_block', newimg);
    //console.info("识别结果：" , xy);
    if (xy) {
        toastLog("识别成功：" + ax + ", " + by);
        gesture(t, [ax, by], [ax + 100, by - 10], [ax + 200, by + 10], [ax + 400, by - 10], [ax + 550, by], [ax + 700, by], [xy.centerX, by - 10]);
    } else if (!bigimg) {
        toastLog("识别有误，二次识别");
        img = images.inRange(pic, '#bbbbbb', '#ffffff');
        //bigimg = images.adaptiveThreshold(images.grayscale(pic), 255, "MEAN_C", "BINARY", 5, 10);
        dragSlider(ax, by, br, img);
    } else {
        toastLog("识别有误，尝试滑动");
        gesture(t, [ax, by], [ax + 150, by + 10], [ax + 250, by - 10], [ax + 300, by], [ax + 350, by], [ax + 500, by + 10], [br - 150, by - 10]);
    }
}

//===================================================================================
requestScreenCapture(false);//请求截图权限
runtime.getImages().initOpenCvIfNeeded();//初始化OpenCv
global.starttime = Date.now();//程序运行开始时间

var oledwin = null, win = null;
function oled(i) {
    let j = i || 3;
    floaty.closeAll();
    oledwin = floaty.rawWindow(
        `<frame bg="#000000">
            <card w="auto" h="auto" layout_gravity="center" cardBackgroundColor="#000000" >
            <vertical>
                <text id="texts" text="息屏挂机模式" textColor="#999999" textSize="13sp" />
                <button id="button" text="退出挂机" margin="0 20" />
            </vertical>
            </card>
        </frame>`
    );
    oledwin.button.on("click", function () {
        console.info('手动停止挂机');
        floaty.closeAll();
        oledwin = null;
        running = false;
    });
    oledwin.setSize(-1, -1);
    oledwin.setTouchable(true);
    sleep(300);
    console.info('挂机模式开启……');
    //保持脚本运行
    while (j > 0 && oledwin) {
        if (oledwin.texts) {
            let t = parseInt(j / 60) + "分" + parseInt(j % 60) + "秒";
            ui.run(() => { oledwin.texts.setText("息屏挂机倒计时:" + t + "\n\n倒计时结束后重启主线程gifshow") });
        }
        j--;
        sleep(1000);
    }
    floaty.closeAll();
    oledwin = null;
    running = false;
    console.show();
    console.info('挂机结束用时:', (parseInt((i - j) / 60) + "分" + parseInt((i - j) % 60) + "秒"));
}

function Observer() {
    function unique(arr) {
        let newArr = [arr[0]];
        for (let i = 1; i < arr.length; i++) {
            let flag = false;
            for (var j = 0; j < newArr.length; j++) {
                if (arr[i] == newArr[j]) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                newArr.push(arr[i]);
            }
        }
        return newArr;
    }
    var currentActis = new Array();
    for (let c = 0; c < 12; c++) {//连续扫描60秒后返回结果，如果60秒停留在同一活动页面，则就要重启线程了
        //检测oled挂机模式结束，则重启main线程
        if (oledwin) { win = oledwin; return true; } else if (win) { win = null; return false; }
        currentActis[c] = currentActivity();
        //关闭自动弹出的层
        var btn = idMatches(/.*\/close|.*\/tabs_panel_close/).visibleToUser(true).findOne(1000);
        if (btn) {
            console.log('关闭弹出层Observer');
            click(btn.bounds());
            sleep(1000); continue;
        }
        var accept = textMatches(/立即邀请|直播已结束/).visibleToUser(true).findOne(1000);
        if (accept) {
            console.log('退出:', accept.text());
            back();
            sleep(1000); continue;
        }
        var emoji = className('ImageView').desc('emotion').visibleToUser(true).find();
        if (emoji) {
            let item = emoji[random(0, 3)];
            if (item) {
                click(item.bounds()); sleep(500);
                item = emoji[random(0, 3)];
                click(item.bounds()); sleep(500);
                let sendbtn = idMatches(/.*finish_button_wrapper/).visibleToUser(true).findOne(1000);
                if (sendbtn) { click(sendbtn.bounds()); sleep(1000); console.warn('0.发表评论'); continue; }
            } else {
                emoji = idMatches(/.*item_prefabricated_word_layout/).clickable(true).visibleToUser(true).find();
                if (emoji) {
                    item = emoji[random(0, 3)];
                    if (item) { click(item.bounds()); }
                    let sendbtn = idMatches(/.*finish_button_wrapper/).visibleToUser(true).findOne(1000);
                    if (sendbtn) { click(sendbtn.bounds()); sleep(1000); console.warn('1.发表评论'); continue; }
                }
            }
        }
        var btntxt = textMatches(/等待|忽略|禁止|单列|同意|满意|关闭|关闭应用|不在提醒|我知道了|以后再说|暂不使用|忽略提醒|仍要退出|不感兴趣|去验证|提醒我每天来领/).visibleToUser(true).findOne(1000);
        if (btntxt) {
            console.warn('点击:', btntxt.text());
            click(btntxt.bounds());
            sleep(1000); continue;
        }
        //currentActivity()='.*FaceRecognitionActivity';
        var block = textMatches(/.*填充拼图|.*使图片角度为正|请依次点击.*/).visibleToUser(true).findOne(1000);
        if (block) {
            toastLog(block.text());
            if (block.text().match(/请依次点击.*/)) {
                let charPositions = [], bunds = [];
                let textlist = block.parent().find(className('ListView'));
                if (textlist) {
                    for (i = 0; i < textlist[0].childCount(); i++) {
                        let word = textlist[0].child(i).text().replace('“', '').replace('”', '');
                        //console.log(word);
                        charPositions.push(word);
                    }
                    var aa = className('android.widget.Image').textMatches(/pic\?captchaSn.*/).visibleToUser(true).findOne(1000);
                    let pic = images.clip(captureScreen(), aa.bounds().left, aa.bounds().top, aa.bounds().width(), aa.bounds().height());
                    let img = images.inRange(pic, '#000000', '#222222');
                    //images.save(img, files.getSdcardPath() + '/脚本/2.jpg', "jpg", 100);
                    //app.viewFile(files.getSdcardPath() + '/脚本/2.jpg');
                    const result = gmlkit.ocr(img, "zh");
                    console.log(result.text);
                    // 点击验证码中的字符
                    for (var i = 0; i < charPositions.length; i++) {
                        //console.log(charPositions);
                        let words = result.find(3, e => e.text == charPositions[i]);
                        //log(charPositions[i],words);
                        if (words) {
                            //console.log(charPositions[i],words.bounds);
                            bunds.push(words.bounds);
                            click(words.bounds.centerX() + aa.bounds().left, words.bounds.centerY() + aa.bounds().top);
                        } else {
                            let xy = radmoRect(aa.bounds());
                            //console.log(charPositions[i],xy);
                            for (j = 0; j < bunds.length; j++) {
                                //console.log(charPositions[i],xy,bunds[j]);
                                if (xy.intersect(bunds[j])) {
                                    //console.log('有重合,重新生成',charPositions[i],xy,bunds[j]);
                                    xy = radmoRect(aa.bounds());
                                    j = 0;
                                    continue;
                                }
                            }
                            bunds.push(xy);
                            click(xy.centerX() + aa.bounds().left, xy.centerY() + aa.bounds().top);
                        }
                        sleep(random(900, 1200));
                    }
                    sleep(1000);
                    block = textMatches(/请依次点击.*/).visibleToUser(true).findOne(1000);
                    if(!block)swipe(device.width / 3, device.height - 300, device.width / 2, 300, random(500, 900));
                }
            } else if (block.text().match(/.*使图片角度为正/)) {
                var ax = block.bounds().left + 50;
                var by = block.bounds().centerY();
                var br = block.bounds().right - random(350, 450);
                gesture(random(1234, 2234), [ax, by], [ax + 150, by + 10], [ax + 250, by - 10], [ax + 300, by], [ax + 350, by], [ax + 500, by + 10], [br, by - 10]);
                sleep(1000);
                block = textMatches(/.*使图片角度为正/).visibleToUser(true).findOne(1000);
                if(!block)swipe(device.width / 3, device.height - 300, device.width / 2, 300, random(500, 900));
            } else {
                var aa = className('android.widget.Image').textMatches(/cutPic\?captchaSn.*/).visibleToUser(true).findOne(1000);
                var ax = aa.bounds().centerX();
                var by = block.bounds().centerY();
                var br = block.bounds().right;
                //console.log(ax,by,br);
                dragSlider(ax, by, br);
                sleep(1000);
                block = textMatches(/.*填充拼图/).visibleToUser(true).findOne(1000);
                if(!block)swipe(device.width / 3, device.height - 300, device.width / 2, 300, random(500, 900));
            }
            sleep(1000); continue;
        }
        sleep(1000);//这是每秒扫描一次活动页
    }
    //toastLog(currentActivity());
    let ac = unique(currentActis);
    let cc = currentActivity().match(/.*HomeActivity|.*PhotoDetailActivity|.*AwardVideoPlayActivity|.*AdKwaiRnActivity|.*app\.Dialog|android\.widget\.FrameLayout|.*ToastDialog|.*ScreenCaptureRequestActivity/);
    if (ac.length == 1 && !cc) {
        console.info('60秒卡顿:', ac[0]);
        //截图保存界面，以备后续查看
        captureScreen(files.getSdcardPath() + '/脚本/Observer2_' + currentActivity() + '.jpg');
        return false;
    }
    return true;
}

// 》》》》》》》》》》》》》》》》》》》 START
work_thread = threads.start(function () {
    Main();
});

observer_thread = threads.start(function () {
    setInterval(function () {
        console.verbose('--------多线程安全检测---------');
        if (oledwin) { if (oledwin.texts) console.verbose(oledwin.texts.getText().split("\n").shift()); }

        let worktime = parseInt((Date.now() - starttime) / 1000);
        console.verbose("脚本连续运行:" + SecondsToHMS(worktime));
        //如果运行时间超过4小时，则关闭应用，停止脚本。
        if (worktime > 60 * 60 * 4) {
            device.cancelKeepingAwake();
            work_thread.interrupt();
            console.show();
            console.clear();
            console.warn("脚本连续运行超4小时，终止运行！");
            sleep(5000);
            console.hide();
            closeApp(AppName);
            sleep(5000);
            //熄屏
            runtime.accessibilityBridge.getService().performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_LOCK_SCREEN);
            //停止本脚本
            //engines.myEngine().forceStop();
            //结束所有Autojx进程
            engines.stopAll();
            exit();
        }
        if (!Observer()) {
            work_thread.interrupt();
            work_thread = threads.start(function () {
                toast("Main线程在5秒后重启！");
                console.show();
                console.clear();
                console.warn("Main线程在5秒后重启！");
                running = false;
                sleep(5000);
                if (currentPackage() == packageName) { console.hide(); closeApp(AppName); }
                sleep(5000);
                Main();
            });
        }
    }, 3000);//这个时间是线程休息时间
});

setTimeout(function () {
    //if (!files.exists(files.getSdcardPath() + '/脚本/自动上滑脚本.js')) {
    http.get('https://update.greasyfork.org/scripts/521999/%E8%87%AA%E5%8A%A8%E4%B8%8A%E6%BB%91%E8%84%9A%E6%9C%AC.js', {}, function (res, err) {
        if (res.statusCode == 200) {
            var Source = res.body.bytes();
            if (Source) {
                files.writeBytes(files.getSdcardPath() + '/脚本/自动上滑脚本.js', Source);
                console.verbose('更新自动上滑:成功');
            } else {
                console.verbose('更新自动上滑:错误');
            }
        } else {
            console.verbose('更新自动上滑:失败');
        }
    });
    //}
}, 30 * 1000);