
importClass(android.content.Context);
importClass(android.provider.Settings);
importClass(android.app.KeyguardManager);
try {
    var km = context.getSystemService(Context.KEYGUARD_SERVICE);//km.isKeyguardLocked(),km.isKeyguardSecure()
    let enabledServices = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);
    //log('当前已启用的辅助服务\n', enabledServices);
    if (!enabledServices.match(/.*org\.autojs\.autoxjs\.v6\/com\.stardust\.autojs\.core\.accessibility\.AccessibilityService.*/g)) {
        let Services = (enabledServices ? enabledServices + ":" : "") + "org.autojs.autoxjs.v6/com.stardust.autojs.core.accessibility.AccessibilityService";
        Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES, Services);
        Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ACCESSIBILITY_ENABLED, '1');
        sleep(3000);
    }
    toastLog("成功开启AutoJS的辅助服务");
} catch (error) {
    //受权方法：开启usb调试并使用adb工具链接手机，执行 adb shell pm grant org.autojs.autoxjs.v6 android.permission.WRITE_SECURE_SETTING
    toastLog("请受权AutoJS启用辅助服务");
}
auto.waitFor();
//停止其它脚本
engines.all().map((ScriptEngine) => {
    if (engines.myEngine().toString() !== ScriptEngine.toString()) {
        ScriptEngine.forceStop();
    }
});
//============================================================
var AppName = ["抖音极速版","快手极速版","百度极速版"]; 
var runAppName = AppName[0], times = 100; //滑动次数
toastLog('当前分辨率：'+device.width+'X'+device.height);
//toastLog('唯一标识码：'+device.fingerprint);
const img_block = 'data:image/png;base64,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';

//息屏状态将屏幕唤醒
global.opentimes=0;
while (!device.isScreenOn() || km.isKeyguardLocked()) {
    opentimes++;
    device.wakeUp();//唤醒设备
    toastLog('屏幕唤醒');
    sleep(1500); //等待屏幕亮起
    back();//如果锁屏后收到新消息，上滑不能解锁屏幕，需要返回一次后上滑
    device.keepScreenOn();//一直保持屏幕常亮
    sleep(1500);
    if (km.isKeyguardSecure()) {
        toastLog('密码解锁');
        //待开发
        break;
    } else {
        toastLog('上滑解锁');
        swipe(device.width / 2, device.height * 0.8, device.width / 2, device.height * 0.3, 400);
    }
    sleep(1500);
    if(opentimes>3){
        toastLog('解锁失败，请尝试重启本软件并开启无障碍服务');
        break;
    }
}
global.oledwin=null;
global.looptimes=times;
global.pause = false; //是否暂停
global.ver = 'v2.3';//版本号
global.theapp=getAppName(currentPackage());
function Main() {
    toastLog('进入主程序:'+theapp);
    var index=AppName.indexOf(theapp);
    if (index > 0) {
        AppName.splice(index);
        AppName.unshift(theapp);
    }
    //log(AppName);
    for (i = 0; i < AppName.length; i++) {
        looptimes=times;
        var packageName = getPackageName(AppName[i]);
        if (packageName) {
            toastLog('启动应用:' + AppName[i]);
            var appstate = launchApp(AppName[i]);
            sleep(5000);
            if (appstate) {
                toastLog("应用正在运行");
            } else {
                toastLog("无法自启动，需模拟点击");
                home();
                sleep(3000);
                var app = id("item_title").text(AppName[i]).visibleToUser(true).findOne(2000);
                if (app) {
                    click(app.bounds().centerX(), app.bounds().top - 50);
                    sleep(10000);
                }
            }
            runAppName=AppName[i];//安全线程中使用
            while (looptimes > 0) {
                if(pause){sleep(3000);continue;}
                var tiktokhomepage = className("Button").descStartsWith("侧边栏").clickable(true).boundsInside(0, 0, 500, 500).visibleToUser(true).findOne(1000);
                var giftshowhomepg = idMatches(/.*\/left_btn|.*\/thanos_home_top_search/).boundsInside(0, 0, 500, 500).visibleToUser(true).findOne(1000);
                var baiduhomepage = idMatches(/.*\/obfuscated/).text('视频').boundsInside(0, device.height-500, 500, device.height).visibleToUser(true).findOne(1000);
                if (tiktokhomepage||giftshowhomepg||baiduhomepage) {
                    looptimes--;
                    var videoDuration = 0;
                    if(tiktokhomepage){
                        var seekBar=className('android.widget.SeekBar').desc('进度条').findOne(1000);
                        var y1 = seekBar?seekBar.bounds().centerY()-5:0;
                    }else if(giftshowhomepg){
                        var seekBar=className('android.widget.HorizontalScrollView').idMatches(/.*\/tab_layout/).findOne(1000);
                        var y1 = seekBar?seekBar.bounds().top-5:0;
                    }else{
                        click(baiduhomepage.parent().bounds());sleep(2000);
                        var seekBar=textMatches(/全屏观看/).findOne(1000);
                        var y1 = seekBar?baiduhomepage.parent().bounds().top-5:0;
                    }
                    if (seekBar) {
                        isvideo = true;
                        let x1 = random(300, 400);
                        let x2 = random(600, 700);
                        let duration_thread = threads.start(function () {
                            var durationText = className('TextView').textMatches(/[0-9]+:[0-9]+/).boundsInside(device.width/2, 2 * device.height / 3, device.width, device.height).findOne(2000);
                            if(durationText){
                                videoDuration = getDouyinVideoDuration(durationText.text());
                            }
                            duration_thread.interrupt();
                        });
                        gesture(random(800, 1200), [ [x1, y1],[x2, y1],[x1, y1] ]);  
                        console.log("视频时长:",videoDuration+'s');
                    }
                    var sleepTime=(videoDuration>0&&videoDuration<90)?videoDuration:random(6, 30);//每个视频随机时间 6-30秒
                    console.verbose("浏览:" + (times-looptimes), "停留:" + sleepTime + "s");
                    cutDownBySleep(sleepTime,'观看视频');
                    randomHeart();//拟人化
                } else {
                    var living = idMatches(/.*\/root|.*\/liveshow_cmp_close/).clickable(true).boundsInside(device.width-300, 0, device.width, 300).visibleToUser(true).findOne(1000);//直播间
                    if (living) {
                        isvideo = true;
                        toastLog("1.退出直播间");
                        click(living.bounds());
                        sleep(1000);slidingByCurve();sleep(1000);
                    }
                    if (currentActivity() == 'com.ss.android.ugc.aweme.live.LivePlayActivity') {
                        isvideo = true;
                        toastLog("2.退出直播间");
                        back();
                        sleep(1000);slidingByCurve();sleep(1000);
                    }
                    var btn = textMatches(/退出直播.*/).visibleToUser(true).findOne(1000)
                    if(btn){
                        isvideo = true;
                        click(btn.bounds());
                        sleep(1000);slidingByCurve();sleep(1000);
                    }
                    toast('不在抖音或快手页面');
                    oledwin=null;
                    sleep(3000);
                }
            }
            closeApp(runAppName);
        } else {
            toastLog("未安装:" + AppName[i]);
        }
    }
    toastLog("自动刷屏完成");
    try {
        device.cancelKeepingAwake();
        //熄屏
        runtime.accessibilityBridge.getService().performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_LOCK_SCREEN);
    } catch (e) {

    }
    //停止本脚本
    engines.myEngine().forceStop();
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
        if (oledwin) { break; }
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
                return minutes * 60 + seconds + 3;
            }
        }
    }
    return 0;
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
    if(idMatches(/.*center/).text('请完成安全验证').visibleToUser(true).findOne(1000)){return;}
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
    //随机恢复到首页
    if(randomIndex == 4){
        console.log('拟人:随机回首页');
        sleep(3000);back();sleep(3000);back();sleep(3000);
        return;
    }
    //加速播放
    if(randomIndex == 5){
        var seekBar1=className('android.widget.SeekBar').descMatches(/.*进度条.*/).findOne(1000);
        var seekBar2=className('android.widget.HorizontalScrollView').idMatches(/.*\/tab_layout/).findOne(1000);
        if(seekBar1||seekBar2){
            let x1=random(90, 120);
            let y1=device.height/3;
            gestures([0, 1500, [x1,y1], [x1,y1]],[1400, 1500, [x1,y1], [1.1*x1, 2*y1]]);
            return;
        }
    }
    //连续上滑
    if (randomIndex == 8) {
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
    //向上滑
    slidingByCurve();
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
function slidingByCurve() {
    if (idMatches(/.*center/).text('请完成安全验证').visibleToUser(true).findOne(1000)) { log('正在完成安全验证'); return; }
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
function randomPointLoc(start,end){
    len = Math.abs(end - start); 
    loc = Math.floor(Math.random() * len) + start;
    return loc;
}
function randomRangeTime(start,end){
    len = Math.abs(end -start)*1000; 
    ms = Math.floor(Math.random() * len) + start*1000;
    return ms;
}
function radmoRect(rect){
    let xy=rect;
    if(rect){
        xy.left=random(100,rect.width()-100);
        xy.top=random(100,rect.height()-100);
        xy.bottom=xy.top+120;
        xy.right=xy.left+120;
    }
    return xy;
}
function sml_move(qx, qy, zx, zy, time) {
    var xxy = [time];
    var point = [];
    var dx0 = {"x": qx,"y": qy};
    var dx1 = {"x": random(qx - 150, qx + 150),"y": random(qy, qy + 50)};
    var dx2 = {"x": random(zx - 150, zx + 150),"y": random(zy, zy + 50)};
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
        log(xxy);
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

importClass(org.opencv.imgproc.Imgproc);
importClass(org.opencv.core.Core);
importClass(org.opencv.core.Rect);
importClass(org.opencv.core.Mat);
importClass(org.opencv.core.Point);
importClass(org.opencv.core.Size);
importClass(org.opencv.core.CvType);
importClass(org.opencv.core.Scalar);
importClass(org.opencv.imgcodecs.Imgcodecs);

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
function MatchOptions(threshold, region, scaleFactors, max, grayTransform) {
    this.threshold = threshold;
    this.region = region;
    this.scaleFactors = scaleFactors;
    this.max = max;
    this.grayTransform = grayTransform;
}

const defaultMatchOptions = new MatchOptions(0.9, undefined, [[1, 1], [0.9, 0.9], [1.1, 1.1], [0.8, 0.8], [1.2, 1.2]], 5, true);
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
function FindPicture(tempBase64,ScreenImage) {
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
    console.log(tempBase64, result.length==0?{}:result[0].point);
    // 将结果画框展示
    //showMatchRectangle(result, largeImage.mat, template.mat);
    template.recycle();
    setTimeout(function () { largeImage.recycle(); }, 6000);
    return bounds;
}

/** 拖动滑块*/
function dragSlider(ax,by,br,bigimg) {
    var img = bigimg;
    if(!bigimg){
        var pic = images.grayscale(captureScreen());
        //img = images.adaptiveThreshold(images.grayscale(pic), 255, "MEAN_C", "BINARY", 5, 10);
        img = images.inRange(pic, '#000000', '#444444');
    }
    var newimg=images.cvtColor(img, "GRAY2RGBA");
    //if(bigimg){
    //    images.save(newimg, files.getSdcardPath() + '/脚本/2.jpg', "jpg", 100);
    //    app.viewFile(files.getSdcardPath() + '/脚本/2.jpg');
    //}
    var t = random(4855,5522);
    var xy= FindPicture('img_block',newimg);
    //console.info("识别结果：" , xy);
    if (xy) {
        toastLog("识别成功：" +ax+", "+by);
        setTimeout(function (){
            gesture(1000,  [ax, by],[ax+100, by-10],[ax+200, by+10],[ax+250, by-10],[ax+300, by],[ax+350, by]);
        },500);
        var mythread = threads.start(function () {
            setTimeout(function (){
                gesture(2000, [ax+350, by],[ax+500, by+10],[ax+600, by],[xy.centerX, by-10] );
                mythread.interrupt();
            },1200);
        });
        //等待该线程完成
        //mythread.join();
    } else if(!bigimg) {
        toastLog("识别有误，二次识别");
        img = images.inRange(pic, '#bbbbbb', '#ffffff');
        //bigimg = images.adaptiveThreshold(images.grayscale(pic), 255, "MEAN_C", "BINARY", 5, 10);
        dragSlider(ax, by, br, img);
    }else{
        toastLog("识别有误，尝试滑动");
        setTimeout(function (){
            gesture(1000,  [ax, by],[ax+100, by-10],[ax+200, by+10],[ax+250, by-10],[ax+300, by],[ax+350, by]);
        },500);
        var mythread = threads.start(function () {
            setTimeout(function (){
                gesture(2000, [ax+350, by],[ax+500, by+10],[ax+600, by],[br-150, by-10] );
                mythread.interrupt();
            },1200);
        });
    }
}

requestScreenCapture(false);//请求截图权限
runtime.getImages().initOpenCvIfNeeded();//初始化OpenCv

/**
*监控脚本是否卡在某界面不动，发现此情况重启脚本
*/
function Observer() {
    if (oledwin) {return true;}
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
    currentActis = new Array();
    for (let c = 0; c < 59; c++) {//连续扫描60秒后返回结果，如果60秒停留在同一活动页面，则就要重启线程了
        //关闭自动弹出的层
        var btn=idMatches(/.*\/close|.*\/tabs_panel_close/).visibleToUser(true).findOne(1000);
        if (btn) { 
            console.log('关闭弹出层Observer');
            click(btn.bounds());
        }
        var accept = textMatches(/立即邀请/).visibleToUser(true).findOne(1000);
        if (accept) { 
            console.log('取消立即邀请');
            back();
        }
        var btntxt = textMatches(/忽略|禁止|单列|同意|满意|关闭|关闭应用|不在提醒|我知道了|以后再说|暂不使用|忽略提醒|仍要退出|不感兴趣|去验证|立即领取|提醒我每天来领|取消/).visibleToUser(true).findOne(1000);
        if (btntxt) {
            console.warn('点击:', btntxt.text());
            //截图保存界面，以备后续查看
            //captureScreen(files.getSdcardPath() + '/脚本/Observer1_' + currentActivity() + '.jpg');
            click(btntxt.bounds());
            sleep(1000);
        }
        //currentActivity()='.*FaceRecognitionActivity';
        var block = textMatches(/.*填充拼图|.*使图片角度为正|请依次点击.*/).visibleToUser(true).findOne(1000);
        if(block){
            toastLog(block.text());
            if(block.text().match(/请依次点击.*/)){
                let charPositions = [], bunds=[];
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
                        if(words){
                            //console.log(charPositions[i],words.bounds);
                            bunds.push(words.bounds);
                            click(words.bounds.centerX()+aa.bounds().left,words.bounds.centerY()+aa.bounds().top);
                        }else{
                            let xy = radmoRect(aa.bounds());
                            //console.log(charPositions[i],xy);
                            for(j=0;j<bunds.length;j++){
                                //console.log(charPositions[i],xy,bunds[j]);
                                if(xy.intersect(bunds[j])){
                                    //console.log('有重合,重新生成',charPositions[i],xy,bunds[j]);
                                    xy = radmoRect(aa.bounds());
                                    j=0;
                                    continue;
                                }
                            }
                            bunds.push(xy);
                            click(xy.centerX()+aa.bounds().left,xy.centerY()+aa.bounds().top); 
                        }
                        sleep(random(900,1200));
                    }
                    sleep(1000);
                    block = textMatches(/请依次点击.*/).visibleToUser(true).findOne(1000);
                    if(!block)swipe(device.width / 3, device.height - 300, device.width / 2, 300, random(500, 900));
                }
            }else if(block.text().match(/.*使图片角度为正/)){
                var ax=block.bounds().left+50;
                var by=block.bounds().centerY();
                var br=block.bounds().right-random(350,450);
                //gesture(random(1234,2345),  [ax, by],[ax+30, by-10],[br, by] );
                setTimeout(function (){
                    gesture(1000,  [ax, by],[ax+100, by-10],[ax+200, by+10],[ax+250, by-10],[ax+300, by],[ax+350, by]);
                },500);
                var mythread = threads.start(function () {
                    setTimeout(function (){
                        gesture(2000, [ax+350, by],[ax+500, by+10],[ax+600, by],[br, by-10] );
                        mythread.interrupt();
                    },1200);
                });
                sleep(1000);
                block = textMatches(/.*使图片角度为正/).visibleToUser(true).findOne(1000);
                if(!block)swipe(device.width / 3, device.height - 300, device.width / 2, 300, random(500, 900));
            }else{
                var aa=className('android.widget.Image').textMatches(/cutPic\?captchaSn.*/).visibleToUser(true).findOne(1000);
                var ax = aa.bounds().centerX();
                var by = block.bounds().centerY();
                var br = block.bounds().right;
                //console.log(ax,by,br);
                dragSlider(ax,by,br);
                sleep(1000);
                block = textMatches(/.*填充拼图/).visibleToUser(true).findOne(1000);
                if(!block)swipe(device.width / 3, device.height - 300, device.width / 2, 300, random(500, 900));
            }
        }
        //toastLog(currentActivity());
        currentActis[c] = currentActivity();
        sleep(1000);//这是每秒扫描一次活动页
    }
    //toastLog(currentActivity());
    let ac = unique(currentActis);
    let cc = currentActivity().match(/.*HomeActivity|.*PhotoDetailActivity|.*AwardVideoPlayActivity|.*AdKwaiRnActivity|.*app\.Dialog|android\.widget\.FrameLayout|.*ToastDialog|.*ScreenCaptureRequestActivity/);
    if (ac.length == 1 && !cc) {
        console.log(ac,currentActivity());
        return false
    }
    return true
}
//let times = rawInput("请输入要自动刷的视频次数：","50");
// 》》》》》》》》》》》》》》》》》》》 START
work_thread = threads.start(function () {
    Main();
});
 
observer_thread = threads.start(function () {
    setInterval(function () {
        console.verbose('--------多线程安全检测---------');
        if (!Observer()&&looptimes>0) {
            work_thread.interrupt();
            work_thread = threads.start(function () {
                console.warn("Main线程在5秒后重启！",currentActivity());
                toast("Main线程在5秒后重启！");
                oledwin=null;
                closeApp(runAppName);
                sleep(5000);
                Main();
            });
        }
    }, 10000);
});

setTimeout(function () {
    if (!files.exists(files.getSdcardPath() + '/脚本/抖音脚本.js')) {
        http.get('https://update.greasyfork.org/scripts/519265/%E6%8A%96%E9%9F%B3%E8%84%9A%E6%9C%AC.js', {}, function(res, err){
            if(res.statusCode == 200){
                var Source = res.body.bytes();
                if(Source){
                    files.writeBytes(files.getSdcardPath() + '/脚本/抖音脚本.js', Source);
                    console.verbose('更新抖音脚本:成功');
                }else{
                    console.verbose('更新抖音脚本:错误');
                }
            }else{
                console.verbose('更新抖音脚本:失败');
            }
        });
    }
    if (!files.exists(files.getSdcardPath() + '/脚本/快手脚本.js')) {
        http.get('https://update.greasyfork.org/scripts/520135/%E5%BF%AB%E6%89%8B%E8%84%9A%E6%9C%AC.js', {}, function(res, err){
            if(res.statusCode == 200){
                var Source = res.body.bytes();
                if(Source){
                    files.writeBytes(files.getSdcardPath() + '/脚本/快手脚本.js', Source);
                    console.verbose('更新快手脚本:成功');
                }else{
                    console.verbose('更新快手脚本:错误');
                }
            }else{
                console.verbose('更新快手脚本:失败');
            }
        });
    }
    if (!files.exists(files.getSdcardPath() + '/脚本/百度脚本.js')) {
        http.get('https://update.greasyfork.org/scripts/523350/%E7%99%BE%E5%BA%A6%E8%84%9A%E6%9C%AC.js', {}, function(res, err){
            if(res.statusCode == 200){
                var Source = res.body.bytes();
                if(Source){
                    files.writeBytes(files.getSdcardPath() + '/脚本/百度脚本.js', Source);
                    console.verbose('更新百度脚本:成功');
                }else{
                    console.verbose('更新百度脚本:错误');
                }
            }else{
                console.verbose('更新百度脚本:失败');
            }
        });
    }
    //if (!files.exists(files.getSdcardPath() + '/脚本/自动上滑脚本.js')) {
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
    //}
}, 30*1000);