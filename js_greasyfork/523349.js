auto.waitFor();
global.AppName = "百度极速版";
global.packageName = "com.baidu.searchbox.lite";
global.running = false; //是否正在刷视频中
global.working = false; //是否正在刷视频中
global.pause = false; //是否暂停
global.startSec = Date.now();//刷视频计时
global.ver = 'v1.0';//版本号
if (!auto.service || device.width == 0) {
    console.warn("2.请重新开启无障碍服务");
    auto.service.disableSelf();
    app.startActivity({ action: "android.settings.ACCESSIBILITY_SETTINGS" });
    android.os.Process.killProcess(android.os.Process.myPid());
}
if (device.fingerprint + '/' + ver != storages.create("baidu").get('device_info')) { setTimeout(function () { update(); }, 60 * 1000); }
engines.all().map((ScriptEngine) => { if (engines.myEngine().toString() !== ScriptEngine.toString()) { ScriptEngine.forceStop(); } });
//判断签到层
function singlecheck() {
    toastLog('判断签到提示');
    var popup=className('TextView').text('直接领取').visibleToUser(true).findOne(1000);
    if(popup){
        click(popup.bounds());sleep(1000);
        var btn = className('TextView').text('我知道了').visibleToUser(true).findOne(1000);
        if(btn){click(btn.bounds());}
        toastLog('今天已完成签到');
    }
    toastLog('没有签到提示');
}

function gotask() {
    let taskbtn = idMatches(/.*\/obfuscated/).textMatches(/任务/).visibleToUser(true).findOne(1000);
    if (taskbtn) {
        click(taskbtn.parent().bounds());
        sleep(2000);
        //关闭弹出层
        var popup=className('TextView').textMatches(/任务完成|可以提现啦/).visibleToUser(true).findOne(1000);
        if(popup){popup.parent().parent().child(1).click();}
        //签到层
        singlecheck();
    }else{
        gohome();
        sleep(2000);
        gotask();
        return;
    }
}

//装载任务列表
function tasklist() {
    toastLog('查找任务页tasklist');
    if(!textMatches(/金币收益|去提现/).visibleToUser(true).findOne(1000)){
        gotask();
        sleep(8000);
        //看文章视频领金币
        className('TextView').text('可领').clickable(true).find().forEach(function (tv) {
            tv.click();
            sleep(1000);
        });
        //开宝箱
        moneybox();
    }
    var temparr = [];
    var TempArray = new Array();
    if(textMatches(/金币收益|去提现/).visibleToUser(true).findOne(1000)){
        toast('装载任务');
        idMatches(/.*task-item-.*/).find().forEach(function (tv) {
            let list = tv.children();
            //log(list);
            for (i = 0; i < list.length; i++) {
                if (list[i].text().match(/看广告赚钱|今日签到|搜索赚金币.*/)) {
                    //log(list[i].text());
                    temparr.push(list[i].text());
                    let temp = [list[i].text(), tv.child(list.length-1)];
                    TempArray.push(temp);
                }
            }
        });
        console.error('装载完成:', temparr);
        toast('装载完成');

    }else{
        toastLog('没有找到任务页tasklist');
    }
    return TempArray;
}

//点击右下角宝箱函数
function moneybox() {
    toastLog('查找右下角宝箱moneybox');
    var xbox = textMatches(/开宝箱得金币|点我减\d+秒/).visibleToUser(true).findOne(1000);
    if(xbox){
        click(xbox.parent().bounds());
        sleep(2000);
        let tip = textMatches(/恭喜获得宝箱奖励/).visibleToUser(true).findOne(1000);
        if(tip)click(tip.parent().parent().child(1).bounds());
    }

    //如果进入看视频赚金币则观看视频
    let advedio = className('ImageView').idMatches(/.*\/obfuscated/).boundsInside(device.width - 500, 0, device.width, 500).visibleToUser(true).findOne(1000);
    if (advedio ) {
        playvideo('宝箱');
        console.error('宝箱任务结束moneybox');
    } else {
        toastLog('1.未进入宝箱视频');
    }
}

//判断进入看广告视频赚金币
function playvideo(m) {
    function stopvideo(n) {
        sleep(1000);
        //操作弹出提示
        var okbtn = className('TextView').textMatches(/再看[0-9]+秒.*/).visibleToUser(true).findOne(1000);
        if (okbtn) {
            click(okbtn.bounds());
            var b = okbtn.text().match(/\d+/);
            var t = 1 * (b ? b[0] : 1) + random(9, 15);
            cutDownBySleep(t, '再看');
        }
        okbtn = className('TextView').textMatches(/再看一个.*/).visibleToUser(true).findOne(1000);
        if (okbtn) {
            click(okbtn.bounds());
            playvideo(n);
            return;
        }
        okbtn = className('TextView').textMatches(/返回继续.*/).visibleToUser(true).findOne(1000);
        if (okbtn) {
            var btn = className('TextView').text('残忍离开').visibleToUser(true).findOne(1000);
            if(btn)click(btn.bounds());
        }
        console.log(n+'.end');
        sleep(1000);
    }
    working = true;
    console.error('开始循环赚金币playvideo');
    let i=0;

    //搜索赚金币
    if(descMatches(/.*百度搜索，请输入.*/).visibleToUser(true).findOne(1000)){
        console.log('百度搜索，请输入');
        for(i=0;i<5;i++){
            var t=random(3, 6);
            cutDownBySleep(t, m);
            slidingByCurve();
        }
        gotask();
    }

    //看广告赚钱
    var okbtn = idMatches(/.*\/obfuscated/).boundsInside(0, 0, device.width, 500).visibleToUser(true).findOne(1000);
    while (okbtn) {
        i++;
        console.log(m+'.1.'+i);
        var b = idMatches(/.*\/obfuscated/).textMatches(/\d+/).visibleToUser(true).findOne(1000);
        var t = 1 * (b ? b.text() : 1) + random(9, 15);
        cutDownBySleep(t, m);
        back();
        stopvideo(m);
        if(i>50){break;}
        okbtn = idMatches(/.*\/obfuscated/).boundsInside(0, 0, device.width, 500).visibleToUser(true).findOne(1000);
    }

    //返回
    var btn = className('TextView').text('残忍离开').visibleToUser(true).findOne(1000);
    if(btn){click(btn.bounds());sleep(1000);}
    if(!textMatches(/金币收益|去提现/).visibleToUser(true).findOne(1000)) {back(); sleep(1000); gotask(); sleep(1000);}
    var popup=className('TextView').text('任务完成').visibleToUser(true).findOne(1000);
    if(popup){popup.parent().parent().child(1).click();}
    console.error('循环赚金币结束playvideo');
    working = false;
}

//主程序函数===============================================================
function Main(){
    var loopTimes = random(3,5); //work循环次数
    function work() {
        toastLog("开始工作work");
        var listArray = tasklist();
        if (listArray.length > 0) {
            sleep(3000);
            toastLog('开始做任务');
            for (i = 0; i < listArray.length; i++) {
                if (listArray[i][1]) {
                    toastLog(i+'.'+listArray[i][0]);
                    //点击任务,这里不可以用坐标点击，因为有的条目可能会在屏幕外面
                    listArray[i][1].click();
                    sleep(1000);
                    playvideo(listArray[i][0]);
                }
            }
        }else{
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
        toastLog('进入主函数'+ver);
        gohome();
        sleep(3000);
        toastLog("刚启动先刷视频提高活跃度");
        gogogo(999);

        while (loopTimes > 0) {
            work();//开始工作
            sleep(5000);
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
    cutDownBySleep(5,'5秒后进入息屏挂机模式');
    console.hide();
    closeApp(AppName);
    sleep(3000);
    //oled(random(600,900));//熄屏挂机约10~15分钟左右
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
        i+=pause?1:0;
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
function gohome() {
    function closediv(){
        //关闭弹出层
        var popdiv=className('Image').text('huge_sign_marketing_popup').findOne(1000);
        if(popdiv){
            click(popdiv.parent().parent().child(0).bounds());
            sleep(1000);
        }
        var liveing = idMatches(/.*live_close_container/).boundsInside(0, 0, device.width, 500).visibleToUser(true).findOne(2000);
        if (liveing) {
            click(liveing.bounds());
            sleep(1000);
            let okbtn = className('TextView').textMatches(/.*退出.*/).visibleToUser(true).findOne(1000);
            if (okbtn) {click(okbtn.bounds());sleep(1000);}
        }
    }
    toastLog('回到首页gohome');
    closediv();
    var homepage = idMatches(/.*\/obfuscated/).text('视频').boundsInside(0, device.height-300, device.width, device.height).findOne(1000);
    if(!homepage){
        var MaxLoop = 5;
        while (!homepage && MaxLoop > 0) {
            MaxLoop--;
            back(); sleep(3000); closediv();
            homepage = idMatches(/.*\/obfuscated/).text('视频').boundsInside(0, device.height-300, device.width, device.height).findOne(1000);
        }
    }
    if(homepage){
        click(homepage.parent().bounds());
        sleep(3000);closediv();
    }else{
        toastLog('需要重启软件');
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
function isvideoPage() {
    console.verbose("检测是否视频播放中isvideoPage");
    var isvideo = false;
    var homepage = idMatches(/.*\/obfuscated/).text('视频').selected(true).boundsInside(0, device.height-300, device.width, device.height).findOne(1000);
    if (homepage) {
        //关闭自动弹出的层

        isvideo=idMatches(/.*video_flow_cmp_list/).visibleToUser(true).findOne(1000);

        //log(isvideo);
    }

    return isvideo;
}
function gogogo(n) {
    let gotime = random(15,20); //刷视频每n分钟结束一次
    for (var i = 1; i <= n; i++) {
        let flashtime=parseInt((Date.now() - startSec) / 1000);
        console.log('第'+i+'次刷视频，累计用时:',flashtime,'秒');
        if( flashtime > gotime*60){console.warn(gotime+'分种超时，停止刷视频'); running = false; floaty.closeAll(); break;}
        if (isvideoPage()) {
            running = true;
            var videoDuration=random(6, 30);
            cutDownBySleep(videoDuration,'观看视频:');//每个视频随机时间 6-30s
            randomHeart();//拟人化
        } else {
            running = false;
            toastLog('not at the video page');
            var dialog = currentActivity();
            if (!dialog.match(/android\.app\.Dialog|android\.widget\.FrameLayout|.*creenCaptureRequestActivity/)) {
                console.info('【gogogo】',dialog);
                gohome();
            }
            sleep(3000);
        }
    }
    running = false;
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
    //if(idMatches(/.*center/).text('请完成安全验证').visibleToUser(true).findOne(1000)){return;}
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
    if(randomIndex == 5) {
        var seekBar=className('android.widget.SeekBar').descMatches(/.*进度条.*/).findOne(1000);
        if(seekBar){
            let x1=random(90, 120);
            let y1=device.height/3;
            gestures([0, 1500, [x1,y1], [x1,y1]],[1400, 1500, [x1,y1], [1.1*x1, 2*y1]]);
            return;
        }
    }

    //随机收藏
    if (randomIndex == 7) {
        var comment = className('android.widget.RelativeLayout').longClickable(true).boundsInside(device.width-500, device.height/2, device.width, device.height).visibleToUser(true).findOne(1000);
        if (collect) {
            console.log('拟人:随机收藏');
            click(comment.bounds().centerX(),comment.bounds().centerY()+comment.bounds().height());
            sleep(3000);
            slidingByCurve();
            return;
        }
    }
    //随机评论
    if(randomIndex == 8) {
        var comment = className('android.widget.RelativeLayout').longClickable(true).boundsInside(device.width-500, device.height/2, device.width, device.height).visibleToUser(true).findOne(1000);
        if(comment){
            console.log('拟人:随机评论');
            //评论按钮
            click(comment.bounds());
            sleep(1000);
            var plugdiv=textMatches(/浅评一下/).boundsInside(0, device.height-500, device.width, device.height).visibleToUser(true).findOne(1000);
            if(plugdiv){
                //log(plugdiv.parent().child(plugdiv.indexInParent()+1));
                let node = plugdiv.parent().child(plugdiv.indexInParent()+1);
                let emoji = node.find(className('RelativeLayout'));
                if(emoji.length>0){
                    let icoY=plugdiv.bounds().centerY();
                    let icoX=[
                        emoji[0].bounds().centerX(),
                        emoji[1].bounds().centerX()
                    ];
                    let index = random(1, icoX.length)-1;
                    console.log(icoX[index],icoY);
                    click(icoX[index],icoY);
                    sleep(1000);
                    slidingByCurve();
                    return;
                }
            }
        }
    }
    //随机点赞
    if (randomIndex == 9) {
        var comment = className('android.widget.RelativeLayout').longClickable(true).boundsInside(device.width-500, device.height/2, device.width, device.height).visibleToUser(true).findOne(1000);
        if (comment) {
            console.log('拟人:随机点赞');
            click(comment.bounds().centerX(),comment.bounds().centerY()-comment.bounds().height());
            sleep(2000);
            slidingByCurve();
            return;
        }
    }
    //上滑
    slidingByCurve();
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
                let minutes = parseInt(parts[0], 10);
                let seconds = parseInt(parts[1], 10);
                return minutes * 60 + seconds;
            }
        }
    }
    return 0;
}
function percent(str){
    var strMatch = str.match(/[0-9]+\/[0-9]+/);
    if (strMatch) {
        var parts = strMatch[0].split("/");
        if (parts.length === 2) {
            let a = parseInt(parts[0], 10);
            let b = parseInt(parts[1], 10);
            return a == b;
        }
    }else{
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
    //if(idMatches(/.*center/).text('请完成安全验证').visibleToUser(true).findOne(1000)){log('正在完成安全验证');return;}
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
    var dx1 = {"x": random(qx - 100, qx + 100),"y": random(qy, qy + 50)};
    var dx2 = {"x": random(zx - 100, zx + 100),"y": random(zy, zy + 50)};
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
    result = {"x": 0,"y": 0};
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
function update(){
    http.get('https://update.greasyfork.org/scripts/523350/%E7%99%BE%E5%BA%A6%E8%84%9A%E6%9C%AC.js', {}, function(res, err){
        if(res.statusCode == 200){
            var Source = res.body.bytes();
            if(Source){
                files.writeBytes(files.getSdcardPath() + '/脚本/百度脚本.js', Source);
                console.verbose('更新主程序:成功',ver);
            }else{
                console.verbose('更新主程序:错误',ver);
            }
        }else{
            console.verbose('更新主程序:失败',ver);
        }
    });
}

//===================================================================================
requestScreenCapture(false);//请求截图权限
runtime.getImages().initOpenCvIfNeeded();//初始化OpenCv
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
                <button id="button" text="退出挂机" margin="0 20" />
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
            ui.run(() => { oledwin.texts.setText("息屏挂机倒计时:" + t + "\n\n倒计时结束后重启主线程baidu") });
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
    for (let c = 0; c < 30; c++) {//连续扫描60秒后返回结果，如果60秒停留在同一活动页面，则就要重启线程了
        //检测oled挂机模式结束，则重启main线程
        if (oledwin) { win = oledwin; return true; } else if (win) { win = null; return false; }
        currentActis[c] = currentActivity();
        //关闭自动弹出的层
        var btntxt = textMatches(/等待|忽略|同意|满意|关闭|关闭应用|不在提醒|我知道了|以后再说|暂不使用|忽略提醒|仍要退出|不感兴趣/).visibleToUser(true).findOne(1000);
        if (btntxt && btntxt.packageName() == packageName) {
            console.warn('点击:', btntxt.text());
            click(btntxt.bounds());
            sleep(1000);
        }
        // 验证账号重新登录
        var a = desc("未选中").visibleToUser(true).findOne(1000);
        if (a) {
            click(a.bounds());
            sleep(2000);
            click("一键登录");
        }
        sleep(1000);//这是每秒扫描一次活动页
    }
    //toastLog(currentActivity());
    let ac = unique(currentActis);
    let cc = currentActivity().match(/.*HomeActivity|.*PhotoDetailActivity|.*AwardVideoPlayActivity|.*AdKwaiRnActivity|.*app\.Dialog|android\.widget\.FrameLayout|.*ToastDialog|.*ScreenCaptureRequestActivity/);
    if (ac.length == 1 && !cc) {
        console.info('60秒卡顿:',ac[0]);
        //截图保存界面，以备后续查看
        captureScreen(files.getSdcardPath() + '/脚本/Observer2_' + currentActivity() + '.bmp');
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
        if(oledwin){if(oledwin.texts)console.verbose(oledwin.texts.getText().split("\n").shift());}
        if (running||oledwin) {
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
                console.hide();
                if(currentPackage() == packageName)closeApp(AppName);
                sleep(5000);
                Main();
            });
        }
    }, 3000);//这个时间是线程休息时间
});



