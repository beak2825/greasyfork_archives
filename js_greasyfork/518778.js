auto.waitFor();
global.AppName = "抖音极速版";
global.packageName = "com.ss.android.ugc.aweme.lite";
global.running = false; //是否正在刷视频中
global.working = false; //是否正在刷视频中
global.pause = false; //是否暂停
global.startSec = Date.now();//刷视频计时
global.videoDuration = 0; //视频时长
global.Samelogin = true; //是否为同一个账户切换

global.ver = 'v3.5';//版本号
if (!auto.service || device.width == 0) {
    console.warn("2.请重新开启无障碍服务");
    auto.service.disableSelf();
    app.startActivity({ action: "android.settings.ACCESSIBILITY_SETTINGS" });
    android.os.Process.killProcess(android.os.Process.myPid());
}
if (device.fingerprint + '/' + ver != storages.create("tiktok").get('device_info')) { setTimeout(function () { update(); }, 60 * 1000); }
engines.all().map((ScriptEngine) => { if (engines.myEngine().toString() !== ScriptEngine.toString()) { ScriptEngine.forceStop(); } });


/**点赚钱图标是否进入了照相机 */
function ifcarmer(btn) {
    var fudai=className('Button').desc('福袋').boundsInside(device.width/2, 0, device.width, 500).visibleToUser(true).findOne(1000);
    if (fudai) {
        if(btn)click(fudai.bounds());//点赚钱图标
        sleep(2000);
        return false;
    }
    if (className('ImageView').desc('拍摄，按钮').boundsInside(0, device.height-300, device.width, device.height).visibleToUser(true).findOne(1000)) {
        toastLog('1.当前账户没有赚钱福袋');
        console.info('【ifcarmer_截图】',currentActivity());
        //截图保存界面，以备后续查看
        captureScreen(files.getSdcardPath() + '/脚本/ifcarmer_' + currentActivity() + '.png');
        return true;
    }
    //点赚钱图标
    if(btn){
        var bb=className("TextView").desc("首页，按钮").boundsInside(0, device.height-250, 250, device.height).visibleToUser(true).findOne(1000);
        if(bb){
            click(device.width / 2, bb.bounds().top);
        }else{
            toastLog('3.未定位到首页按钮');
            return true;
        }
    }
    sleep(2000);
    if (currentActivity().match(/.*VideoRecordNewActivity/)) {
        back();
        toastLog('2.当前账户没有赚钱福袋');
        return true;
    } 
    return false;
}

function istaskpage(){
    function ocrtaskpage(){
        function getStatusBarHeight() {
            let resources = context.getResources();
            let resourceId = resources.getIdentifier("status_bar_height", "dimen", "android");
            let height = resources.getDimensionPixelSize(resourceId);
            return height;
        }
        let stp = 35+getStatusBarHeight();
        let img = images.clip(captureScreen(), (device.width-270)/2, stp, 270, 70);
        //images.save(img, files.getSdcardPath() + '/脚本/1.jpg', "jpg", 100);
        //app.viewFile(files.getSdcardPath() + '/脚本/1.jpg');
        //const result = paddle.ocrText(img);
        const result = gmlkit.ocr(img, "zh").toArray(3);
        //log("识别信息: ", result);
        img.recycle();
        if(result.length>0){
            if(result[0].text){
                let ax=result[0].text.match(/赚钱任务|賺钱任务/);
                console.log('识别信息',result[0].text);
                return ax;
            }else{
                let bx=result[0].match(/赚钱任务|賺钱任务/);
                console.log('识别信息',result[0]);
                return bx;
            }
        }else{
            return null;
        }
    }
    if(className('android.view.View').textMatches(/.*福气可得到.*/).findOne(1000)){
        var daytask = className('androidx.recyclerview.widget.RecyclerView').visibleToUser(true).findOne(1000);
        click(device.width-140,daytask.bounds().top+60);
        sleep(1000);
    }else{
        swipe(device.width / 2, device.height * 0.2, device.width / 2, device.height * 0.8, random(500, 1000));
        sleep(1000);
    }

    var findtask = className('android.view.View').descMatches(/.*福气可得到.*|.*完成一次广告任务.*|.*累计已赚.*|.*一键领取|最高可得.*/).findOne(1000);
    var taskpage = findtask?findtask:ocrtaskpage();
    if (!taskpage) {
        toastLog("不在任务页");
        var homebtn = getHomeBtn();
        if (!homebtn) {homebtn=gohome();}
        if(homebtn){
            toastLog("点击首页赚钱");
            if (ifcarmer(homebtn)) { return null; }
            sleep(3000);
            toastLog("是否回到任务页");
            taskpage = ocrtaskpage();
        }
    }
    return taskpage;
}

//执行赚钱任务函数
function takelist() {
    toastLog("查找看广告赚金币位置");
    var taskpage=istaskpage();
    if (taskpage) {
        //春节红包
        if(className('android.view.View').textMatches(/.*福气可得到.*/).findOne(1000)){
            var daytask = className('androidx.recyclerview.widget.RecyclerView').visibleToUser(true).findOne(1000);
            click(device.width-140,daytask.bounds().top+60);
            sleep(1000);
        }
        //预约
        var reservation = className('android.view.View').descMatches(/今日预约.*/).visibleToUser(true).findOne(1000);
        if(reservation){
            var vation=reservation;
        }else{
            var result = gmlkit.ocr(captureScreen(), "zh");
            var vation = result.find(3, e => (e.text=='去预约'));
        }
        if(vation){
            click(device.width / 2, reservation?reservation.bounds().centerY():vation.bounds.centerY());
            sleep(3000);
            var okbtn=className('com.lynx.tasm.behavior.ui.text.FlattenUIText').descMatches(/一键领取|立即预约领取/).visibleToUser(true).findOne(1000);
            if(okbtn){
                click(okbtn.bounds());
                sleep(2000);
                back();
                sleep(3000);
            }
            while(className('com.lynx.tasm.behavior.ui.text.FlattenUIText').desc('规则').visibleToUser(true).findOne(1000)){
                back();sleep(2000);
            }
        }
        //看广告
        var findtask = className('android.view.View').descMatches(/.*完成一次广告任务.*/).visibleToUser(true).findOne(1000);
        if(findtask){
            var lookAd=findtask;
        }else{
            var result = gmlkit.ocr(captureScreen(), "zh");
            var lookAd = result.find(3, e => (e.text.substring(0,6)=='看广告赚金币'));
        }
        if (lookAd) {
            toastLog("点击看广告赚金币");
            click(device.width / 2, findtask?findtask.bounds().centerY():lookAd.bounds.bottom);
            sleep(5000);
            //关闭自动弹出的层
            if (currentActivity().match(/.*BulletContainerActivity|.*NoMarginSheetBaseDialog/)) { 
                console.log('点左上角关闭弹出层takelist');click(80, 150); left2right(2);sleep(1000);left2right(2);sleep(1000);
            }
            var living = id("root").desc("关闭").clickable(true).boundsInside(device.width-300, 0, device.width, 300).visibleToUser(true).findOne(1000);//直播间
            if (living) {
                toastLog('退出直播间takelist');
                //退出直播间
                click(living.bounds());
                sleep(2000);
            }
            var videopage = className("com.lynx.tasm.behavior.ui.text.FlattenUIText").desc("反馈").boundsInside(0, 0, device.width, 300).visibleToUser(true).findOne(1000);
            if (videopage) {
                playvideo();
                toastLog('看广告赚金币任务完成');
            }else{
                toastLog('等待看广告赚金币倒计时');
            }
        }else{
            //无法定位是因为刚看过有倒计时，被排后列表后面了，当然也有可能是被弹出的签到遮挡了
            toastLog('无法定位看广告赚金币位置');
            storages.create("tiktok").put('singlecheck', 0);
            singlecheck();
            //console.info('无法定位看广告赚金币位置【截图】takelist1_');
            //截图保存界面，以备后续查看
            //captureScreen(files.getSdcardPath() + '/脚本/takelist1_' + currentActivity() + '.png');
        }
    } else {
        toastLog('无法确定任务页takelist');
        console.info('【截图】takelist2_');
        //截图保存界面，以备后续查看
        captureScreen(files.getSdcardPath() + '/脚本/takelist2_' + currentActivity() + '.png');
    }
}

//判断进入看广告视频赚金币
function playvideo() {
    function stopvideo(j) {
        let plug = ['很糟糕', '一般般', '太赞了'];
        var s = plug[2];//randomPointLoc(0,3)
        var uc = className("com.lynx.tasm.behavior.ui.text.UIText").desc(s).visibleToUser(true).findOne(1000);
        if(uc){
            toastLog(j+'.2.点击评价:' + s);
            click(uc.bounds().centerX(), uc.bounds().centerY() - 50);
            sleep(3000);
            toastLog(j+'.3.点击收下金币');
            click(uc.bounds().centerX(), uc.bounds().centerY() + 230);
            sleep(1000);            
        }
    }
    working=true;
    console.error('开始循环看广告playvideo');
    for (var i = 1; i < 99; i++) {
        console.log(i+'.----------------------------');
        if (text('当前无新视频').visibleToUser(true).findOne(1000)) {
            toastLog(i+".当前无新视频");
            click(device.width - 100, 100);
            sleep(1000);
        }
        //关闭自动弹出的层
        if (currentActivity().match(/.*BulletContainerActivity|.*NoMarginSheetBaseDialog/)) { 
            console.log('点左上角关闭弹出层playvideo');click(80, 150); left2right(2);sleep(1000);left2right(2);sleep(1000);
        }
        //判断进入了直播间
        var living = id("root").desc("关闭").clickable(true).boundsInside(device.width - 300, 0, device.width, 300).visibleToUser(true).findOne(1000);//直播间
        if (living) {
            toastLog(i+'.0.退出直播间');
            click(living.bounds());
            sleep(2000);
        }
        //判断是否进入了广告页面/^playvideocom.bytedance.*/
        var adpage = className("android.widget.Button").desc("返回").boundsInside(0, 0, 300, 300).visibleToUser(true).findOne(1000);
        if (adpage) {
            toastLog(i+'.0.退出广告页');
            click(adpage.bounds());
            sleep(3000);
            var tv = text('评价并收下金币').visibleToUser(true).findOne(1000);
            if (tv) {
                stopvideo(i);
                break;
            }
        }
        video = className("com.lynx.tasm.behavior.ui.text.FlattenUIText").desc("反馈").boundsInside(0, 0, device.width, 300).visibleToUser(true).findOne(1000);
        if (!video) {
            toastLog(i+'.0.未进入广告视频模式');
            //截图保存界面，以备后续查看
            if(!currentActivity().match(/.*PrimaryDialog/)){
                console.info('【playvideo截图】',currentActivity());
                captureScreen(files.getSdcardPath() + '/脚本/playvideo_' + currentActivity() + '.png');
            }
            stopvideo(i);
            break;
        }
        var okbtn = getOKBtn();
        if (!okbtn) {
            toastLog(i+'.无法取得领取成功，点击右上角');
            click(device.width - 200, video.bounds().centerY());
            okbtn = true;
            sleep(5000);
        } else {
            if (okbtn.desc().match(/领取成功.*/)) {
                var t = random(8,13);
                cutDownBySleep(t,i+'.0.等待');
                //这里经过长时间等待可能自动进入直播间，okbtn已经不在了,所以需要再找一次
                okbtn = getOKBtn();
                if(okbtn){
                    toastLog(i+'.0.点击领取成功');
                    click(okbtn.bounds());
                    sleep(3000);
                }
                okbtn = true;//防止break;
            } else {
                var b = okbtn.desc().match(/\d+/);
                var t = 1 * (b ? b[0] : 1) + random(8,13);
                cutDownBySleep(t,i+'.1.等待');
                //这里经过长时间等待可能自动进入直播间，okbtn已经不在了
                okbtn = getOKBtn();
                if(okbtn){
                    toastLog(i+'.1.点击领取成功');
                    click(okbtn.bounds());
                    sleep(3000);
                }
                okbtn = true;//防止break;
            }
        }
        if (okbtn) {
            //随时点击弹出层className("com.lynx.tasm.behavior.ui.text.FlattenUIText")
            var tv = textMatches(/继续观看|领取奖励|评价并收下金币/).visibleToUser(true).findOne(3000);
            if (tv&&isRectInScreen(tv.bounds())) {
                try {
                    if (tv.text() == '评价并收下金币') {
                        stopvideo(i);
                        break;
                    } else {
                        toastLog(i+'.2.点击' + tv.text());
                        click(tv.bounds());
                        sleep(3000);
                        var a = textMatches(/再看\d{1,2}秒可领奖励|评价并收下金币/).visibleToUser(true).findOne(3000);
                        if (a) {
                            if (a.text() == '评价并收下金币') {
                                stopvideo(i);
                                break;
                            } else {
                                var b = a.text().match(/\d+/);
                                var t = 1 * (b ? b[0] : 1) + random(8,13);
                                cutDownBySleep(t,i+'.2.等待');
                            }
                        }
                    }
                } catch (e) {
                    console.info(i+'.3.点击' + tv.text() + '=====' + e);
                }
                sleep(1000);
            }
        } else {
            break;
        }
        sleep(1000);
    }//end for
    console.error('循环看广告结束playvideo');
    working=false;
}

//判断签到层
function singlecheck() {
    toastLog('判断签到提示');
    var today = new Date();
    if(storages.create("tiktok").get('singlecheck')==today.getDate()){
        toastLog('今天已完成签到');
        return;
    }
    var singletxt = className('android.view.View').textMatches(/.*签到.*/).visibleToUser(true).findOne(1000);
    if(singletxt){
        click(singletxt.bounds().centerX(), singletxt.bounds().top - 20);
        sleep(3000);
    }
    //图像识别查找
    const result = gmlkit.ocr(captureScreen(), "zh");
    var single = result.find(3, e => e.text=='签到提醒');//FindPicture('img_single');
    if (single) {
        toastLog('1.点击立即签到',click(single.bounds.right, single.bounds.top - 130));
        sleep(1000);
        storages.create("tiktok").put('singlecheck', today.getDate());//记录是否检测过签到
        toastLog('2.再次点击签到',click(single.bounds.right, single.bounds.top - 130));
        sleep(3000);
        var popup = textMatches(/手机充值|确认身份信息/).visibleToUser(true).findOne(1000);
        if (popup) {
            toastLog('3.关闭弹出层:'+click(80, popup.bounds().centerY()));
            sleep(2000);
            var div = textMatches(/领惊喜现金|确认放弃.*/).visibleToUser(true).findOne(1000);
            if (div) {
                if (div.text() != '领惊喜现金') {
                    click(div.bounds().left + 50, div.bounds().top + 50);
                    sleep(1000);
                }
                back();
            }
        }
        sleep(3000);
        toastLog('4.是否进入看视频');
        var video = className("com.lynx.tasm.behavior.ui.text.FlattenUIText").desc("反馈").boundsInside(0, 0, device.width, 300).visibleToUser(true).findOne(1000);
        if (video) {
            playvideo();
        }else{
            toastLog('5.没有进看视频');
        }
        console.error('6.签到结束关闭');
    } else {
        toastLog('没有签到提示');
        //console.log(result);
        storages.create("tiktok").put('singlecheck', today.getDate());//记录是否检测过签到
    }
}

//点击右下角宝箱函数
function moneybox() {
    toastLog('查找开宝箱得金币位置');
    //var today = new Date();
    //if(storages.create("tiktok").get('boxopened')==today.getDate()){
    //    toastLog('今天已完成开宝箱');
    //    return;
    //}
    var taskpage=istaskpage();
    if (taskpage) {
        var findtask = className('android.view.View').descMatches(/.*秒后领|点击领.*|开宝箱得金币|.*累计已赚.*/).visibleToUser(true).findOne(1000);
        if (findtask) {
            toastLog("点击开宝箱得金币");
            click(findtask.bounds());
            //记录是否检测过签到
            //storages.create("tiktok").put('boxopened', today.getDate());
            sleep(3000);
            const result = gmlkit.ocr(captureScreen(), "zh");
            if(result){
                let x = result.find(3, e => (e.text=='开心收下'||e.text=='我知道了'));
                if(x)click(x.bounds);//再次点弹出宝箱层中的【我知道了】不去看广告视频
                sleep(1000);
            }else{
                toastLog('等待宝箱倒计时');
                return;
            }
            //如果进入看视频赚金币则观看视频
            //if(currentActivity()=='com.ss.android.excitingvideo.ExcitingVideoActivity')
            if (className("com.lynx.tasm.behavior.ui.text.FlattenUIText").desc("反馈").boundsInside(0, 0, device.width, 300).visibleToUser(true).findOne(1000)) {
                playvideo();
                console.error('开宝箱任务结束');
            } else {
                toastLog('等待宝箱任务倒计时');
            }
        }else{
            //无法定位是因为刚看过有倒计时，被排后列表后面了，当然也有可能是被弹出的签到遮挡了
            toastLog('无法定位开宝箱得金币位置');
            //storages.create("tiktok").put('singlecheck', 0);
            singlecheck();
            //console.info('无法定位开宝箱得金币位置【截图】takelist1_');
            //截图保存界面，以备后续查看
            //captureScreen(files.getSdcardPath() + '/脚本/takelist1_' + currentActivity() + '.png');
        }
    } else {
        toastLog('无法确定任务页moneybox');
        console.info('【截图】moneybox_');
        //截图保存界面，以备后续查看
        captureScreen(files.getSdcardPath() + '/脚本/moneybox_' + currentActivity() + '.png');
    }
}

//主程序函数===============================================================
function Main() {
    console.clear();
    console.hide();
    var loopTimes = random(5,9); //work循环次数
    function work() {
        toastLog("开始工作work");
        var homebtn = getHomeBtn();
        if (!homebtn) {
            toastLog("当前不在首页");
            homebtn = gohome();
        }
        if (homebtn) {
            toastLog("点赚钱图标进任务页");
            if (!ifcarmer(homebtn)) {
                sleep(5000);
                //检测签到提示是否弹出到【任务页】
                singlecheck();
                sleep(2000);
                //点击看广告视频赚金币
                takelist();
                sleep(3000);
                //点击右下角宝箱
                moneybox();
                sleep(3000);
            }
        }
        //回到首页准备刷视频
        console.error("开始刷视频模式+++++++++++++");
        gohome(); startSec = Date.now(); gogogo(999);
        console.error("刷视频模式结束+++++++++++++");
    }
    //打开抖音App
    if (getPackageName(AppName)) {
        openApp(AppName);
        //等待进入主界面成功
        toastLog('进入主函数'+ver);
        gohome();
        sleep(3000);
        toastLog("刚启动先刷视频提高活跃度");
        startSec = Date.now();
        gogogo(999);

        while (loopTimes > 0) {
            work();//开始工作
            sleep(5000);
            loopTimes--;
        }

        Samelogin = true;
        chengaccound();//切换账号

        if (Samelogin) { 
            loopTimes = 0; 
            console.warn('账号相同挂机等待'); 
        } else {
            console.warn('用新账号继续循环');
            storages.create("tiktok").put('singlecheck', 0);//新账号就需要再次检测签到
            //切换了新账号需要重启应用
            closeApp(AppName);
            sleep(5000);
            openApp(AppName);
            Main();
            return;
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
    cutDownBySleep(5,'5秒后进入息屏挂机模式');
    console.hide();
    closeApp(AppName);
    sleep(1000);
    oled(random(600,900));//熄屏挂机约10~15分钟左右
}
function getHomeBtn(n){
    var fudai=className('Button').desc('福袋').boundsInside(device.width/2, 0, device.width, 500).visibleToUser(true).findOne(1000);
    if (fudai) {return fudai;}
    var bb=className("TextView").desc("首页，按钮").boundsInside(0, device.height-250, 250, device.height).visibleToUser(true).findOne(n?n:1000);
    if(!bb||!bb.parent()){return null;}
    var bbw=bb.parent().bounds().width()+50;
    var bbh=bb.parent().bounds().height()+50;
    var bbt=bb.parent().bounds().top-50;
    //log(bbw,bbh,bbt);
    let img = images.clip(captureScreen(), (device.width-bbw)/2, bbt, bbw, bbh);
    //const result = paddle.ocrText(img);
    const result = gmlkit.ocr(img, "zh").toArray(3);
    //console.log("识别信息: ", result);
    img.recycle();
    if(result.length>0){
        if(result[0].text){
            let ax=result[0].text.match(/.*赚钱.*|.*开宝箱.*|.*春节红包.*/);
            console.log('识别信息',result[0].text);
            return ax;
        }else{
            let bx=result[0].match(/.*赚钱.*|.*开宝箱.*|.*春节红包.*/);
            console.log('识别信息',result[0]);
            return bx;
        }
    }else{
        return null;
    }
}
function getOKBtn(n){
    return className("com.lynx.tasm.behavior.ui.view.UIView").descMatches(/领取成功.*|\d{1,2}秒后可领奖励.*/).boundsInside(device.width / 2, 0, device.width, 300).visibleToUser(true).findOne(n?n:1000);
}
function toActivePage(page) {
    page=page||'';
    try{
        let intent = new Intent();
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        let package = packageName;//这个参数是包名必须定义
        let className = page;//这个必须准确
        let componentName = new android.content.ComponentName(package, className);
        intent.setComponent(componentName);
        context.startActivity(intent);
    }catch(e){
        console.warn('跳转失败，尝试重启软件并开启无障碍服务');
    }
}
function gohome() {
    toastLog('回到首页gohome');
    if (currentActivity() != 'com.ss.android.ugc.aweme.main.MainActivity') {
        toActivePage('com.ss.android.ugc.aweme.main.MainActivity');
        sleep(3000);
    }
    var MaxLoop = 5;
    var homebtn = getHomeBtn();
    while (!homebtn && MaxLoop > 0) {
        toast('转到首页');
        MaxLoop--;
        back(); sleep(3000);
        homebtn = getHomeBtn();
    }
    if (!homebtn) {
        toastLog('需要重启软件【截图】');
        //截图保存界面，以备后续查看
        captureScreen(files.getSdcardPath() + '/脚本/gohome1_' + currentActivity() + '.png');
        sleep(1000);
        device.wakeUp();//唤醒设备
        sleep(1000);
        left2right(1);
        sleep(1000);
        closeApp(AppName);
        sleep(5000);
        openApp(AppName);
        homebtn = getHomeBtn();
    }
    back(); sleep(1000);
    randomHeart(6);
    return homebtn;
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
    if (6!=num&&text('当前无新视频').visibleToUser(true).findOne(1000)) {
        console.log("当前无新视频");
        click(device.right - 100, device.top - 100);
        randomHeart(6);//切换频道
        sleep(1000);
        return;
    }
    const weights = {
        1: 0.01, 2: 0.02, 3: 0.03, 4: 0.04, 5: 0.05,
        6: 0.06, 7: 0.07, 8: 0.08, 9: 0.09, 0: 0.55
    };
    let randomIndex = num ? num : weightedRandom(weights);
    //随机下滑
    if (randomIndex == 1) {
        console.log('拟人:随机下滑');
        swipe(device.width / 3, device.height * 0.1 + randomIndex, device.width / 2, device.height * 0.9 - randomIndex, random(500, 900));
        return;
    }
    //连续上滑
    if (randomIndex == 2) {
        console.log('拟人:连续上滑');
        var k = random(2, 4);
        for (var i = 0; i < k; i++) {
            var j = random(2, 5);
            if (j == 3) {
                swipe(device.width / j, device.height * 0.1 + j * k, device.width / j, device.height * 0.9 - j * k, j * 50);
            } else {
                swipe(device.width / j, device.height * 0.9 - j * k, device.width / j, device.height * 0.1 + j * k, j * 50);
            }
            sleep(j * 250);
        }
        return;
    }
    //随机左右划
    if (randomIndex == 3) {
        left2right(2);
        return;
    }
    //随机恢复到首页
    if (randomIndex == 4) {
        console.log('拟人:随机回首页');
        gohome();
        return;
    }
    //加速播放
    if(randomIndex == 5) {
        var seekBar=className('android.widget.SeekBar').descMatches(/.*进度条.*/).findOne(1000);
        if(seekBar){
            let x1=random(90, 120);
            let y1=device.height/3;
            gestures([0, 1500, [x1,y1], [x1,y1]],[1400, 1500, [x1,y1], [1.1*x1, 2*y1]]);
            return;
        }
    }
    //随机切换频道
    if (randomIndex == 6) {
        var idList = [];
        className('TextView').clickable(true).descEndsWith('，按钮').boundsInside(0, 0, device.width, 300).find().forEach(function(tv){
            if(!tv.desc().match(/.*已选中.*|.*短剧.*|.*热点.*|.*团购.*|.*商城.*|.*直播.*|.*关注.*|.*集卡.*|.*包头.*|.*青山.*|.*找年味.*/)){
                //log(tv.desc());
                idList.push(tv);
            }
        });
        if(idList.length>0){
            let index = random(1, idList.length) - 1;
            console.log('拟人:切换频道:' + idList[index].desc());
            idList[index].click();
            sleep(2000);
            if (text('发现通讯录朋友').visibleToUser(true).findOne(1000)) {
                console.log("关注中没有视频");
                randomHeart(6);//再次切换频道
                slidingByCurve();
            }
            return;
        }
    }
    //随机收藏
    if (randomIndex == 7) {
        var collect = className("android.widget.LinearLayout").descStartsWith('收藏').clickable(true).boundsInside(device.width-500, device.height/2, device.width, device.height).visibleToUser(true).findOne(1000);
        if (collect) {
            console.log('拟人:随机收藏');
            click(collect.bounds());
            sleep(3000);
            slidingByCurve();
            return;
        }
    }
    //随机评论
    if(randomIndex == 8) {
        var plug = className("android.widget.LinearLayout").descStartsWith('评论').clickable(true).boundsInside(device.width-300, device.height/2, device.width, device.height).visibleToUser(true).findOne(1000);
        if(plug){
            console.log('拟人:随机评论');
            //长按评论按钮
            longClick(plug.bounds());
            sleep(1000);
            var plugdiv=id('root_view').className('android.view.ViewGroup').visibleToUser(true).findOne(1000);
            if(plugdiv){
                let icoY=plugdiv.bounds().bottom-90;
                let icoX=[
                    plugdiv.bounds().left+90,
                    plugdiv.bounds().left+220,
                    plugdiv.bounds().left+350,
                    plugdiv.bounds().left+500
                ];
                let index = random(1, icoX.length) - 1;
                //console.log(icoX[index],icoY);
                click(icoX[index],icoY);
                sleep(3000);
                slidingByCurve();
                return;
            }
        }
    }
    //随机点赞
    if (randomIndex == 9) {
        var like = className("android.widget.LinearLayout").descStartsWith('未点赞').clickable(true).boundsInside(device.width-300, device.height/2, device.width, device.height).visibleToUser(true).findOne(1000);
        if (like) {
            console.log('拟人:随机点赞');
            click(like.bounds());
            sleep(3000);
            slidingByCurve();
            return;
        }
    }
    //向上滑
    slidingByCurve();
}
function isvideoPage() {
    var isvideo = false;
    var taskpage = className('android.view.View').descMatches(/.*完成一次广告任务.*|.*累计已赚.*|.*一键领取|最高可得.*/).visibleToUser(true).findOne(1000);
    if (!taskpage) {
        console.verbose("检测是否视频播放中isvideoPage");
        //关闭自动弹出的层
        if (currentActivity().match(/.*BulletContainerActivity|.*NoMarginSheetBaseDialog|.*DuxBasePanelDialog/)) { 
            console.log('点左上角关闭弹出层isvideoPage');click(80, 150);left2right(2);sleep(1000);left2right(2);sleep(1000);
        }
        var div0=textMatches(/分享给|不感兴趣|建群分享|返回|关闭/).visibleToUser(true).findOne(1000);
        var div1=descMatches(/分享给|不感兴趣|建群分享|返回|关闭/).visibleToUser(true).findOne(1000);
        if (div0||div1) {
            isvideo = true;
            if(div1&&div1.id()&&div1.id().match(/.*\/root/)){
                toastLog("1.退出直播间");
                click(div1.bounds());
                sleep(1000);slidingByCurve();sleep(1000);
            }else{
                toastLog('0.关闭弹出层');
                click(80, 150);
                sleep(1000);slidingByCurve();sleep(1000);
            }
        }
        var seekBar=className('android.widget.SeekBar').desc('进度条').findOne(1000);
        if (seekBar) {
            isvideo = true;
            videoDuration=0;
            let y1 = seekBar.bounds().centerY();
            let x1 = random(300, 400);
            let x2 = random(600, 700);
            let duration_thread = threads.start(function () {
                var durationText = className('TextView').textMatches(/[0-9]+:[0-9]+/).boundsInside(device.width/2, 2 * device.height / 3, device.width, device.height).findOne(2000);
                if(durationText){
                    videoDuration = getDouyinVideoDuration(durationText.text());
                }
                duration_thread.interrupt();
            });
            gesture(random(800, 1200), [ [x1, y1],[x2, y1],[10+x1, y1] ]); 
            console.log("视频时长:",videoDuration+'s');
            return isvideo;
        }
        var view = descMatches(/播放视频.*|暂停视频.*|.*进入直播间.*|图片\d+，按钮/).visibleToUser(true).findOne(1000);
        if (view) {
            isvideo = true;
            console.verbose("正在播放视频:" + view.desc());
            if(view.desc().match(/.*进入直播间.*/)){
                slidingByCurve();
            }
            return isvideo;
        }
        className('android.widget.FrameLayout').clickable(true).depth(1).visibleToUser(true).find().filter(function (tv) {
            if (!tv.id()) {
                if (tv.bounds().right == device.width || tv.bounds().left == 10) {
                    if (tv.bounds().width() == tv.bounds().height()) {
                        if (tv.bounds().width() > 200 && tv.bounds().width() < 300) {
                            //log(tv);
                            isvideo = true;
                            return isvideo;
                        }
                    }
                }
            }
        });
    }
    return isvideo;
}
function gogogo(n) {
    let gotime = random(8,15); //刷视频每n分钟结束一次
    for (var i = 1; i <= n; i++) {
        let flashtime=parseInt((Date.now() - startSec) / 1000);
        console.log('第'+i+'次刷视频，累计用时:',flashtime,'秒');
        if( flashtime > gotime*60){console.warn(gotime+'分种超时，停止刷视频'); running = false; floaty.closeAll(); break;}
        if(!pause){
            if (isvideoPage()) {
                running = true;
                var adbutton = className('com.lynx.tasm.behavior.ui.view.UIView').descMatches(/提交,按钮.*/).boundsInside(0, 2*device.height/3, device.width, device.height).visibleToUser(true).findOne(1000);
                if (adbutton) {
                    //广告视频则多停留一个周期
                    left2right(2);
                    cutDownBySleep(random(5, 9),'广告停留:');
                    //进入广告看详情
                    if (!descMatches(/立即下载|立即领取/).boundsInside(0, 2*device.height/3, device.width, device.height).visibleToUser(true).findOne(1000)) {
                        click(adbutton.bounds());
                        cutDownBySleep(random(5, 9),'广告详情:');
                        back();
                    }
                    cutDownBySleep(random(5, 9),'观看广告:');
                }
                var sleepTime=(videoDuration>0&&videoDuration<90)?videoDuration:random(6, 30);
                cutDownBySleep(sleepTime,'观看视频:');//每个视频随机时间 6-30s
                randomHeart();//拟人化
            } else {
                floaty.closeAll();
                running = false;
                var dialog = currentActivity();
                toastLog('not at the video page',dialog);
                if (!dialog.match(/android\.app\.Dialog|android\.widget\.FrameLayout/)) {
                    //截图保存界面，以备后续查看
                    console.info('【gogogo截图】',dialog);
                    captureScreen(files.getSdcardPath() + '/脚本/gogogo_' + dialog + '.png');
                    gohome();
                }
                sleep(3000);
            }
        }else{
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
    fwin.frame.on("click",()=>{
        pause=!pause;
        console.log(pause?'脚本暂停:'+message:'脚本继续:'+message);
        fwin.card.attr("cardBackgroundColor",pause?"#ff0000":"#eeeeee");
    });
    sleep(500);
    for (let i = lasterSecend; i > 0; i--) {
        if (!running && !working) { break; }
        if (!fwin || !fwin.title) { break; }
        if (pause) {i++;}
        ui.run(() => { 
            fwin.title.setText(pause?'脚本已暂停，点击继续':message + "剩余" + i + "秒"); 
            fwin.frame.attr("alpha", 0.8); 
            let x = parseInt((device.width - fwin.width) / 2);
            let y = device.height-550;
            fwin.setPosition(x, y);
        });
        sleep(1000);
    }
    fwin=null;
    floaty.closeAll();
    sleep(500);
}
function getDouyinVideoDuration(durationStr) {
    if (durationStr) {
        //log('1',durationStr);
        var durationMatch = durationStr.match(/[0-9]+:[0-9]+/);
        if (durationMatch) {
            //log('2',durationMatch);
            var minutes = 0,seconds = 0;
            var parts = durationMatch[0].split(":");
            if (parts.length === 2) {
                //log('3',parts);
                minutes = parseInt(parts[0], 10);
                seconds = parseInt(parts[1], 10);
                return minutes * 60 + seconds;
            }
        }
    }
    return 0;
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
    var intX=parseInt(Math.random()*200+400);
    var intY=parseInt(Math.random()*200+200);
    var distance=parseInt(Math.random()*100+device.height/4);
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
    // top X,Y范围
    tx = randomPointLoc(parseInt(device.width / 3), parseInt(device.width / 2));
    ty = randomPointLoc(200, 300);
    // bottom X，Y 范围
    bx = randomPointLoc(parseInt(device.width / 3), parseInt(device.width / 2));
    by = randomPointLoc(device.height-500, device.height-400);

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
function sml_move(qx, qy, zx, zy, time) {
    var xxy = [time];
    var point = [];
    var dx0 = {"x": qx,"y": qy};
    var dx1 = {"x": random(qx - 100, qx + 100),"y": random(qy, qy + 50)};
    var dx2 = {"x": random(zx - 100, zx + 100),"y": random(zy, zy + 50),};
    var dx3 = {"x": zx,"y": zy};
    for (var i = 0; i < 4; i++) {
        eval("point.push(dx" + i + ")");
    }
    // log(point[3].x)
    for (let i = 0; i < 1; i += 0.08) {
        let newPoint=bezier_curves(point, i);
        xxyy = [parseInt(newPoint.x), parseInt(newPoint.y)]
        xxy.push(xxyy);
    }
    try {
        gesture.apply(null, xxy);
    } catch (e) {
        log('error:',xxy);
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
    result = {
        "x": 0,
        "y": 0
    };
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
      b > 0 && b <=device.height
    );
}
function openApp(appname){
    console.warn('启动应用:' + appname);
    var appstate = launchApp(appname);
    sleep(3000);
    if (appstate) {
        toastLog("应用正在运行");
        sleep(5000);
    } else {
        toastLog("无法自启动，需模拟点击");
        home();//要启动的APP必须放在第一页中
        sleep(3000);
        var app = id("item_title").text(appname).visibleToUser(true).findOne(1000);
        if (app) {
            click(app.bounds().centerX(), app.bounds().top - 50);
            sleep(8000);
        }else{
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
    if (is_sure&&is_sure.enabled()) {
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
function chengaccound() {
    console.warn("【准备切换登录账号】");
    //首先需要进入我的页面中
    if (!className("android.widget.TextView").desc('我，按钮').visibleToUser(true).findOne(1000)) {
        gohome();
        sleep(1000);
    }
    try {
        var me = className("android.widget.TextView").desc('我，按钮').visibleToUser(true).findOne(1000);
        if (me) click(me.bounds());
        sleep(2000);
        var more = className("android.view.ViewGroup").desc('更多').findOne(1000);
        if (more) click(more.bounds());
        sleep(2000);
        var setting = className("android.view.ViewGroup").desc('设置，按钮').findOne(1000).click();
        //if(setting)click(setting.bounds());
        sleep(2000);
        var account = className("android.widget.RelativeLayout").desc('切换账号').findOne(1000).click();
        //if(account)click(account.bounds());
        sleep(2000);

        var checkbox = className("android.widget.CheckBox").checked(true).visibleToUser(true).findOne(1000).parent();
        var loginID = checkbox.child(0).text();//切换前登录的账户名
        //找到当前为选择状态的下一个兄弟节点并点击选择，如果没有下一个兄弟，则选择第一个兄弟
        var checknext = checkbox.parent().child(getindexInParent(checkbox) + 1);
        if (checknext && checknext.className() == checkbox.className()) {
            Samelogin=false;
            toastLog("选择下一个账号");
            checknext.click();
        } else {
            //切换前后是否为相同账户
            Samelogin=loginID==checkbox.child(0).text();
            toastLog("选择第一个账号:"+Samelogin);
            checkbox.parent().child(0).click();
        }
        sleep(1000);

        var j = 0;
        var backbtn = id("back_btn").desc('返回').findOne(1000);
        while (backbtn) {
            backbtn.click();
            sleep(1000);
            backbtn = id("back_btn").desc('返回').findOne(1000);
            if (text('更多功能').findOne(1000)) {
                back();
                break;
            }
            if (j > 5) break;
        }
        back();
    } catch (e) {
        console.warn("切换登录账号失败");
    }
}
function isDeviceLocked() {
    importClass(android.app.KeyguardManager);
    importClass(android.content.Context);
    var km = context.getSystemService(Context.KEYGUARD_SERVICE);
    return { 'isScreenOn': device.isScreenOn(), 'isLocked': km.isKeyguardLocked(), 'isSecure': km.isKeyguardSecure() };
}
function update(){
    http.get('https://update.greasyfork.org/scripts/519265/%E6%8A%96%E9%9F%B3%E8%84%9A%E6%9C%AC.js', {}, function(res, err){
        if(res.statusCode == 200){
            var Source = res.body.bytes();
            if(Source){
                files.writeBytes(files.getSdcardPath() + '/脚本/抖音脚本.js', Source);
                console.verbose('更新抖音脚本:成功',ver);
            }else{
                console.verbose('更新抖音脚本:错误',ver);
            }
        }else{
            console.verbose('更新抖音脚本:失败',ver);
        }
    });
}

//===================================================================================
requestScreenCapture(false);//请求截图权限
global.starttime = Date.now();//程序运行开始时间

var oledwin = null, win = null;
function oled(i) {
    let j=i||3;
    floaty.closeAll();
    oledwin = floaty.rawWindow(
        `<frame bg="#000000">
            <card w="auto" h="auto" layout_gravity="center" cardBackgroundColor="#000000" >
            <vertical>
                <text id="texts" text="息屏挂机模式" textColor="#999999" textSize="13sp" />
                <button id="button" text="停止挂机" margin="0 20" />
            </vertical>
            </card>
        </frame>`
    );
    oledwin.button.on("click", function () {
        console.info('手动停止挂机');
        floaty.closeAll();
        oledwin=null;
        running=false;
    });
    oledwin.setSize(-1, -1);
    oledwin.setTouchable(true);
    sleep(300);
    console.info('挂机模式开启……');
    //保持脚本运行
    while (j > 0 && oledwin) {
        if (oledwin.texts) {
            let t = parseInt(j / 60) + "分" + parseInt(j % 60) + "秒";
            ui.run(() => { oledwin.texts.setText("息屏挂机倒计时:" + t + "\n\n倒计时结束后重启主线程tiktok") });
        }
        j--;
        sleep(1000);
    }
    floaty.closeAll();
    oledwin=null;
    running=false;
    console.show();
    console.info('挂机结束用时:',(parseInt((i-j) / 60) + "分" + parseInt((i-j) % 60) + "秒"));
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
    for (let c = 0; c < 9; c++) {//连续扫描60秒后返回结果，如果60秒停留在同一活动页面，则就要重启线程了
        //检测oled挂机模式结束，则重启main线程
        if (oledwin) { win = oledwin; return true; } else if (win) { win = null; return false; }
        currentActis[c] = currentActivity();
        //log('连续扫描60秒后返回结果',c);
        //关闭自动弹出的层
        if (currentActivity().match(/.*BulletContainerActivity|.*NoMarginSheetBaseDialog/)) { 
            console.log('点左上角关闭弹出层Observer');
            click(80, 150); left2right(2);sleep(1000);left2right(2);
            sleep(1000);continue;
        }
        var btntxt = textMatches(/忽略|禁止|单列|同意|满意|关闭|关闭应用|不在提醒|我知道了|以后再说|不感兴趣|暂不使用|忽略提醒|等待/).visibleToUser(true).findOne(1000);
        if (btntxt) {
            console.warn('1.点击:' + btntxt.text());
            click(btntxt.bounds());
            sleep(1000);continue;
        }
        var emoji = className('androidx.recyclerview.widget.RecyclerView').findOne(1000);
        if(emoji&&emoji.childCount()>3){
            let item=emoji.child(random(0,3));
            if(item&&isRectInScreen(item.bounds())){click(item.bounds());sleep(500);}
            item=emoji.child(random(0,3));
            if(item&&isRectInScreen(item.bounds())){click(item.bounds());sleep(500);}
            let btn=text('发送').visibleToUser(true).findOne(1000);
            if(btn){click(btn.bounds());sleep(1000);console.warn('0.发表评论');}
            btn=idMatches(/.*\/back_btn/).desc('关闭').visibleToUser(true).findOne(1000);
            if(btn){click(btn.bounds());sleep(1000);continue;}
        }
        var div0 = className('android.widget.ImageView').desc('关闭').clickable(true).visibleToUser(true).findOne(1000);
        if (div0) {
            console.warn('2.关闭:', div0.desc());//评论
            div0.click();
            sleep(1000);continue;
        }
        var div1 = text('请完成下列验证后继续').visibleToUser(true).findOne(1000);
        if (div1) {
            console.warn('请完成下列验证后继续');
            //这里有一个滑动块验证，待开发

            click(div1.bounds().right + 250, div1.bounds().centerY());
            sleep(1000);continue;
        }
        var div2 = textMatches(/手机充值|确认身份信息/).visibleToUser(true).findOne(1000);
        if (div2) {
            console.warn('3.关闭:',div2.text());
            click(80, div2.bounds().centerY());
            sleep(1000);continue;
        }
        var div3=textMatches(/领惊喜现金|确认放弃.*/).visibleToUser(true).findOne(1000);
        if (div3) {
            console.warn('4.关闭:',div3.text());
            if(div3.text()!='领惊喜现金'){
                click(div3.bounds().left+50,div3.bounds().top+50);
                sleep(1000);
            }
            back();
            sleep(1000);continue;
        }
        var div4=textMatches(/立即预约领金币/).visibleToUser(true).findOne(1000);
        if (div4) {
            console.warn('5.关闭:',div4.text());
            click(div4.bounds().centerX(),div4.bounds().centerY()+250);
            sleep(1000);continue;
        }
        // 验证账号重新登录
        if (textMatches(/.*请重新登录|.*体验完整功能/).visibleToUser(true).findOne(1000)) {
            click("重新登录");
            console.warn('重新登录验证');
            sleep(3000);
            var a = textContains("已阅读并同意").visibleToUser(true).findOne(1000);
            if (a) {
                click(a.bounds().left, a.bounds().centerY());
                sleep(3000);
                click(a.bounds().centerX(), a.bounds().centerY() - 200);
                click("同意并登录");
            } else {
                click("一键登录");
                sleep(3000);
                click("同意并登录");
            }
            sleep(3000);
            if(className('EditText').text('请输入手机号').visibleToUser(true).findOne(1000)){
                work_thread.interrupt();
                console.warn('需要手机号码验证');
                console.error('本脚本终止执行');
                engines.stopAll();
            }
        }
        sleep(1000);//这是每秒扫描一次活动页
    }
    //toastLog(currentActivity());
    let ac = unique(currentActis);
    let cc = currentActivity().match(/.*ExcitingVideoActivity|.*MainActivity|.*app\.Dialog|android\.widget\.FrameLayout|.*ToastDialog|.*ScreenCaptureRequestActivity/);
    if (ac.length == 1 && !cc) {
        console.info('60秒卡顿:',ac[0]);
        //截图保存界面，以备后续查看
        captureScreen(files.getSdcardPath() + '/脚本/Observer2_' + currentActivity() + '.png');
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
        if(oledwin){if(oledwin.texts)console.verbose(oledwin.texts.text().split("\n").shift());}
        let worktime = parseInt((Date.now() - starttime) / 1000);
        console.verbose("脚本连续运行:" + SecondsToHMS(worktime));
        //如果运行时间超过4小时，则关闭应用，停止脚本。
        if (worktime > 60 * 60 * 4) {
            running = false;
            floaty.closeAll();
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
                running=false;
                floaty.closeAll();
                sleep(5000);
                if(currentPackage() == packageName){console.hide();closeApp(AppName);}
                sleep(5000);
                Main();
            });
        }
    }, 3000);//这个时间是线程休息时间
});

setTimeout(function () {
    if (!files.exists(files.getSdcardPath() + '/脚本/自动上滑脚本.js')) {
        http.get('https://update.greasyfork.org/scripts/521999/%E8%87%AA%E5%8A%A8%E4%B8%8A%E6%BB%91%E8%84%9A%E6%9C%AC.js', {}, function(res, err){
            if(res.statusCode == 200){
                var Source = res.body.bytes();
                if(Source){
                    files.writeBytes(files.getSdcardPath() + '/脚本/自动上滑脚本.js', Source);
                    console.verbose('更新自动上滑:成功');
                }else{
                    console.verbose('更新自动上滑:错误');
                }
            }else{
                console.verbose('更新自动上滑:失败');
            }
        });
    }
}, 30*1000);

