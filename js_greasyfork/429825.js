// ==UserScript==
// @name         智慧树学习资源自动刷新脚本
// @description  zh-cn
// @namespace    http://blog.zoyn.top/
// @version      1.0
// @author       Zoyn
// @match        https://hike.zhihuishu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/429825/%E6%99%BA%E6%85%A7%E6%A0%91%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%BA%90%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/429825/%E6%99%BA%E6%85%A7%E6%A0%91%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%BA%90%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 延迟2s执行
    window.setTimeout(function(){
         /* 以下为文档部分 */
        if (document.querySelector("#viewBox").children[0].className == "doc-box") {
            console.log("检测到当前为文档，将在10秒后自动跳转至下一个资源")
            // 延迟10s执行
            window.setTimeout(function(){
                nextResource()
            },10000);
            return;
        }

        /* 以下为视频部分 */

        // 自动播放视频
        document.querySelector("#playButton").click()
        // 自动静音
        document.querySelector("#vjs_mediaPlayer > div.controlsBar > div.volumeBox > div.volumeIcon").click()
        // 绑定视频
        let video = document.querySelector("#vjs_mediaPlayer_html5_api")
        video.addEventListener('ended', ()=>{
            console.log("视频播放完成, 正在切换至下一个资源")
            nextResource()
        })
    },2000);

})();

function searchFolderVideos(folder) {
	var videoList = new Array()
	for(var i = 0; i < folder.children.length; i++) {
		var children = folder.children[i]
		// 分类中还有分类就自动递归，直到结束
		if(children.className == "folder-item") {
			var childrenVideos = searchFolderVideos(children)
			for(var j = 0; j < childrenVideos.length; j++) {
				videoList.push(childrenVideos[j])
			}
			continue
		}
		if(children.className == "file-item" || children.className == "file-item active") {
			if(children.id.startsWith("file")) {
				var videoFileId = parseInt(children.id.replace("file_", ""))
				videoList.push(videoFileId)
			}
		}
    }
	return videoList
}

function nextResource() {
    // 遍历资源树
    let root = document.querySelector("#sourceTree")
    // 判断资源数量
    if (root.children.length != 0) {
		// 获取每一个分支下的视频
		let videoList = new Array()
        for(var i = 0; i < root.children.length; i++) {
			var folder = root.children[i]

			var folderVideos = searchFolderVideos(folder)
			for(var j = 0; j < folderVideos.length; j++) {
				videoList.push(folderVideos[j])
			}
        }

		/* 以下为视频跳转部分 */
		// console.log(videoList)
		var url = window.location.href
		var urls = url.split("fileId=")
		// 遍历 查找到下一个视频
		for(var k = 0; k < videoList.length; k++) {
			var videoNumber = videoList[k]
			// 这里需要判断一下是不是最后一个视频
			var currentVideo = parseInt(urls[1])
			if (currentVideo == videoList[videoList.length - 1]) {
				alert("刷课完成")
				break;
			}
			// 下一个视频
			if (currentVideo == videoNumber) {
				var newUrl = urls[0] + "fileId=" + videoList[k + 1]
				window.location.href = newUrl
			}
		}
    }
}