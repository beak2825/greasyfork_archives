// ==UserScript==
// @name         StandingLikeCodeforces.js
// @namespace    AtCoder
// @version      0.1
// @description  順位表からCodeforcesのように提出を見れるようにするスクリプト
// @author       Bondo
// @match      https://atcoder.jp/contests/*/standings
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/426262/StandingLikeCodeforcesjs.user.js
// @updateURL https://update.greasyfork.org/scripts/426262/StandingLikeCodeforcesjs.meta.js
// ==/UserScript==

//HTMLの文字列をDocumentオブジェクトで返す
function htmlStringToDocument(text){
	try{
		var dom_parser = new DOMParser();
		var document_obj = dom_parser.parseFromString(text , "text/html");
		if(document_obj.getElementsByTagName("parsererror").length == 0){
			return document_obj;
		}
	}catch(e){
	}

	try{
		var document_obj = document.implementation.createHTMLDocument("");
		document_obj.body.innerHTML = text;
		return document_obj;
	}catch(e){
	}

	return null;
}


$(function(){
	//順位表ページのURL
	var standingURL = location.href;
	//ベースのURL https://atcoder.jp/contest/*/
	var baseURL = standingURL.replace('standings','');
	var taskURL = baseURL + 'tasks/';
	var allSubmissionsURL = baseURL + 'submissions/';

	//問題の数
	var numberOfProblems = 0;
	//問題名の配列 ex)abc141_a
	var nameOfProblems = [];

	//問題一覧を取得する
	$.ajax({
		url: allSubmissionsURL,    // 表示させたいコンテンツがあるページURL
		type: 'GET',
		datatype: 'html',
		async : false,
	}).done(function(html){
		var submissionsHtml = htmlStringToDocument(html);
		var problems = $('#select-task', submissionsHtml).children();
		numberOfProblems = problems.length;
		for(var i=0;i<numberOfProblems;i++){
			if(i == 0) continue;
			var problem = problems.eq(i).val()
			//提出一覧を初期化
			nameOfProblems.push(problem);
		}
	});

	setTimeout(
        function () {
            //順位表の列を取得
			//const trs = document.querySelector("#standings-tbody tr");
			//const table = $("#main-container > div.row > div:nth-child(3) > div.panel.panel-default.panel-standings > div.table-responsive > table");
			var table = document.getElementById('standings-tbody');

			for(var tr=0;tr<table.rows.length;tr++){
				//お気に入りユーザの名前
				var username = '';
				//お気に入りユーザの提出URLを入れる辞書
				var submissions = {};
				//ユーザがお気に入りかどうか
				var fav = false;
				for(var td=0;td<table.rows[tr].cells.length;td++){
					var cells = table.rows[tr].cells[td];
					//alert(td + cells.innerHTML);
					if(td == 1){
						//alert(td + cells.innerHTML);
						var imgSrc = cells.getElementsByClassName('fav-btn-standings')[0].src;
						//お気に入りユーザの場合
						if(imgSrc.search('unfav') < 0){
							//お気に入りユーザ名
							username = cells.getElementsByClassName('username')[0].innerText;
							fav = true;
							//お気に入りユーザの提出一覧ページのURL
							var queryParameters = `submissions?f.Status=AC&f.User=${username}`;
							var newURL = baseURL + queryParameters;
							//ユーザの提出一覧ページを取得する
							$.ajax({
								url: newURL,    // 表示させたいコンテンツがあるページURL
								type: 'GET',
								datatype: 'html',
								async: false,//同期通信
							}).done(function(html){
								//提出ページのHTMLの文字列を取得し，documentにする
								var submissionsHtml = htmlStringToDocument(html);
								//提出一覧のTableを取得
								var submissionsTable = submissionsHtml.querySelector("#main-container > div.row > div:nth-child(3) > div.panel.panel-default.panel-submission > div.table-responsive > table > tbody")
								//お気に入りユーザの提出一覧を初期化する
								for(var i=0;i<numberOfProblems;i++){
									submissions[nameOfProblems[i]] = 'null';
								}
								for(var subtr=0;subtr<submissionsTable.rows.length;subtr++){
									//問題のkeyを取得 ex)abs141_a
									var task = submissionsTable.rows[subtr].cells[1].getElementsByTagName('a')[0].href;
									//提出のURLを取得
									var submissionURL = submissionsTable.rows[subtr].cells[9].getElementsByTagName('a')[0].href
									//keyのみにする
									task = task.replace(taskURL, '');
									//提出の新しい順に辞書に追加していく 既に入っていればそのまま
									if(submissions[task] == 'null'){
										submissions[task] = submissionURL;
									}
								}
								//Object.keys(submissions).map(key => alert(key + ' ' + submissions[key]));
							});
						}
					}
					if(3 <= td && td < 3 + numberOfProblems - 1 && fav){
						var cellsHtml = cells.getElementsByTagName('p')[0].innerHTML;
						var link = submissions[nameOfProblems[td-3]];
						//ACの提出があればリンクを貼る
						if(link != 'null'){
							cells.getElementsByTagName('p')[0].innerHTML = '<a href=' + link + '>' + cellsHtml + '</a>';
						}
						//<td class="standings-result"><p>-</p></td>
						//<td class="standings-result"><p><span class="standings-ac">500</span></p><p>48:18</p></td>
					}
				}
			}
        },
        "2000"
      );
});