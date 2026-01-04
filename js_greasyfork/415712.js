// ==UserScript==
// @name         Mosoteach云班课资源一键完成
// @version      1.1
// @author       YuYuYu
// @description  自动完成所有未完成的资源
// @match        https://www.mosoteach.cn/web/index.php?c=res*
// @namespace https://greasyfork.org/users/702714
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/415712/Mosoteach%E4%BA%91%E7%8F%AD%E8%AF%BE%E8%B5%84%E6%BA%90%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/415712/Mosoteach%E4%BA%91%E7%8F%AD%E8%AF%BE%E8%B5%84%E6%BA%90%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==

(function(){
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
GM_registerMenuCommand('手动运行脚本',function(){
  auto();
});
async function auto(){
  //调整图片属性
	for(a=0;a<document.getElementsByClassName("res-row-open-enable res-row preview  drag-res-row").length;a++){
	if(document.getElementsByClassName("res-row-open-enable res-row preview  drag-res-row")[a].dataset.mime!="video"){document.getElementsByClassName("res-row-open-enable res-row preview  drag-res-row")[a].className="res-row-open-enable res-row preview-file  drag-res-row";}
	}
	i=0;
	arr=new Array();
	for(a=0;a<document.getElementsByClassName("res-row-open-enable res-row preview  drag-res-row").length;a++){
		if(document.getElementsByClassName("res-row-open-enable res-row preview  drag-res-row")[a].children[5].children[1].children[6].style.color=="rgb(236, 105, 65)"){
			arr[arr.length]=a;
		}
	}
	if(arr.length==0){
		autolink();
	}else{
		document.getElementsByClassName("res-row-open-enable res-row preview  drag-res-row")[arr[i++]].click();
        while(!document.getElementById("preview-video_native_hls")){
            await sleep(100);
        }
		document.getElementById("preview-video_native_hls").onplaying=function(){document.querySelector('video').setCurrentTime(document.querySelector('video').duration);}
		document.getElementById("preview-video_native_hls").onended=async function(){$(".close-window").trigger("click");await sleep(500);if(i<arr.length){document.getElementsByClassName("res-row-open-enable res-row preview  drag-res-row")[arr[i++]].click();}else{autolink();}}
	}
}
window.onload=auto;
async function autolink(){
	var arr1=new Array();
	var arr2=new Array();
	var arr3=new Array();
	for(a=0;a<document.getElementsByClassName("res-row-open-enable res-row web  drag-res-row").length;a++){
		if(document.getElementsByClassName("res-row-open-enable res-row web  drag-res-row")[a].children[5].children[1].children[2].style.color=="rgb(236, 105, 65)"){
			arr1[arr1.length]=a;
        }
	}
	for(a=0;a<document.getElementsByClassName("res-row-open-enable res-row preview-file  drag-res-row").length;a++){
		if(document.getElementsByClassName("res-row-open-enable res-row preview-file  drag-res-row")[0].children[5].children[1].children[4].style.color=="rgb(236, 105, 65)"){
			arr2[arr2.length]=a;
		}
	}
	for(a=0;a<document.getElementsByClassName("res-row-open-enable res-row download-res  drag-res-row").length;a++){
		if(document.getElementsByClassName("res-row-open-enable res-row download-res  drag-res-row")[0].children[5].children[1].children[4].style.color=="rgb(236, 105, 65)"){
			arr3[arr3.length]=a;
		}
	}
	if(arr1.length==0&&arr2.length==0&&arr3.length==0){
		if(arr.length==0){
			alert("没有未完成的视频和其他内容！");
		}else{
		    alert("完成！按F5刷新查看结果");
		}
	}else{
		if(arr1.length!=0){
            var x=window.open("https://www.mosoteach.cn/web/index.php?c=res&m=online_preview&clazz_course_id=" + clazzcourseId + '&file_id=' + document.getElementsByClassName("res-row-open-enable res-row web  drag-res-row")[arr1[0]].dataset.value);
			for(var i=1;i<arr1.length;i++){
			    await sleep(100);
				x.location.href="https://www.mosoteach.cn/web/index.php?c=res&m=online_preview&clazz_course_id=" + clazzcourseId + '&file_id=' + document.getElementsByClassName("res-row-open-enable res-row web  drag-res-row")[arr1[i]].dataset.value;
			}
			await sleep(100);
            x.close();
		}
		if(arr2.length!=0){
            var x=window.open("https://www.mosoteach.cn/web/index.php?c=res&m=online_preview&clazz_course_id=" + clazzcourseId + '&file_id=' + document.getElementsByClassName("res-row-open-enable res-row web  drag-res-row")[arr2[0]].dataset.value);
			for(var i=1;i<arr2.length;i++){
			    await sleep(100);
				x.location.href="https://www.mosoteach.cn/web/index.php?c=res&m=online_preview&clazz_course_id=" + clazzcourseId + '&file_id=' + document.getElementsByClassName("res-row-open-enable res-row preview-file  drag-res-row")[arr2[i]].dataset.value;
			}
			await sleep(100);
            x.close();
		}
		if(arr3.length!=0){
			for(var i=0;i<arr3.length;i++){
			    await sleep(1000);
				document.getElementsByClassName("res-row-open-enable res-row download-res  drag-res-row")[arr3[i]].children[6].children[1].children[0].children[0].click();
			}
			alert("完成！请手动删除下载的文件，按F5刷新查看结果");
		}else{
			alert("完成！按F5刷新查看结果");
		}
	}
}})();