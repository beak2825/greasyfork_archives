// ==UserScript==
// @name         動畫瘋 - 截圖工具
// @namespace    hbl917070
// @version      0.3
// @description  在 動畫瘋 加入 截圖 的功能
// @author       hbl917070(深海異音)
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388826/%E5%8B%95%E7%95%AB%E7%98%8B%20-%20%E6%88%AA%E5%9C%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/388826/%E5%8B%95%E7%95%AB%E7%98%8B%20-%20%E6%88%AA%E5%9C%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==



/**
 * 最後修改日期：
 * 2020/05/09
 *
 * 說明：
 * 在 動畫瘋 加入 截圖 的功能
 *
 * 作者小屋：
 * https://home.gamer.com.tw/homeindex.php?owner=hbl917070
 *
 */

/**
 *
 * 版本說明
 *
 * 2020/05/09：修復BUG
 * 2019/09/08：修復某些圖片附檔名錯誤的BUG
 *
 */

(function () {


	//要插入的html

	var s_html = `
  <div class="ct_div">

  <style>
      /*最外層的框*/
      .ct_div {
          background-color: #FFF;
          padding: 5px;
          padding-left: 11px;
      }

      /*「截圖」按鈕*/
      .but_ct {
          margin-top: 10px;
          padding: 3px 10px;
          border: 1px solid #00B4D8;
          color: #00B4D8;
          display: inline-block;
          text-align: center;
          line-height: 27px;
          font-size: 1.3em;
          margin-right: 10px;
      }

      .but_ct:hover {
          background-color: #00B4D8;
          border: 1px solid #00B4D8;
          color: #FFF;
          display: inline-block;

      }

      /*放每一個截圖的區域*/
      #ct_output {
          max-height: 500px;
          overflow: auto;
          margin-top: 10px;
      }

      /*每一個截圖項目*/
      .ct_item {
          margin-bottom: 10px;
          margin-right: 10px;
          border: 1px solid #d9d9d9;
          float: left;
          padding: 5px;
          white-space: nowrap;
      }

      .ct_img {
          max-width: 195px;
          max-height: 150px;
      }

      /*影片時間*/
      .ct_time {
          float: left;
          margin-top: 5px;
          font-size: 18px;
      }

      /*下載圖片*/
      .ct_download {
          float: right;
          display: block;
          width: 20px;
          height: 20px;
          background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjQzMy41cHgiIGhlaWdodD0iNDMzLjVweCIgdmlld0JveD0iMCAwIDQzMy41IDQzMy41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzMuNSA0MzMuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQoJPg0KPGc+DQoJPGcgaWQ9ImZpbGUtZG93bmxvYWQiPg0KCQk8cGF0aCBkPSJNMzk1LjI1LDE1M2gtMTAyVjBoLTE1M3YxNTNoLTEwMmwxNzguNSwxNzguNUwzOTUuMjUsMTUzeiBNMzguMjUsMzgyLjV2NTFoMzU3di01MUgzOC4yNXoiLz4NCgk8L2c+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==);
          background-size: 90% 90%;
          background-position: center center;
          background-repeat: no-repeat;
          opacity: 0.2;
          margin-top: 3px;
      }

      .ct_download:hover {
          opacity: 1;
      }

      /*刪除圖片*/
      .ct_delete {
          float: right;
          display: block;
          width: 20px;
          height: 20px;
          background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjQyN3B0IiB2aWV3Qm94PSItNDAgMCA0MjcgNDI3LjAwMTMxIiB3aWR0aD0iNDI3cHQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTIzMi4zOTg0MzggMTU0LjcwMzEyNWMtNS41MjM0MzggMC0xMCA0LjQ3NjU2My0xMCAxMHYxODljMCA1LjUxOTUzMSA0LjQ3NjU2MiAxMCAxMCAxMCA1LjUyMzQzNyAwIDEwLTQuNDgwNDY5IDEwLTEwdi0xODljMC01LjUyMzQzNy00LjQ3NjU2My0xMC0xMC0xMHptMCAwIi8+PHBhdGggZD0ibTExNC4zOTg0MzggMTU0LjcwMzEyNWMtNS41MjM0MzggMC0xMCA0LjQ3NjU2My0xMCAxMHYxODljMCA1LjUxOTUzMSA0LjQ3NjU2MiAxMCAxMCAxMCA1LjUyMzQzNyAwIDEwLTQuNDgwNDY5IDEwLTEwdi0xODljMC01LjUyMzQzNy00LjQ3NjU2My0xMC0xMC0xMHptMCAwIi8+PHBhdGggZD0ibTI4LjM5ODQzOCAxMjcuMTIxMDk0djI0Ni4zNzg5MDZjMCAxNC41NjI1IDUuMzM5ODQzIDI4LjIzODI4MSAxNC42Njc5NjggMzguMDUwNzgxIDkuMjg1MTU2IDkuODM5ODQ0IDIyLjIwNzAzMiAxNS40MjU3ODEgMzUuNzMwNDY5IDE1LjQ0OTIxOWgxODkuMjAzMTI1YzEzLjUyNzM0NC0uMDIzNDM4IDI2LjQ0OTIxOS01LjYwOTM3NSAzNS43MzA0NjktMTUuNDQ5MjE5IDkuMzI4MTI1LTkuODEyNSAxNC42Njc5NjktMjMuNDg4MjgxIDE0LjY2Nzk2OS0zOC4wNTA3ODF2LTI0Ni4zNzg5MDZjMTguNTQyOTY4LTQuOTIxODc1IDMwLjU1ODU5My0yMi44MzU5MzggMjguMDc4MTI0LTQxLjg2MzI4Mi0yLjQ4NDM3NC0xOS4wMjM0MzctMTguNjkxNDA2LTMzLjI1MzkwNi0zNy44Nzg5MDYtMzMuMjU3ODEyaC01MS4xOTkyMTh2LTEyLjVjLjA1ODU5My0xMC41MTE3MTktNC4wOTc2NTctMjAuNjA1NDY5LTExLjUzOTA2My0yOC4wMzEyNS03LjQ0MTQwNi03LjQyMTg3NS0xNy41NTA3ODEtMTEuNTU0Njg3NS0yOC4wNjI1LTExLjQ2ODc1aC04OC43OTY4NzVjLTEwLjUxMTcxOS0uMDg1OTM3NS0yMC42MjEwOTQgNC4wNDY4NzUtMjguMDYyNSAxMS40Njg3NS03LjQ0MTQwNiA3LjQyNTc4MS0xMS41OTc2NTYgMTcuNTE5NTMxLTExLjUzOTA2MiAyOC4wMzEyNXYxMi41aC01MS4xOTkyMTljLTE5LjE4NzUuMDAzOTA2LTM1LjM5NDUzMSAxNC4yMzQzNzUtMzcuODc4OTA3IDMzLjI1NzgxMi0yLjQ4MDQ2OCAxOS4wMjczNDQgOS41MzUxNTcgMzYuOTQxNDA3IDI4LjA3ODEyNiA0MS44NjMyODJ6bTIzOS42MDE1NjIgMjc5Ljg3ODkwNmgtMTg5LjIwMzEyNWMtMTcuMDk3NjU2IDAtMzAuMzk4NDM3LTE0LjY4NzUtMzAuMzk4NDM3LTMzLjV2LTI0NS41aDI1MHYyNDUuNWMwIDE4LjgxMjUtMTMuMzAwNzgyIDMzLjUtMzAuMzk4NDM4IDMzLjV6bS0xNTguNjAxNTYyLTM2Ny41Yy0uMDY2NDA3LTUuMjA3MDMxIDEuOTgwNDY4LTEwLjIxODc1IDUuNjc1NzgxLTEzLjg5NDUzMSAzLjY5MTQwNi0zLjY3NTc4MSA4LjcxNDg0My01LjY5NTMxMyAxMy45MjU3ODEtNS42MDU0NjloODguNzk2ODc1YzUuMjEwOTM3LS4wODk4NDQgMTAuMjM0Mzc1IDEuOTI5Njg4IDEzLjkyNTc4MSA1LjYwNTQ2OSAzLjY5NTMxMyAzLjY3MTg3NSA1Ljc0MjE4OCA4LjY4NzUgNS42NzU3ODIgMTMuODk0NTMxdjEyLjVoLTEyOHptLTcxLjE5OTIxOSAzMi41aDI3MC4zOTg0MzdjOS45NDE0MDYgMCAxOCA4LjA1ODU5NCAxOCAxOHMtOC4wNTg1OTQgMTgtMTggMThoLTI3MC4zOTg0MzdjLTkuOTQxNDA3IDAtMTgtOC4wNTg1OTQtMTgtMThzOC4wNTg1OTMtMTggMTgtMTh6bTAgMCIvPjxwYXRoIGQ9Im0xNzMuMzk4NDM4IDE1NC43MDMxMjVjLTUuNTIzNDM4IDAtMTAgNC40NzY1NjMtMTAgMTB2MTg5YzAgNS41MTk1MzEgNC40NzY1NjIgMTAgMTAgMTAgNS41MjM0MzcgMCAxMC00LjQ4MDQ2OSAxMC0xMHYtMTg5YzAtNS41MjM0MzctNC40NzY1NjMtMTAtMTAtMTB6bTAgMCIvPjwvc3ZnPg==);
          background-size: 90% 90%;
          background-position: center center;
          background-repeat: no-repeat;
          opacity: 0.2;
          margin-top: 3px;
          margin-right: 20px;
      }

      .ct_delete:hover {
          opacity: 1;
      }

      /*開啟圖片*/
      .ct_open {
          float: right;
          display: block;
          width: 20px;
          height: 20px;
          background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDUxIDQ1MSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDUxIDQ1MTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTQ0Ny4wNSw0MjhsLTEwOS42LTEwOS42YzI5LjQtMzMuOCw0Ny4yLTc3LjksNDcuMi0xMjYuMUMzODQuNjUsODYuMiwyOTguMzUsMCwxOTIuMzUsMEM4Ni4yNSwwLDAuMDUsODYuMywwLjA1LDE5Mi4zDQoJCXM4Ni4zLDE5Mi4zLDE5Mi4zLDE5Mi4zYzQ4LjIsMCw5Mi4zLTE3LjgsMTI2LjEtNDcuMkw0MjguMDUsNDQ3YzIuNiwyLjYsNi4xLDQsOS41LDRzNi45LTEuMyw5LjUtNA0KCQlDNDUyLjI1LDQ0MS44LDQ1Mi4yNSw0MzMuMiw0NDcuMDUsNDI4eiBNMjYuOTUsMTkyLjNjMC05MS4yLDc0LjItMTY1LjMsMTY1LjMtMTY1LjNjOTEuMiwwLDE2NS4zLDc0LjIsMTY1LjMsMTY1LjMNCgkJcy03NC4xLDE2NS40LTE2NS4zLDE2NS40QzEwMS4xNSwzNTcuNywyNi45NSwyODMuNSwyNi45NSwxOTIuM3oiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K);
          background-size: 90% 90%;
          background-position: center center;
          background-repeat: no-repeat;
          opacity: 0.2;
          margin-top: 3px;
          margin-right: 20px;
      }

      .ct_open:hover {
          opacity: 1;
      }
  </style>


  <div class="but_ct" onclick="add_ct()">截圖</div>
  <span style="font-size:14px; color:rgb(100, 100, 100)">(截圖快速鍵 「F8」</span>


  <div id="ct_output"></div>

  <div id="temp_ct_item" style="display:none;">
      <div class="ct_item">

          <img class="ct_img" src="{{ct_img}}">
          <div>
              <div class="ct_time">{{ct_time}}</div>
              <a class="ct_download" download="{{ct_name}}" href="{{ct_img}}"></a>
              <a class="ct_open" href="{{ct_img}}" target="_blank"></a>
              <div class="ct_delete" onclick="ct_delete('{{nub}}')"></div>
          </div>

      </div>
  </div>
</div>


`;

	var dom_div = document.createElement('div');
	dom_div.innerHTML = s_html;

	//目前截圖的編號（用於刪除圖片）
	window.ct_nub = 1;

	//把截圖的按鈕，插入到標題上方
	var dom_player = document.getElementsByClassName('anime-title')[0];
	dom_player.parentNode.insertBefore(dom_div, dom_player);

	//繪製圖片用的 canvas
	var cc = document.createElement('canvas');
	document.body.append(cc);

	//截圖快速鍵
	document.body.addEventListener("keydown", function (e) {
		if (e.keyCode == 119) { //F8
			add_ct();
		}
	});


	/**
	 * 影片截圖
	 */
	function add_ct() {

		//取得影片目前的畫面
		var video = document.getElementById('ani_video_html5_api');
		cc.width = video.videoWidth;
		cc.height = video.videoHeight;
		cc.setAttribute('style', 'width:0px; height:0px;');
		cc.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
		let base64 = cc.toDataURL("image/jpeg", 0.95);

		let imgsrc = URL.createObjectURL(dataURItoBlob(base64));// Blob url
		let imgtime = document.querySelector('.vjs-current-time .vjs-current-time-display').innerHTML;//目前時間

		let s_tit = document.querySelector('.anime_name h1').innerHTML;
		s_tit = s_tit.replace(/[/]/g, ' ').replace(/[\\]/g, ' ').replace(/[:]/g, '：').replace(/[*]/g, ' ')
			.replace(/["]/g, ' ').replace(/[?]/g, ' ').replace(/[<]/g, ' ').replace(/[>]/g, ' ').replace(/[|]/g, ' ')
			.replace(/[\t]/g, ' ').replace(/[\n]/g, ' ').replace(/[\r]/g, ' ');//避免windows不支援的檔名
		let s_time = imgtime.replace(/[:]/g, '：');
		let imgname = s_tit + ' ' + s_time + '.jpg';//圖片檔名


		let dom_ct_item = document.createElement('div');
		dom_ct_item.setAttribute('class', 'ct_item ' + 'ct_nub_' + window.ct_nub);
		let shtml = `
                  <img class="ct_img" src="{{ct_img}}">
                  <div>
                      <div class="ct_time">{{ct_time}}</div>
                      <a class="ct_download" download="{{ct_name}}" href="{{ct_img}}"></a>
                      <a class="ct_open" href="{{ct_img}}" target="_blank"></a>
                      <div class="ct_delete" onclick="ct_delete('{{nub}}')"></div>
                  </div>
                  `;
		shtml = shtml.replace(/{{ct_img}}/g, imgsrc)
			.replace(/{{ct_time}}/g, imgtime)
			.replace(/{{ct_name}}/g, imgname)
			.replace(/{{nub}}/g, window.ct_nub);

		dom_ct_item.innerHTML = shtml;
		document.getElementById('ct_output').append(dom_ct_item);

		window.ct_nub += 1;
	}

	/**
	 * 刪除圖片
	 * @param nub
	 */
	function ct_delete(nub) {
		let child = document.querySelector('.ct_nub_' + nub);
		child.parentNode.removeChild(child);
	}


	/**
	 * Blob object 轉 Blob url
	 * @param dataURI
	 */
	function dataURItoBlob(dataURI) {
		// convert base64/URLEncoded data component to raw binary data held in a string
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(dataURI.split(',')[1]);
		else
			byteString = unescape(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], { type: mimeString });
	}

	window.add_ct = add_ct;
	window.ct_delete = ct_delete;
	window.dataURItoBlob = dataURItoBlob;




})();



