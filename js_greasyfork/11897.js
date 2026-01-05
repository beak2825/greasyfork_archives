// ==UserScript==
// @name        dlEHAuto
// @namespace   http://dlEHAuto.Satoshi/
// @version     0.13
// @description English: Add a download button with white arrow icon and green background on each link in the gallery list page of e-hentai gallery and ex-hentai. Click on it will download the archive of this gallery without payment confirm. Click on the "Archive Download" link on the galleary page will also start the automatic download progress. 中文：在易恒泰画廊以及EX的列表页中，在每一行作品链接后添加一个绿底白箭头，点击这个链接会进入自动下载压缩文件流程（不会询问是否确认支付C,GP等），另外，在每一个作品页，以点击下载压缩文件的操作启动自动下载压缩文件的流程（不询问是否确认支付同上）
// @require     https://cdn.staticfile.org/jquery/1.9.0/jquery.min.js
// @include     /http[s]?\:\/\/exhentai.org\/.*/
// @include     /http[s]?\:\/\/g.e-hentai.org\/.*/
// @include     /http:\/\/\d{1,3}(\.\d{1,3}){3}\/archive\/\d*\/\w*/
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @copyright   2015.08.20  Satoshi
// @downloadURL https://update.greasyfork.org/scripts/11897/dlEHAuto.user.js
// @updateURL https://update.greasyfork.org/scripts/11897/dlEHAuto.meta.js
// ==/UserScript==

//switch true -> gallery page will close after archive auto click when download start on the list page
//       false -> gallery page will not close after archive auto click when download start on the list page
isGalleryPageAutoClose = localStorage.getItem("isGalleryPageAutoClose");
//switch true -> advance option will show automatically and check some checkbox when list page load
//       false -> advance option will not show automatically
isAutoCheck = localStorage.getItem("isAutoCheck");
defaultDownload = localStorage.getItem("defaultDownload");
if(isBlank(isGalleryPageAutoClose)){
    isGalleryPageAutoClose = "false";
    localStorage.setItem("isGalleryPageAutoClose",isGalleryPageAutoClose);
}
if(isBlank(isAutoCheck)){
    isAutoCheck = "false";
    localStorage.setItem("isAutoCheck",isAutoCheck);
}
if(isBlank(defaultDownload)){
    defaultDownload = "org";// localStorage.setItem("defaultDownload","res")
    localStorage.setItem("defaultDownload",defaultDownload);
}
else{
    if(defaultDownload=='Download Original Archive' || defaultDownload=='org'){
        defaultDownload = 'org';
    }
    else{
        defaultDownload = 'res';
    }
    localStorage.setItem("defaultDownload",defaultDownload);
}
function isBlank(str){
    return str === null || str === "";
}
function checkForm(){
    jQuery("#adv13").attr("checked","checked");
    jQuery("#adv15").attr("checked","checked");
    jQuery("#adv22").attr("checked","checked");
    jQuery("#adv31").attr("checked","checked");
}
function tabClose(){
    window.opener = null;
    window.open('','_self');
    window.close();
}
jQuery().ready(function(){
    jQuery.noConflict();
	var loc = window.location.href;
	var link = jQuery(".it5 > a");
    if(JSON.parse(isAutoCheck)){
        jQuery("p.nopm > a[onclick^='toggle_advsearch_pane']").on("click",function(){
            setTimeout(checkForm,20);
        });
        if(/http[s]?:\/\/exhentai.org\/(\?.*)?/.test(loc) || /http[s]?:\/\/g.e-hentai.org\/(\?.*)?/.test(loc)){
            if(jQuery("#advdiv > table").length === 0){
                jQuery("p.nopm > a[onclick^='toggle_advsearch_pane']").click();
            }
            checkForm();
        }
    }
	if(link.length > 0){
		link.each(function(){
			var it3 = jQuery("<div/>",{class:"it3"});
			var i = jQuery("<div/>",{class:"i"});
			var href = jQuery(this).attr("href");
            console.log(href);
			var a = jQuery("<a/>",{rel:"nofollow",href:href}).mousedown(function(e){
                if(1==e.which||2==e.which){
                    window.localStorage.setItem(href,true);
                }
			});
			var icon = jQuery("<img/>",{src:"https://ehgt.org/g/t.png",class:"n",alt:"T"});
			var auto = it3.append(i.append(a.append(icon)));
			jQuery(this).parent().after(auto);
		});
	}
	else if(loc.match(/http[s]?\:\/\/[^\/]*\/g\/\d*\/[^\/]*\//) !== null){
		if(window.localStorage.getItem(loc) !== null && window.localStorage.getItem(loc)){
			window.localStorage.removeItem(loc);
			jQuery(".g2.gsp").children('a').eq(0).click();
            if(JSON.parse(isGalleryPageAutoClose)){
                tabClose();
            }
		}
	}
	else if(jQuery(".stdbtn").length > 0 && (/http[s]?:\/\/exhentai.org\/archiver.php.*/.test(loc) || /http[s]?:\/\/g.e-hentai.org\/archiver.php.*/.test(loc))){
        jQuery("[name='dltype'][value='"+window.localStorage.getItem("defaultDownload")+"']").next().children().get(0).click();
	}
	else if(jQuery("#db > p > a").length > 0){
		if("Click Here To Start Downloading"==jQuery("#db > p > a").text()){
			jQuery("#db > p > a").get(0).click();
			setTimeout(tabClose,60000);
		}
	}
});