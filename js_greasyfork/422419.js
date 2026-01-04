// ==UserScript==
// @name         KRHanhua
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Translate krunker.io into Chinese.克鲁克汉化js脚本。好耶！
// @author       DD
// @match        https://krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422419/KRHanhua.user.js
// @updateURL https://update.greasyfork.org/scripts/422419/KRHanhua.meta.js
// ==/UserScript==


(function() {
  'use strict';


  //设置二级分类，三维数组，1:设置页;2:元素;3:正则表达式与中文.
  var setTaghed = [
    [
      ['/(.*)Localization(.*)requires restart(.*)/s','$1本地化$2需要重启$3'],
      ['/Network/','网络'],
      ['/Server Browser/','服务器浏览'],
      ['/Popups/','弹窗'],
      ['/Experimental/','实验性'],
    ],[
      ['/Gameplay/','键盘'],
      ['/Controller/','手柄'],
    ],[
      ['/Interface/','UI'],
      ['/Chat/','聊天'],
      ['/Crosshair/','准星'],
      ['/Hitmarker/','判定点'],
    ],[
      ['/Performance/','显示'],
      ['/Post Processing/','后处理'],
      ['/Editing/','编辑'],
    ],[
      ['/Gameplay Privacy/','游玩隐私'],
      ['/View Model/','模型显示'],
      ['/Customization/','自定义'],
    ],[
      ['/Audio/','音频'],
    ]
  ]
  //设置名，三维数组，1:设置页;2:元素;3:正则表达式与中文.
  var setTagName = [
    [
      //['/(.*)Backup Settings(.*)Upload(.*)Download(.*)/s','$1后台设置$2下载$3上传$4'],
      ['/(.*)Default Region(.*)Frankfurt(.*)Silicon Valley(.*)Sydney(.*)Tokyo(.*)Miami(.*)Singapore(.*)New York(.*)India(.*)Dallas(.*)Brazil(.*)Middle East(.*)South Africa(.*)South Korea(.*)/s','$1默认区服$2法兰克福$3硅谷$4悉尼$5东京$6迈阿密$7新加坡$8纽约$9印度$10达拉斯$11巴西$12中东$13南非$14韩国$15'],
      ['/(.*)Language(.*)English(.*)Spanish(.*)German(.*)Korean(.*)Portuguese(.*)Japanese(.*)/s','$1语言$2英语$3西班牙语$4德语$5韩语$6葡萄牙语$7日语$8'],
      ['/Lag Compensation/','滞后补偿'],
      ['/Auto Routing \([^\)]*\)/','自动路由（影响Ping）'],
      ['/High Tickrate/','高刷新率'],
      ['/Legacy Browser/','旧版浏览器'],
      ['/Default Region Only/','仅默认区服'],
      ['/Show Free KR Popup/','显示免费KR弹窗'],
      ['/Mouse Flick Fix/','鼠标甩动修正'],
      ['/Mouse Flick Fix undefined/','鼠标甩动修正未定义'],
      ['/Aim Freeze Fix/','瞄准卡顿修正'],
      ['/Instance Rendering/','实例渲染'],
    ],[
      ['/(.*)Keybinds(.*)Edit(.*)/s','$1按键绑定$2编辑$3'],
      ['/X Sensitivity/','X灵敏度'],
      ['/Y Sensitivity/','Y灵敏度'],
      ['/Aim X Sensitivity/','瞄准X灵敏度'],
      ['/Aim Y Sensitivity/','瞄准Y灵敏度'],
      ['/Scroll Direction/','滚轮方向'],
      ['/Challenge Mode/','挑战模式'],
      ['/Invert Y-Axis/','Y轴反转'],
      ['/Disable Controllers/','禁用手柄'],
      ['/X Sensitivity/','X灵敏度'],
      ['/Y Sensitivity/','Y灵敏度'],
      ['/Aim X Sensitivity/','瞄准X灵敏度'],
      ['/Aim Y Sensitivity/','瞄准Y灵敏度'],
      ['/Dead Zone \([^\)]*\)/','死区（左）'],
      ['/Dead Zone \([^\)]*\)/','死区（右）'],
      ['/Trigger Threshold/','触发阈值'],
      ['/Invert Y-Axis/','Y轴反转'],
      ['/Vibration/','震动'],
      ['/Gradual Speed/','渐进速度'],
    ],[
      ['/UI Scale/','UI大小'],
      ['/UI Scale undefined/','UI大小未定义'],
      ['/Show UI/','显示UI'],
      ['/Use Old Scoreboard/','使用旧版记分板'],
      ['/Disable Rarity Animations/','禁用Rarity动画'],
      ['/Show Profile Pictures/','显示头像'],
      ['/Dynamic HP Bars/','动态HP栏'],
      ['/Show Hit Indicators/','显示命中标识'],
      ['/Hit Indicator Color/','命中标识颜色'],
      ['/Show Damage/','显示伤害'],
      ['/Damage Color/','伤害颜色'],
      ['/Crit Color/','暴击颜色'],
      ['/Damage Scale/','伤害显示大小'],
      ['/Show Kill Feed/','显示KillFeed'],
      ['/Show Kill Counter/','显示击杀数'],
      ['/Show Death Counter/','显示死亡数'],
      ['/(.*)Show (.*) Counter(.*)/s','$1显示$2比$3'],
      ['/Show Score Counter/','显示分数'],
      ['/Show Streak Counter/','显示连续击杀数'],
      ['/Show Ping/','显示Ping'],
      ['/Show Network Stats/','显示网络状态'],
      ['/Show FPS/','显示FPS'],
      ['/Show Movement Speed/','显示移动速度'],
      ['/Speed X Offset/','速度显示X偏移'],
      ['/Speed Y Offset/','速度显示Y偏移'],
      ['/Speed Scale/','速度显示大小'],
      ['/Speed Opacity/','速度显示不透明度'],
      ['/Speed Color \([^\)]*\)/','速度显示颜色（一般）'],
      ['/Speed Color \([^\)]*\)/','速度控件颜色（Max）'],
      ['/Show Medals/','显示奖励'],
      ['/(.*)Nametag Display(.*)Everyone(.*)Team Only(.*)Enemy Only(.*)Off(.*)/s','$1名签显示$2所有人$3仅队友$4仅敌人$5关闭$6'],
      ['/Nametag Opacity/','名签不透明度'],
      ['/(.*)Nametag Style(.*)Everything(.*)Name Only(.*)Name &amp; Level Only(.*)Health Only(.*)/s','$1名签格式$2全部$3仅名字$4仅名字和等级$5仅血量$6'],
      ['/Nametag Health Number/','血量数'],
      ['/Nametag Health Color Team/','队友血条颜色'],
      ['/Nametag Health Color Enemy/','敌人血条颜色'],
      ['/XP Bar Color/','XP栏颜色'],
      ['/XP Bar Opacity/','XP栏透明度'],

      ['/(.*)Show Chat Box(.*)Always(.*)While Focused(.*)Off(.*)/s','$1显示聊天框$2总是$3仅获得焦点时$4关闭$5'],
      ['/Profanity Filter/','芬芳过滤器'],
      ['/Show Player/','显示玩家消息'],
      ['/Show Unboxings/','显示开箱'],
      ['/Chat Opacity/','聊天不透明度'],
      ['/Chat BG Opacity/','聊天背景不透明度'],
      ['/Chat Text Outline/','聊天文本轮廓'],
      ['/Chat Height/','聊天高度'],
      ['/Chat Timer/','聊天计时器（s）'],

      ['/(.*)Type(.*)Off(.*)Default(.*)Custom(.*)Layered(.*)Image(.*)Precision(.*)/s','$1类型$2关闭$3默认$4自定义$5分层$6图片$7精细$8'],
      ['/(.*)Style(.*)Cross(.*)Hollow Circle(.*)Solid Circle(.*)Hollow Square(.*)Solid Square(.*)/s','$1风格$2十字形$3空心圆$4实心圆$5空心方$6实心方$7'],
      ['/Image/','图像'],
      ['/Custom Opacity/','自定义不透明度'],
      ['/Use Custom Opacity undefined/','使用自定义不透明度未定义'],
      ['/Always Show/','总是显示'],
      ['/Color/','颜色'],
      ['/Shadow Color/','阴影颜色'],
      ['/Shadow Thickness/','阴影厚度'],
      ['/Thickness/','厚度'],
      ['/Size/','大小'],
      ['/Gap/','间隙'],
      ['/Dot/','点'],

      ['/Show/','显示'],
      ['/Color/','颜色'],
      ['/Kill Color/','击杀颜色'],
      ['/Opacity/','不透明度'],
      ['/Length/','长度'],
      ['/Thickness/','厚度'],
      ['/Spacing/','间距'],
      ['/Anim Size/','动画大小'],
      ['/Anim Speed/','动画速度'],
      ['/Fade Speed/','消失速度'],
      ['/Hitmarker Image/','Hitmarker图像'],
    ],[
      ['/Resolution/','分辨率'],
      ['/Frame Cap/','Frame cap（？）'],
      ['/(.*)Aspect Ratio(.*)Presets(.*)Native(.*)/s','$1长宽比$2预设$3本地$4'],
      ['/Antialiasing/','抗锯齿'],
      ['/Low Spec/','低配模式'],
      ['/No Textures/','无纹理'],
      ['/Map Details/','地图细节'],
      ['/Particles/','粒子效果'],
      ['/Particle Distance/','粒子距离'],
      ['/Render Distance/','渲染距离'],
      ['/(.*)Reflection Quality(.*)Map Dependent(.*)/s','$1反射质量$2跟随地图$3'],
      ['/Shadows/','阴影'],
      ['/Soft Shadows/','软阴影'],
      ['/High-Res/','高分辨率阴影'],
      ['/Dynamic Shadows/','动态阴影'],
      ['/Ambient Shading/','环境光着色'],
      ['/Old Shading/','旧版着色'],
      ['/Bullet Trails/','子弹轨迹'],
      ['/Your Trails/','你的轨迹'],
      ['/Muzzle Flash/','枪口闪光'],
      ['/Sniper Flap/','sniper flap（？）'],
      ['/Texture Animations/','纹理动画'],
      ['/Object Animations/','物体动画'],
      ['/Screen Shake/','屏幕抖动'],
      ['/Weapons Shine/','武器发光'],
      ['/(.*)Lighting(.*)Low(.*)Normal(.*)High(.*)/s','$1光照$2低$3中$4高$5'],
      ['/Show Explosions/','显示爆炸'],

      ['/Post Processing/','后处理'],
      ['/Bloom/','Bloom'],
      ['/Bloom Threshold/','Bloom阈值'],
      ['/Bloom Strength/','Bloom强度'],
      ['/Bloom Radius/','Bloom半径'],
      ['/SSAO/','SSAO'],
      ['/SSAO Radius/','SSAO半径'],

      ['/HUD Health High/','血量高HUD颜色'],
      ['/HUD Health Low/','血量低HUD颜色'],
      ['/Speed Lines/','速度线'],
      ['/Speed Lines Color/','速度线颜色'],
      ['/Show Popup Score/','显示弹出得分'],
      ['/Popup Score Color/','弹出得分颜色'],
      ['/Popup Score Shadow/','弹出得分阴影'],
      ['/Popup Score Scale/','弹出得分大小'],
      ['/Popup Score X Offset/','弹出得分X偏移'],
      ['/Popup Score Y Offset/','弹出得分Y偏移'],
      ['/Progress Bar Color/','进度条颜色'],
      ['/Progress Bar Opacity/','进度条不透明度'],
      ['/Progress Bar Shadow/','进度条阴影'],
      ['/Progress Bar Scale/','进度条大小'],
      ['/Progress Bar X Offset/','进度条X偏移'],
      ['/Progress Bar Y Offset/','进度条Y偏移'],
      ['/Progress Bar Rotation/','进度条角度'],
      ['/Saturation \([^\)]*\)/','画面饱和度（游戏中）'],
      ['/Saturation \([^\)]*\)/','画面饱和度（UI）'],
      ['/Color Hue \([^\)]*\)/','画面色调（游戏）'],
      ['/Color Hue \([^\)]*\)/','画面色调（UI）'],
      ['/Vignette/','Vignette（？）'],
      ['/Killfeed Limit/','Killfeed限制'],
      ['/Bullet Tracers undefined/','子弹示踪未定义'],
      ['/Bullet Tracers/','子弹示踪'],
      ['/Tracer Offset/','示踪偏移'],
    ],[
      ['/Streamer Mode/','主播模式'],
      ['/Anonymous Mode/','匿名模式'],
      ['/Hide Game Title/','隐藏游戏标题'],

      ['/Field of View/','视场'],
      ['/Weapon FOV/','武器视场'],
      ['/Weapon Bobbing/','武器颠簸'],
      ['/Weapon Leaning/','武器摇摆'],
      ['/Weapon Rotation/','武器角度'],
      ['/Weapon X Offset/','武器X偏移'],
      ['/Weapon Y Offset/','武器Y偏移'],
      ['/Weapon Z Offset/','武器Z偏移'],
      ['/Weapon ADS Y Offset/','武器开镜Y偏移'],
      ['/Weapon Swap Y/','武器更换Y位置'],
      ['/Weapon Reload Y/','武器装填Y位置'],
      ['/Left Handed/','左手持枪'],
      ['/ADS FOV Power/','ADS FOV power（？）'],
      ['/Weapon Aim Animation/','武器瞄准动画'],
      ['/Hide Weapon on ADS/','开镜隐藏武器'],
      ['/Show Hands/','显示双手'],
      ['/Show Primary/','显示主武器'],
      ['/Show Secondary/','显示副武器'],
      ['/Show Melee/','显示近战武器'],
      ['/Rounded Arms/','Rounded Arms（？）'],

      ['/Load Mods/','加载Mod'],
      ['/Allow Logo Changes/','允许Logo变换'],
      ['/Auto-Load Mod/','自动加载Mod'],
      ['/Scope Borders/','镜筒遮罩颜色'],
      ['/Scope Borders undefined/','镜筒遮罩未定义'],
      ['/Scope Borders Opacity/','镜筒遮罩不透明度'],
      ['/Scope Image Width/','镜筒图像宽度'],
      ['/Scope Image Height/','镜筒图像高度'],
      ['/Scope Opacity/','镜筒不透明度'],
      ['/Reticle Image Width/','十字线图像宽度（？）'],
      ['/Reticle Image Height/','十字线图像高度（？）'],
      ['/Match End Message/','对局结束自动回复'],
      ['/Ammo Icon Image/','子弹图标图像'],
      ['/Kills Icon Image/','击杀图标图像'],
      ['/Deaths Icon Image/','死亡图标形象'],
      ['/Streak Counter Icon Image/','连续击杀计数器图标图像'],
      ['/Use Damage Overlay/','使用伤害覆盖'],
      ['/Damage Overlay Image/','伤害覆盖图像'],
      ['/Timer Icon Image/','计时器覆盖图像'],
      ['/Game Overlay Image/','游戏覆盖图像'],
    ],[
      ['/Master Volume/','主音量'],
      ['/Ambient Volume/','环境音量'],
      ['/Action Volume/','动作音量'],
      ['/Voice Volume/','语音音量'],
      ['/Weapon Volume/','武器音量'],
      ['/Player Volume/','玩家音量'],
      ['/Cosmetics Volume/','Cosmetics音量（？）'],
      ['/UI Volume/','UI音量'],
      ['/Asset Volume/','资产音量（？）'],
    ]
  ]


  //base fuction
  function walkList(list, doFor) {
    for(var i in list){
      doFor(list, i)
    }
  }
  function classname(classname) {
    return document.getElementsByClassName(classname)
  }
  function replace(i, name, a, b) {
    classname(name)[i].innerHTML = classname(name)[i].innerHTML.replace(eval(a), b)
  }
  function id(id) {
    return document.getElementById(id)
  }


  //汉化菜单
  var Menu = ["账号","商店","挑战","中心","游戏","Mod","设置","退出"]
  walkList(Menu, (list, i)=>{
    classname('menuItemTitle')[i].innerHTML = list[i]
    classname('menuItemTitle')[i].style.cssText = 'font-size:20px;'
  })


  //修改菜单单击事件绑定汉化面板函数
  var openWindow = [5,14,33,0,10,4,1]
  var changeWindow = [] //汉化面板函数列表
  walkList(openWindow, (list, i)=>{
    classname('menuItem')[i].onclick = ()=>{
      showWindow(list[i])
      changeWindow[i]
    }
  })


  //每秒检测一遍设置页
  var setTag = ['General', 'Controls', 'Display', 'Render', 'Game', 'Sound']
  var oldSetTag = ''
  var newSetTag = ''
  var setTagIndex = -1


  setInterval(()=>{
    newSetTag = classname('settingTab tabANew')[0].innerText
    setTagIndex = setTag.indexOf(newSetTag)

    if( newSetTag != oldSetTag && setTagIndex >= 0 ) {

      //改setHed设置二级分类
      walkList(setTaghed[setTagIndex], (list, i)=>{
        replace(i, 'setHed',list[i][0], list[i][1])
      })

      //改settName设置名
      walkList(setTagName[setTagIndex], (list, i)=>{
        replace(i, 'settName',list[i][0], list[i][1])
      })
    }
    oldSetTag = newSetTag
  }, 200)

})();