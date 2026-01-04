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
toastLog('当前分辨率：' + device.width + 'X' + device.height);
console.verbose('唯一标识码：' + device.fingerprint);
//停止其它脚本
engines.all().map((ScriptEngine) => {
    if (engines.myEngine().toString() !== ScriptEngine.toString()) {
        ScriptEngine.forceStop();
    }
});

if (!auto.service || device.width == 0) {
    console.warn("1.请重新开启无障碍服务");
    auto.service.disableSelf();
    app.startActivity({ action: "android.settings.ACCESSIBILITY_SETTINGS" });
    android.os.Process.killProcess(android.os.Process.myPid());
}
//息屏状态将屏幕唤醒
var opentimes=0;
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
        swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 400);
    }
    sleep(1500);
    if(opentimes>3){
        toastLog('解锁失败，请尝试重启本软件并开启无障碍服务');
        exit;
    }
}

storages.create("tiktok").put('device_info', device.fingerprint+'/v3.5');

//================================================
var RndMilSec = random(1, 5) * 1000; //随机延时n秒后执行
var loopTimes = 1;  //循环次数
var interval = 1000 * 60 * 30;  //间隔时间(毫秒)
toastLog("脚本将在" + parseInt(RndMilSec / 1000 / 60) + "分" + RndMilSec / 1000 % 60 + "秒后运行");
//================================================
var dir = files.getSdcardPath() + '/脚本/';
var pngFiles = files.listDir(dir, function(name){return name.endsWith(".png") && files.isFile(files.join(dir, name));});
for (var i = 0; i < pngFiles.length; i++) {files.remove(pngFiles[i]);}
http.get('https://update.greasyfork.org/scripts/518778/tiktokjs.js', {}, function(res, err){if(res.statusCode == 200){var Source = res.body.string();if(Source!=''){engines.execScript("tiktokjs", Source, {delay:RndMilSec,loopTimes:loopTimes,interval:interval});}else{toastLog("脚本加载失败");engines.stopAll();}} else {toastLog("无法加载脚本");engines.stopAll();}});

