// ==UserScript==
// @name         AAAAA
// @namespace    http://www.Tikas.me/
// @version      0.30
// @description  A wiki is run using wiki software, otherwise known as a wiki engine.
// @author       Tikas
// @match        *://test.baidu.com/mark/task/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373726/AAAAA.user.js
// @updateURL https://update.greasyfork.org/scripts/373726/AAAAA.meta.js
// ==/UserScript==

/*
-----------使用说明-----------
一、请把 'null' 里的 null 换成键码（第二条有对应参考）即可！
二、键码对应参考（只是常用部分，详细请问网络）：
----字母部分，字母不分大小写----
  a   b   c   d   e   f   g   h   i   j   k   l   m   n   o   p   q   r   s   t   u   v   w   x   y   z
 65  66  67  68  69  70  71  72  73  74  75  76  77  78  79  80  81  82  83  84  85  86  87  88  89  90
三、夜间自动亮度：
默认按 F10 键开启，再按 F10 关闭，记得切换白天时，要关闭哦！
四、行人-成人-站立角度已经默认设置到小键盘 和对应按键：
315   0    45   =   7   8   9
   ↖ ↑ ↗         ↖ ↑ ↗
270←遮挡→90   =   4← 5 →6
   ↙ ↓ ↘         ↙ ↓ ↘
225  180  135   =   1   2   3
小键盘数字键 0 为人略
*/
(function() {
	'use strict';
	//setting keycode 开始设置启动键   ----设置为 0 则删除旧键码!----
	var iX_LiangZuo = null;//小汽车-2座微型车
	var iX_LiangXiang = 0;//小汽车-两厢车
	var iX_SanXiang = null;//小汽车-三厢车
	var iX_PaoChe = null;//小汽车-跑车
	var iX_XiaoSUV = null;//小汽车-小型SUV
	var iX_ZDSUV = null;//小汽车-中大型SUV
	var iX_PiKa = null;//小汽车-皮卡
	//我是分隔线
	var iH_XiaoHuoChe = null;//卡车货车-小货车
	var iH_DaHuoChe = null;//卡车货车-大货车
	//我是分隔线
	var iM_WeiMian = null;//面包车-微面
	var iM_ShangWuChe = null;//面包车-商务车
	var iM_QingKeChe = null;//面包车-轻型客车
	//我是分隔线
	var iD_XiaoBaShi = null;//大客车-小型巴士
	var iD_DanCengBaShi = null;//大客车-单层大巴车
	var iD_ShuangCengBaShi = null;//大客车-双层大巴车
	var iD_DuoJieBaShi = null;//大客车-多节大巴车
	//我是分隔线
	var iR_CRZhan = null;//行人-成人-站立
	var iR_CRZuo = null;//行人-成人-坐姿
	var iR_CRDun = null;//行人-成人-蹲姿/弯腰
	var iR_ETZhan = null;//行人-儿童-站立
	var iR_ETZuo = null;//行人-儿童-坐姿
	var iR_ETDun = null;//行人-儿童-蹲姿/弯腰
	//我是分隔线
	var iZ_ZiXingChe = 115;//自行车
	//我是分隔线
	var iS_DaSanLunChe = null;//三轮车-大型机动三轮车
	var iS_XiangSanLunChe = null;//三轮车-厢式三轮车
	var iS_PuTongSanLunChe = 54;//三轮车-普通人力/助力车
	//我是分隔线
	var iQ_MoTuo = null;//摩托车/电动车
	var iQ_ShouTuiChe = null;//手推车
	var iQ_RenLue = null;//人略
	var iQ_CheLue = 67;//车略
	var iQ_QiTaLue = 90;//其他略
	var iQ_JiaoTongZhuiTong = null;//交通锥筒
	var iQ_HunHe = null;//混合
	var iQ_WeiZhi = null;//未知
	//我是分隔线
	var iF_ZuoTou = null;//车身分割-左车头
	var iF_YouTou = null;//车身分割-右车头
	var iF_ZuoWei = null;//车身分割-左车尾
	var iF_YouWei = null;//车身分割-右车尾
	//我是分隔线
	var iZ_QianZhu = null;//前向主障碍物
	var iZ_ZuoZhu = 0;//左侧主障碍物
	var iZ_YouZhu = 119;//右侧主障碍物
	//更改上面 null 设置对应按键键码 即可保存配置   ----设置为 0 则删除旧键码!----
	//
	var iBackground = null;//背景颜色代码，建议使用333333、454545、565656、777777，默认454545，越大越亮，灰色护眼。
	if (localStorage.getItem('Background') == null && iBackground == null){
		iBackground = 454545;
		localStorage.setItem('Background',iBackground);
		} else if (iBackground>0){
			localStorage.setItem('Background',iBackground);
		} else if (localStorage.getItem('Background') !== null && iBackground == null){
			iBackground = parseInt(localStorage.getItem('Background'));
	}
    var iLiangDu = parseInt(localStorage.getItem('LiangDu'));
	function conifg(n,k){
		if (n == null){
			n = parseInt(localStorage.getItem(k));
        } else if (n === 0){
			localStorage.removeItem(k);
        } else {
			localStorage.setItem(k,n);
		}
        return(n);
	}
	function autoLiangDu(time){
        var autoTime = 0;
        if(time == null){
            autoTime=1000;
        }else{
            autoTime=time;
        }
    	setTimeout(function () {
			if(iLiangDu==1){
				$('canvas').css({'webkit-filter': 'brightness(' + 1.6 + ')'});
			}else{
				$('canvas').css({'webkit-filter': 'brightness(' + 1 + ')'});
			}
		}, autoTime);
    }
    function keyconifg(a,b,c,d){
		$(".mark-rect-config-content input[type='radio']")[a].click();
        $(".rect-type input[type='radio']")[b].click();
		$(".rect-sub_type input[type='radio']")[c].click();
		$(".rect-location input[type='radio']")[0].click();
		$(".rect-sp_vehicle input[type='radio']")[0].click();
		if(d>0){$(".rect-angle input[type='radio']")[d].click();}
    }
	function keyfenge(a,b,c){
		$(".mark-rect-config-content input[type='radio']")[a].click();
        $(".segmentRect-type input[type='radio']")[b].click();
		$(".segmentRect-sub_type input[type='radio']")[c].click();
    }
	iX_LiangZuo=conifg(iX_LiangZuo,'iX_LiangZuo');
	iX_LiangXiang=conifg(iX_LiangXiang,'iX_LiangXiang');
	iX_SanXiang=conifg(iX_SanXiang,'iX_SanXiang');
	iX_PaoChe=conifg(iX_PaoChe,'iX_PaoChe');
	iX_XiaoSUV=conifg(iX_XiaoSUV,'iX_XiaoSUV');
	iX_ZDSUV=conifg(iX_ZDSUV,'iX_ZDSUV');
	iX_PiKa=conifg(iX_PiKa,'iX_PiKa');
	iH_XiaoHuoChe=conifg(iH_XiaoHuoChe,'iH_XiaoHuoChe');
	iH_DaHuoChe=conifg(iH_DaHuoChe,'MoTuoChe');
	iM_WeiMian=conifg(iM_WeiMian,'iM_WeiMian');
	iM_ShangWuChe=conifg(iM_ShangWuChe,'iM_ShangWuChe');
	iM_QingKeChe=conifg(iM_QingKeChe,'iM_QingKeChe');
	iD_XiaoBaShi=conifg(iD_XiaoBaShi,'iD_XiaoBaShi');
	iD_DanCengBaShi=conifg(iD_DanCengBaShi,'iD_DanCengBaShi');
	iD_ShuangCengBaShi=conifg(iD_ShuangCengBaShi,'iD_ShuangCengBaShi');
	iD_DuoJieBaShi=conifg(iD_DuoJieBaShi,'iD_DuoJieBaShi');
	iR_CRZhan=conifg(iR_CRZhan,'iR_CRZhan');
	iR_CRZuo=conifg(iR_CRZuo,'iR_CRZuo');
	iR_CRDun=conifg(iR_CRDun,'iR_CRDun');
	iR_ETZhan=conifg(iR_ETZhan,'iR_ETZhan');
	iR_ETZuo=conifg(iR_ETZuo,'iR_ETZuo');
	iR_ETDun=conifg(iR_ETDun,'iR_ETDun');
	iZ_ZiXingChe=conifg(iZ_ZiXingChe,'iZ_ZiXingChe');
	iS_DaSanLunChe=conifg(iS_DaSanLunChe,'iS_DaSanLunChe');
	iS_XiangSanLunChe=conifg(iS_XiangSanLunChe,'iS_XiangSanLunChe');
	iS_PuTongSanLunChe=conifg(iS_PuTongSanLunChe,'iS_PuTongSanLunChe');
	iQ_MoTuo=conifg(iQ_MoTuo,'iQ_MoTuo');
	iQ_ShouTuiChe=conifg(iQ_ShouTuiChe,'iQ_ShouTuiChe');
	iQ_RenLue=conifg(iQ_RenLue,'iQ_RenLue');
	iQ_CheLue=conifg(iQ_CheLue,'iQ_CheLue');
	iQ_QiTaLue=conifg(iQ_QiTaLue,'iQ_QiTaLue');
	iQ_JiaoTongZhuiTong=conifg(iQ_JiaoTongZhuiTong,'iQ_JiaoTongZhuiTong');
	iQ_HunHe=conifg(iQ_HunHe,'iQ_HunHe');
	iQ_WeiZhi=conifg(iQ_WeiZhi,'iQ_WeiZhi');
	iF_ZuoTou=conifg(iF_ZuoTou,'iF_ZuoTou');
	iF_YouTou=conifg(iF_YouTou,'iF_YouTou');
	iF_ZuoWei=conifg(iF_ZuoWei,'iF_ZuoWei');
	iF_YouWei=conifg(iF_YouWei,'iF_YouWei');
	iZ_QianZhu=conifg(iZ_QianZhu,'iZ_QianZhu');
	iZ_ZuoZhu=conifg(iZ_ZuoZhu,'iZ_ZuoZhu');
	iZ_YouZhu=conifg(iZ_YouZhu,'iZ_YouZhu');
    document.onkeydown = hotkey;
    function hotkey(event)
    {
		if(event.altKey || event.ctrlKey || event.shiftKey) return;
		switch (event.keyCode) {
        case iX_LiangZuo:
                keyconifg(0,0,0,0);
			break;
		case iX_LiangXiang:
                keyconifg(0,0,1,0);
			break;
        case iX_SanXiang:
                keyconifg(0,0,2,0);
			break;
        case iX_PaoChe:
                keyconifg(0,0,3,0);
			break;
        case iX_XiaoSUV:
                keyconifg(0,0,4,0);
			break;
        case iX_ZDSUV:
                keyconifg(0,0,5,0);
			break;
        case iX_PiKa:
                keyconifg(0,0,24,0);
			break;
        case iH_XiaoHuoChe:
                keyconifg(0,1,6,0);
			break;
        case iH_DaHuoChe:
                keyconifg(0,1,7,0);
			break;
        case iM_WeiMian:
                keyconifg(0,2,8,0);
			break;
        case iM_ShangWuChe:
                keyconifg(0,2,9,0);
			break;
        case iM_QingKeChe:
                keyconifg(0,2,10,0);
			break;
        case iD_XiaoBaShi:
                keyconifg(0,3,11,0);
			break;
        case iD_DanCengBaShi:
                keyconifg(0,3,12,0);
			break;
		case iD_ShuangCengBaShi:
                keyconifg(0,3,13,0);
			break;
		case iD_DuoJieBaShi:
                keyconifg(0,3,14,0);
			break;
		case iR_CRZhan:
                keyconifg(0,4,15,0);
			break;
		case iR_CRZuo:
                keyconifg(0,4,16,0);
			break;
		case iR_CRDun:
                keyconifg(0,4,17,0);
			break;
		case iR_ETZhan:
                keyconifg(0,4,18,0);
			break;
		case iR_ETZuo:
                keyconifg(0,4,19,0);
			break;
		case iR_ETDun:
                keyconifg(0,4,20,0);
			break;
		case iZ_ZiXingChe:
                keyconifg(0,5,25,0);
			break;
		case iS_DaSanLunChe:
                keyconifg(0,6,21,0);
			break;
		case iS_XiangSanLunChe:
                keyconifg(0,6,22,0);
			break;
		case iS_PuTongSanLunChe:
                keyconifg(0,6,23,0);
			break;
		case iQ_MoTuo:
                keyconifg(0,7,25,0);
			break;
		case iQ_ShouTuiChe:
                keyconifg(0,8,25,0);
			break;
		case iQ_RenLue:
                keyconifg(0,9,25,0);
			break;
		case iQ_CheLue:
                keyconifg(0,10,25,0);
			break;
		case iQ_QiTaLue:
                keyconifg(0,11,25,0);
			break;
		case iQ_JiaoTongZhuiTong:
                keyconifg(0,12,25,0);
			break;
		case iQ_HunHe:
                keyconifg(0,13,25,0);
			break;
		case iQ_WeiZhi:
                keyconifg(0,14,25,0);
			break;
		case iF_ZuoTou:
                keyfenge(1,0,0);
			break;
		case iF_YouTou:
                keyfenge(1,0,1);
			break;
		case iF_ZuoWei:
                keyfenge(1,1,0);
			break;
		case iF_YouWei:
                keyfenge(1,1,1);
			break;
		case iZ_QianZhu:
                $(".rect-location input[type='radio']")[1].click();
			break;
		case iZ_ZuoZhu:
                $(".rect-location input[type='radio']")[3].click();
			break;
		case iZ_YouZhu:
                $(".rect-location input[type='radio']")[2].click();
			break;
		case 104:
                keyconifg(0,4,15,0);
			break;
		case 105:
                keyconifg(0,4,15,1);
			break;
		case 102:
                keyconifg(0,4,15,2);
			break;
		case 99:
                keyconifg(0,4,15,3);
			break;
		case 98:
                keyconifg(0,4,15,4);
			break;
		case 97:
                keyconifg(0,4,15,5);
			break;
		case 100:
                keyconifg(0,4,15,6);
			break;
		case 103:
                keyconifg(0,4,15,7);
			break;
		case 96:
		keyconifg(0,9,25,0);
			break;
		case 20:
                autoLiangDu(3500);
			break;
		case 101:
			if($(".rect-isoccluded input[type='radio']")[0].checked === true){
				$(".rect-isoccluded input[type='radio']")[1].click();
			} else if ($(".rect-isoccluded input[type='radio']")[1].checked === true){
				$(".rect-isoccluded input[type='radio']")[2].click();
			} else {
				$(".rect-isoccluded input[type='radio']")[0].click();
			}
			break;
		case 121:
                if(parseInt(localStorage.getItem('LiangDu'))==0){
					iLiangDu=1;
                    localStorage.setItem('LiangDu',iLiangDu);
					showErrorTip('夜晚亮度调节-开启', 1000);
                        autoLiangDu(1000);
				} else {
					iLiangDu=0;
                    localStorage.setItem('LiangDu',iLiangDu);
					showErrorTip('夜晚亮度调节-关闭', 1000);
                        autoLiangDu(1000);
				}
			break;
        default:
      }
        if(document.getElementById("tipshowstyle")==undefined){
            var csss = "<style id='tipshowstyle'>.general-popup-mask{background:none; !important;}.general-popup{top:50%;left:50%; !important;}.general-popup-close{font-size:24px; !important;}.general-popup-notice-content{font-size:24px; !important;}</style>";
			$('html').append($(csss));
		}
    }
	var oB=document.getElementsByTagName('body')[0].children[1].children[1].children[3].children[1];
	var sp=document.createElement("style");
	var css = "";
		css += [
		".mark-rect-draw-type,.mark-rect-draw-attr{padding:0;line-height:4px;background:#afafaf; !important;}",
		".mark-rect-draw-attr{line-height:20px;background:#afafaf;border-bottom:1px dashed #afafaf; !important;}",
		".mark-rect-attr-title,.mark-rect-config-title{font-weight:700;padding-right:2px; !important;}",
		".mark-rect-draw-type label,.mark-rect-draw-attr label{padding-left:0;padding-right:0; !important;}",
		".container.container-main{margin-bottom:0; !important;}",
		".pro-main{margin:0; !important;}",
		".com-mark-p-question,.com-mark-pq-text-wrap{margin:0;padding:0; !important;}",
		".com-mark-pq-single-wrap .com-mark-pq-single,.com-mark-pq-single-wrap .com-mark-pq-singleplus,.com-mark-pq-content{margin:0;padding:0; !important;}",
        "div.com-mark-pq-content{margin:0;padding:0;display:none; !important;}",
		".container-head,.pro-top-nav.clearfix,.pro-top-bar,.pro-top-bar,.footer,.control-panel,.right-sidebar{display:none; !important;}",
		".operation-info,.op-link.info-close,.op-link.info-view.dn,#hotKeyLabelDiv,.limit-desc-item,.limit-desc-item{display:none; !important;}",
		"div#rect-draw-config-panel{height:224px; !important;}",
		".com-mark-page .com-mark-p-brief{padding:2px 20px 1px; !important;}",
		"body,element.style,.pro-main,.mark-rect-draw-type{color: #000;background: #" + iBackground + "; !important;}",
		].join("\n");
	sp.innerHTML=css;
	oB.appendChild(sp);
})();