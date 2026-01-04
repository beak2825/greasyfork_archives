// ==UserScript==
// @name         Standings atCoderColor
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  正解率を表示します.コンテスト参加者の色(Rating)別の
// @author       Shobonvip
// @match        https://atcoder.jp/*standings*
// @exclude      https://atcoder.jp/*standings/json
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/423834/Standings%20atCoderColor.user.js
// @updateURL https://update.greasyfork.org/scripts/423834/Standings%20atCoderColor.meta.js
// ==/UserScript==
 
$(function () {
  // RGBからカラーコードに変換する
  function rgb2hex ( rgb ) {
    return "#" + rgb.map( function ( value ) {
      return ( "0" + value.toString( 16 ) ).slice( -2 ) ;
    }).join( "" ) ;
  }
 
  // 詳細か否か
  let detailmode = 0;
 
  // 表を先頭に追加
  $("#vue-standings").prepend(`<div><button class="btn btn-default" id="colorstanding-detail">詳細に切り替え</button><button class="btn btn-default" id="colorstanding-off">非表示</button><table id="accs-table" class="table table-bordered table-hover th-center td-middle"><thead></thead><tbody></tbody></table></div>`);
 
  // 表の更新
  function update () {
    vueStandings.$watch("standings", function (new_val, old_val) {
      if (!new_val) {
        return;
      }
      let task = new_val.TaskInfo;
      let data = new_val.StandingsData;
 
      let ratecolor = ["#000000", "#666666", "#663300", "#006600", "#009999", "#0000cc", "#cc9900", "#ff9900", "#ff3333"];
      let ratename = ["黒", "灰", "茶", "緑", "水", "青", "黄", "橙", "赤"]
      let ratelist = [1, 400, 800, 1200, 1600, 2000, 2400, 2800, 9999];
 
      if (detailmode == 1){
        ratelist = [1, 33, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 9999];
        ratename = ["0", "1", "33", "100", "200", "300", "400", "500", "600", "700", "800", "900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800", "1900", "2000", "2100", "2200", "2300", "2400", "2500", "2600", "2700", "2800", "2900", "3000", "3100", "3200", "3300", "3400", "3500", "金"];
        ratecolor = ["#000000", "#666666", "#666666", "#666666", "#666666", "#666666", "#663300", "#663300", "#663300", "#663300", "#006600", "#006600", "#006600", "#006600", "#009999", "#009999", "#009999", "#009999", "#0000cc", "#0000cc", "#0000cc", "#0000cc", "#cc9900", "#cc9900", "#cc9900", "#cc9900", "#ff9900", "#ff9900", "#ff9900", "#ff9900", "#ff3333", "#ff3333", "#ff3333", "#ff3333", "#990000", "#990000", "#990000", "#990000", "#461900"];
      }
 
      // コンテスト前とコンテスト後ではjsonの挙動が違う
      let ratingmode = 0;
      for (let cnt = 0; cnt < data.length; cnt++) {
        if (data[cnt]["TotalResult"]["Count"] >= 1) {
          if (data[cnt]["OldRating"] > 0) {
            ratingmode = 1;
            break;
          }
        }
      }
 
      let nowrating = "Rating";
      if (ratingmode == 1) {
        nowrating = "OldRating"
      }
 
      // 参加者一覧の表を作る
      let contestant = [];
      for (let i = 0; i < ratelist.length; i++) {
        contestant.push([]);
      }
 
      // 参加者カウント
      for (let cnt = 0; cnt < data.length; cnt++) {
        for (let color = 0; color < ratelist.length; color++){
          if (data[cnt]["TotalResult"]["Count"] >= 1) {
            if (data[cnt][nowrating] < ratelist[color]) {
              contestant[color].push(cnt);
              break;
            }
          }
        }
      }
 
       // 配列の用意
      var colordata = [];
      for (let i = 0; i < task.length; i++) {
        colordata.push([]);
        for (let j = 0; j < ratelist.length; j++) {
          colordata[i].push(0);
        }
      }
      var colornum = [];
      for (let i = 0; i < ratelist.length; i++) {
        colornum[i] = contestant[i].length;
      }
 
      // 色別の正解数を取得
      for (let colors = 0; colors < contestant.length; colors++) {
        for (let cnt = 0; cnt < task.length; cnt++) {
          let probid = task[cnt].TaskScreenName;
          for (let player = 0; player < contestant[colors].length; player++) {
            try {
              if (data[contestant[colors][player]]["TaskResults"][probid]["Status"] === 1) {
                colordata[cnt][colors] += 1;
              }
            } catch {
              null;
            }
          }
        }
      }
 
      // 表の先頭
      let t = `<tr style="font-weight: bold;"><td align="center">Rate</td><td align="center">参加者数</td>`;
      for (let i = 0; i < task.length; i++) {
        t += `<td align="center">` + task[i].Assignment + `</td>`;
      }
      t += `</tr>`;
 
      // 表の途中
      for (let colors = 0; colors < ratecolor.length; colors++) {
        t += `<tr><td align="center" style="padding: 2px;"><font color="` + ratecolor[colors] + `"><b>` + ratename[colors] + `</b></td><td align="right">` + colornum[colors] + `</td>`;
        for (let i = 0; i < task.length; i++) {
          // 正解率を求める
          let dat = 0;
          if (colornum[colors] != 0) {
            dat = colordata[i][colors] / colornum[colors];
          }
          // 正解率によって背景色を定める
          let targ = 0;
          let cr = 0;
          let cg = 0;
          let cb = 0;
          if (dat >= 0.9) {
            targ = (1-dat)*1000;
            cr = Math.floor(255-targ);
            cg = 255;
            cb = Math.floor(155+targ);
          } else if (dat >= 0.75) {
            targ = (0.9-dat)/1.5*1000;
            cr = 155;
            cg = 255;
            cb = Math.floor(255-targ);
          } else if (dat >= 0.5) {
            targ = (0.75-dat)/2.5*1000;
            cr = Math.floor(155+targ);
            cg = Math.floor(255-targ*0.5);
            cb = 155;
          } else if (dat >= 0.25) {
            targ = (0.5-dat)/2.5*1000;
            cr = Math.floor(255-targ*0.5);
            cg = 205;
            cb = Math.floor(155+targ*0.5);
          } else if (dat >= 0.05) {
            targ = (0.25-dat)/2*1000;
            cr = Math.floor(205-targ*0.5);
            cg = Math.floor(205-targ*0.5);
            cb = Math.floor(205-targ*0.5);
          } else {
            targ = (0.05-dat)/0.5*1000;
            cr = Math.floor(155-targ*0.2);
            cg = Math.floor(155-targ*0.2);
            cb = Math.floor(155-targ*0.2);
          }
          t += `<td align="right" bgcolor="` + rgb2hex( [cr, cg, cb] ) + `">` + (dat*100).toFixed(2) + `%</td>`;
        }
        t += `</tr>`;
      }
 
      $("#accs-table > tbody").empty();
      $("#accs-table > tbody").append(t);
    }, { deep: true, immediate: true });
  }
 
  update();
  document.getElementById("colorstanding-detail").addEventListener("click", () => {
    detailmode = 1 - detailmode
    update();
  });
  document.getElementById("colorstanding-off").addEventListener("click", () => {
    $("#accs-table > tbody").empty();
  });
});