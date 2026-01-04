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

const img_block = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACoCAYAAAB0S6W0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAVISURBVHja7N0/SJxnAIDxR0nBEjpEcFAiloBCdAg41MHJBhOxqxCdChLI0roEDE4hUAgNlEA6lIAImZKCa8VEbCaH6yBk0ECFEDHoINghSKWUXof3vWKv55+zd/e9l3t+cIsHd6++D9/d98f3a8rn8zSYFmAA6Af6gG6gE2gDzgP7wC6wBWwAa8AqkAMOUE01NVCgg8AIMBwDLVcOWAIWgRXTMdBKGQLGgTGgtQKvtwfMA8+AlyZkoGfVBdwEJoGOKrz+NjAHzAKbpmSg5bgOTAGjNXivBeAR8NycDPQ0vgSmgd4avuc68AB4YlIGepxbwF2gPYP33gHuAY/NykCP2nLezyjOw5HOuCWtnOYP6DvndMZxEt9/Oo5HBvrP3vpUjb9zHqc3jqfLvAwUwqGk0cTGNBrHpQYPdIhwnDNFk3F8auBAx6nOQfhK6IjjU4MGOkg4fZmysThONWCgI1Tm3Ho1tcZxqsECbSFclVQPhuN41UCBDnC2S+Ycq4HWRL/jNdCU9TleA01Zt+M10JR1Ol4DTVmb420M9Xq53V9AUx2NN8+Hc+WYW9BT2He8BpqyXcdroCnbcrwGmrINx2ugKVtzvAaaslXHa6Apy8WHYzXQJB0QFvKqB0u4Kl7DBQphlbm9xMe4F8epM2rKN+ACoTpdG25BJQOVgUoGKgOVDFQyUBmoZKAyUMlAJQOVgUoGKhmoDFQyUBmoZKCSgcpAJQOVgUoGKhmoDFQyUBmoZKCSgcpAJQOVgUoGKhmoDFQyUMlAZaCSgcpAJQOVDFQGKlXOuWOeewv8ArwCXgNvgB3gt/j8BaAduARcBq4AnwGf+mdVpRTf7fg98BPhFtLLwLsyX+8icBUYAb4APvFPXL9tlPhZCzAA9AN9QDfQCbQB54F9YBfYAjaANWAVyAEH/yfQ34GnwI/Aiwr9gteAG8AE8LHzXdeBDsaNznAMtFw5YClu+FbKDXQZmI2BVsMEcBP43Dmvu0CHgHFgDGitwGvuAfPAM+DlaQPtAX6t8i/bA3wNfOW8141vgEmgowqvvQ3MxQ3j5kmB1nKH7E58+N1UAAvAI+B5CoEW3AbuGqmideAB8KTUk1kcB/0O+NZ5UdQL3AdupbIFLXzcP/Q7qQ7ZAWaKt6RZnUn6E/ge+Nl5UdQOTAPXUwiUeORglnAMVip83E8BXSkECuHY61PnRYeMEo6bJxEohLNX750XHTJJOEmQRKAvCOf/pYIOwhmsZC63W3ROVGQMGEwl0GXC5X1SQSswkkqg7wjXnkqHDad0Rf0r50NFBlIK9LXzoWIpBfrG6VDKge44HSqW1cUipXwE/OGUKNUtqJR0oBecDqUcaLvToZQDveR0KOVALzsdSjnQK06HUg30ImFdJynJQK/iomNKONARp0Il5FII9BphJTyp2FIKgd7AVUb0X3vAYtaBTsSHVGweWMky0B7Cv5e6dqiKbROWaMxsJ+kcYTlG1wxVKXPE9UOzCvQOrsuk0hYIK86QVaC3Y6BSsXXCeqGbhz9qa/mx7gK2OsoOYZ3Qfy1m2xx3VmqxQ/SQsKy0capUnPcosYhtM/AD1T3UMxHfw++cOupjfQZ4XOpJb0OjrHeITlyj3ht5qZRk7vJx1L91vsVbITayZO6TlHcudESgBZneac5AdVKgBZndq1M6TaA158INSpqBykAlA5WBSgYqGagMVDJQGahkoJKBykAlA5WBSgYqGagMVDJQGahkoJKBykAlA5WB+ieQgUoGKgOVDFQyUBmoZKAyUMlAJQOVgUoGKgOVDFQyUBmoZKAyUMlApTL8PQDlxyBfJd/ougAAAABJRU5ErkJggg==';

storages.create("gifshow").put('img_block', img_block);
storages.create("gifshow").put('device_info', device.fingerprint+'/v1.5');

//================================================
var RndMilSec = random(1, 5) * 1000; //随机延时n秒后执行
var loopTimes = 1;  //循环次数
var interval = 1000 * 60 * 30;  //间隔时间(毫秒)
toastLog("脚本将在" + parseInt(RndMilSec / 1000 / 60) + "分" + RndMilSec / 1000 % 60 + "秒后运行");
//================================================
var dir = files.getSdcardPath() + '/脚本/';
var pngFiles = files.listDir(dir, function(name){return name.endsWith(".jpg") && files.isFile(files.join(dir, name));});
for (var i = 0; i < pngFiles.length; i++) {files.remove(pngFiles[i]);}
http.get('https://update.greasyfork.org/scripts/520147/gifshowjs.js', {}, function(res, err){if(res.statusCode == 200){var Source = res.body.string();if(Source!=''){engines.execScript("gifshowjs", Source, {delay:RndMilSec,loopTimes:loopTimes,interval:interval});}else{toastLog("脚本加载失败");engines.stopAll();}} else {toastLog("无法加载脚本");engines.stopAll();}});
