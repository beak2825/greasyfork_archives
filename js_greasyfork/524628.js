// ==UserScript==

// @namespace    https://openuserjs.org/users/a29527806
// @name         眾至郵件伺服器增加密碼欄位及匯出清單功能
// @description  在帳號管理增加密碼欄位及匯出清單功能
// @copyright    2022, HrJasn (https://openuserjs.org/users/a29527806)
// @license      GPL-3.0-or-later
// @version      MS6410_3.1.0.2_v1.1
// @icon         https://www.google.com/s2/favicons?domain=125.185
// @match        http*://*/index.php?menu=user&func=user
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524628/%E7%9C%BE%E8%87%B3%E9%83%B5%E4%BB%B6%E4%BC%BA%E6%9C%8D%E5%99%A8%E5%A2%9E%E5%8A%A0%E5%AF%86%E7%A2%BC%E6%AC%84%E4%BD%8D%E5%8F%8A%E5%8C%AF%E5%87%BA%E6%B8%85%E5%96%AE%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/524628/%E7%9C%BE%E8%87%B3%E9%83%B5%E4%BB%B6%E4%BC%BA%E6%9C%8D%E5%99%A8%E5%A2%9E%E5%8A%A0%E5%AF%86%E7%A2%BC%E6%AC%84%E4%BD%8D%E5%8F%8A%E5%8C%AF%E5%87%BA%E6%B8%85%E5%96%AE%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author       a29527806
// ==/OpenUserJS==

(function() {
    window.onload = function(){
		var list_table_content = document.querySelector("table.list_table_content");
		var ShowPWDLink = document.createElement("a");
		ShowPWDLink.appendChild(document.createTextNode("顯示密碼"));
		ShowPWDLink.href = "javascript:void(0);";
		//ShowPWDLink.style.display = "block";
		ShowPWDLink.style = "color:white;padding:5px;";
		var getExpPos = document.querySelector('table.list_table_page > tbody > tr > td[align="left"]');
		getExpPos = getExpPos.appendChild(document.createElement("span"));
		getExpPos.appendChild(ShowPWDLink);
		ShowPWDLink.onclick = function(){
			function sendInfo(accountNumber){
				var url = window.location.origin + "/index.php?menu=user&func=user&do=edit&id=" + ActContents[accountCount].querySelector("span > b:nth-child(1)").innerText;
				if (window.XMLHttpRequest) {
					passwdrequest = new XMLHttpRequest();
				}
				else if (window.ActiveXObject) {
					passwdrequest = new ActiveXObject("Microsoft.XMLHTTP");
				}
				try {
					passwdrequest.onreadystatechange = getpasswdinfo;
					passwdrequest.open("GET", url, true);
					passwdrequest.send();
				} catch (err) {
					console.log(err);
				}
			}
			function getpasswdinfo(){
				if (passwdrequest.readyState == 4) {
					var getInfoText = passwdrequest.responseText;
					var parser = new DOMParser();
					var getInfoBody = parser.parseFromString(getInfoText,"text/html").body;
					var getInfopasswd = getInfoBody.querySelector("input[name='passwd']").value;
					ActContents[accountCount].nextSibling.nextSibling.innerHTML = getInfopasswd;
					if(accountCount<(ActContents.length-1)){
						accountCount+=1;
						sendInfo(accountCount);
					}
				}
			};
			var winLDStyle = document.createElement("style");
			winLDStyle.type = "text/css";
			winLDStyle.innerHTML = `
				.loader {
				  position: absolute;
				  top: 50%;
				  left: 50%;
				  transform: translateX(-50%) translateY(-50%);
				  width: 50px;
				  height: 50px;
				  margin: auto;
				}
				.loader .loadercircle {
				  position: absolute;
				  width: 38px;
				  height: 38px;
				  opacity: 0;
				  transform: rotate(225deg);
				  animation-iteration-count: infinite;
				  animation-name: orbit;
				  animation-duration: 5.5s;
				}			
				.loader .loadercircle:after {
				  content: '';
				  position: absolute;
				  width: 6px;
				  height: 6px;
				  border-radius: 5px;
				  background: #fff;
				  box-shadow: 0 0 9px rgba(255, 255, 255, .7);
				}
				.loader .loadercircle:nth-child(2) {
				  animation-delay: 240ms;
				}
				.loader .loadercircle:nth-child(3) {
				  animation-delay: 480ms;
				}
				.loader .loadercircle:nth-child(4) {
				  animation-delay: 720ms;
				}
				.loader .loadercircle:nth-child(5) {
				  animation-delay: 960ms;
				}
				.loader .loaderbg {
				  position: absolute;
				  width: 70px;
				  height: 70px;
				  margin-left: -16px;
				  margin-top: -16px;
				  border-radius: 13px;
				  background-color: rgba(0, 153, 255, 0.69);
				  animation: bgg 16087ms ease-in alternate infinite;
				}
				@keyframes orbit {
				  0% {
					transform: rotate(225deg);
					opacity: 1;
					animation-timing-function: ease-out;
				  }
				  7% {
					transform: rotate(345deg);
					animation-timing-function: linear;
				  }
				  30% {
					transform: rotate(455deg);
					animation-timing-function: ease-in-out;
				  }
				  39% {
					transform: rotate(690deg);
					animation-timing-function: linear;
				  }
				  70% {
					transform: rotate(815deg);
					opacity: 1;
					animation-timing-function: ease-out;
				  }
				  75% {
					transform: rotate(945deg);
					animation-timing-function: ease-out;
				  }
				  76% {
					transform: rotate(945deg);
					opacity: 0;
				  }
				  100% {
					transform: rotate(945deg);
					opacity: 0;
				  }
				}
			`;
			document.head.appendChild(winLDStyle);
			var passwdrequest;
			accountCount = 0;
			var ActTitle = list_table_content.querySelector("thead > tr > td:nth-child(2)");
			var PWDCol = document.createElement('td');
			PWDCol.innerHTML = "密碼";
			ActTitle.parentNode.insertBefore(PWDCol,ActTitle.nextSibling.nextSibling);
			var ActContents = list_table_content.querySelectorAll("tbody > tr > td:nth-child(2)");
			ActContents.forEach(function(e){
				var NewPWDTD = document.createElement('td');
				e.parentNode.insertBefore(NewPWDTD,e.nextSibling.nextSibling);
				var NewPWDTD_Loader = document.createElement('div');
				NewPWDTD_Loader.classList.add('loader');
				var NewPWDTD_bg = document.createElement('div');
				NewPWDTD_bg.classList.add('loaderbg');
				NewPWDTD_Loader.appendChild(NewPWDTD_bg);
				var NewPWDTD_Circle = document.createElement('div');
				NewPWDTD_Circle.classList.add('loadercircle');
				for(i=0;i<5;i++){
					NewPWDTD_Loader.appendChild(NewPWDTD_Circle.cloneNode(true));
				}
				NewPWDTD.appendChild(NewPWDTD_Loader);
			});
			sendInfo(0);
		}
		
		var downloadLink = document.createElement("a");
		downloadLink.appendChild(document.createTextNode("匯出清單"));
		downloadLink.href = "javascript:void(0);";
		//downloadLink.style.display = "block";
		downloadLink.style = "color:white;padding:5px;";
		getExpPos.appendChild(downloadLink);
		downloadLink.onclick = function() {
			function BuildCSV(csv, filename) {
				var csvFile;
				var tmpDLLink;
				csvFile = new Blob(["\ufeff"+csv], {type: "text/csv;charset=utf-8"});
				tmpDLLink = document.createElement("a");
				tmpDLLink.download = filename;
				tmpDLLink.href = window.URL.createObjectURL(csvFile);
				tmpDLLink.style.display = "none";
				var getExpPos = document.querySelector('table.list_table_page > tbody > tr >td[align="left"]');
				getExpPos.appendChild(tmpDLLink);
				tmpDLLink.click();
			}
			var csv=[],rows = list_table_content.querySelectorAll("tr");
			for (var i = 0; i < rows.length; i++) {
				var row = [], cols = rows[i].querySelectorAll("td");
				for (var j = 1; j < cols.length-1; j++){
					var setCSVValue;
					if(cols[j].innerText == ""){
						if(cols[j].querySelector("div > img")){
							setCSVValue = cols[j].querySelector("div > img").src;
						}else{
							if(cols[j].querySelector("img")){
								setCSVValue = cols[j].querySelector("img").src;
							}else{
								setCSVValue = cols[j].innerText;
							}
						}
					}else{
						 setCSVValue = cols[j].innerText;
					}
					setCSVValue = setCSVValue.replace(/https:\/\/.*\/imgs\/createDate\.png/,'建立日期');
					setCSVValue = setCSVValue.replace(/https:\/\/.*\/imgs\/activeEmail\.png/,'啟用狀態');
					setCSVValue = setCSVValue.replace(/https:\/\/.*\/imgs\/enable\.png/,'啟用');
					setCSVValue = setCSVValue.replace(/https:\/\/.*\/imgs\/disable\.png/,'停用');
					setCSVValue = setCSVValue.replace(/https:\/\/.*\/imgs\/functions\.png/,'');
					row.push('"' + setCSVValue + '"');
				}
				csv.push(row.join(","));
			}
			BuildCSV(csv.join("\r\n"), document.title + '_郵件帳號清單_'+new Date().toString()+'.csv');
		}
    }
})();