// ==UserScript==
// @name         DD救星
// @namespace    Ahoy
// @version      0.3
// @description  幫你一鍵完成每日蓋樓任務
// @author       Me
// @match        https://forum.gamer.com.tw/C.php*
// @require
// @icon         https://media.discordapp.net/attachments/827752633862848555/839168548818911252/image0.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428277/DD%E6%95%91%E6%98%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/428277/DD%E6%95%91%E6%98%9F.meta.js
// ==/UserScript==

//===============================================================編輯以下內容==============================================================
// 巴哈文章html格式參考
// 1.影片:  [div][movie=影片連結貼這裡 width=640 height=360][/div]
// 2.連結:  [div][url=連結貼這裡]連結顯示的文字貼這裡[/url][/div]
// 3.圖片:  [div][img=圖片網址貼這裡][/div]

// 1. 亞美樓, 2. 彩沙樓, 3. 由貴樓, 4. 彩香樓, 5. 樺音樓, 6. 美來樓, 7. あずさ樓, 8. 陽葵樓, 9. 美佑樓, 10. 花凜樓, 11. 萌香樓
  // 以下是推文內容區，請在" "中填入推文內容，不蓋的樓請整行刪掉
let post_content = [
                     " 晚安推推 (¦3[▓▓]" ,        // 1. 亞美樓
                     " 晚安推推 (¦3[▓▓]" ,        // 2. 彩沙樓
                     " 晚安推推 (¦3[▓▓]" ,        // 3. 由貴樓
                     " 晚安推推 (¦3[▓▓]" ,        // 4. 彩香樓
                     " 晚安推推 (¦3[▓▓]" ,        // 5. 樺音樓
                     " 晚安推推 (¦3[▓▓]" ,        // 6. 美來樓
                     " 晚安推推 (¦3[▓▓]" ,        // 7. あずさ樓
                     " 晚安推推 (¦3[▓▓]" ,        // 8. 陽葵樓
                     " 晚安推推 (¦3[▓▓]" ,        // 9. 美佑樓
                     " 晚安推推 (¦3[▓▓]" ,        // 10.花凜樓
                     " 晚安推推 (¦3[▓▓]" ,        // 11.萌香樓
                     "" // array結尾，請不要新增在這行以後
                   ];
   // 以下是圖片區，請在" "中填入圖片網址，不蓋的樓請整行刪掉
     let post_img = [
                     " " ,     // 1. 亞美樓
                     " " ,     // 2. 彩沙樓
                     " " ,     // 3. 由貴樓
                     " " ,     // 4. 彩香樓
                     " " ,     // 5. 樺音樓
                     " " ,     // 6. 美來樓
                     " " ,     // 7. あずさ樓
                     " " ,     // 8. 陽葵樓
                     " " ,     // 9. 美佑樓
                     " " ,     // 10.花凜樓
                     " " ,      // 11.萌香樓
                     "" // array結尾，請不要新增在這行以後
                    ];
   // 以下是影片區，請在" "中填入影片網址，不蓋的樓請整行刪掉
   let post_movie = [
                     " " ,     // 1. 亞美樓
                     " " ,     // 2. 彩沙樓
                     " " ,     // 3. 由貴樓
                     " " ,     // 4. 彩香樓
                     " " ,     // 5. 樺音樓
                     " " ,     // 6. 美來樓
                     " " ,     // 7. あずさ樓
                     " " ,     // 8. 陽葵樓
                     " " ,     // 9. 美佑樓
                     " " ,     // 10.花凜樓
                     " " ,      // 11.萌香樓
                     "" // array結尾，請不要新增在這行以後
                    ];
   // 以下是連結區，請在" "中填入連結網址，不蓋的樓請整行刪掉
     let post_url = [
                     " " ,     // 1. 亞美樓
                     " " ,     // 2. 彩沙樓
                     " " ,     // 3. 由貴樓
                     " " ,     // 4. 彩香樓
                     " " ,     // 5. 樺音樓
                     " " ,     // 6. 美來樓
                     " " ,     // 7. あずさ樓
                     " " ,     // 8. 陽葵樓
                     " " ,     // 9. 美佑樓
                     " " ,     // 10.花凜樓
                     " " ,      // 11.萌香樓
                     "" // array結尾，請不要新增在這行以後
                    ];
   // 以下是大樓連結，可以自行新增，不蓋的樓請整行刪掉
let post_building = [
                     "https://forum.gamer.com.tw/C.php?bsn=60076&snA=5957727" ,    // 1. 亞美樓
                     "https://forum.gamer.com.tw/C.php?bsn=60076&snA=5962818" ,    // 2. 彩沙樓
                     "https://forum.gamer.com.tw/C.php?bsn=60076&snA=5913369" ,    // 3. 由貴樓
                     "https://forum.gamer.com.tw/C.php?bsn=60076&snA=6119543" ,    // 4. 彩香樓
                     "https://forum.gamer.com.tw/C.php?bsn=60076&snA=5935950" ,    // 5. 樺音樓
                     "https://forum.gamer.com.tw/C.php?bsn=60076&snA=4826943" ,    // 6. 美來樓
                     "https://forum.gamer.com.tw/C.php?bsn=60076&snA=6079768" ,    // 7. あずさ樓
                     "https://forum.gamer.com.tw/C.php?bsn=60076&snA=6151202" ,    // 8. 陽葵樓
                     "https://forum.gamer.com.tw/C.php?bsn=60076&snA=6174159" ,    // 9. 美佑樓
                     "https://forum.gamer.com.tw/C.php?bsn=60076&snA=6234939" ,    // 10.花凜樓
                     "https://forum.gamer.com.tw/C.php?bsn=60076&snA=6187851" ,    // 11.萌香樓
                     "" // array結尾，請不要新增在這行以後
                    ];

//===============================================================編輯以上內容==============================================================
for(let x=0;x<post_building.length-1;x++){
    post_content[x] = post_content[x].replace(/(^\s*)|(\s*$)/g, ""); // 前後有純空白字串時, 取代成空字串""
    post_img[x] = post_img[x].replace(/(^\s*)|(\s*$)/g, ""); // 前後有純空白字串時, 取代成空字串""
    post_movie[x] = post_movie[x].replace(/(^\s*)|(\s*$)/g, ""); // 前後有純空白字串時, 取代成空字串""
    post_url[x] = post_url[x].replace(/(^\s*)|(\s*$)/g, ""); // 前後有純空白字串時, 取代成空字串""
}

function getVal(input) {
	return document.getElementsByName(input)[0].value;
}

function reload(){ //重整頁面
        location.reload();
}

function showErrorMsg(input){ //顯示錯誤訊息用
    var msg = input.match(`訊息</h1>
<p>.*</p>`)[0];
    msg = msg.slice(11, msg.length-4);
    toastr.warning(msg);
}

function showSuccessMsg(){ //顯示成功訊息用
    var msg = "推文成功!!! 請完成後再重新整理";
    toastr.success(msg);
}

function showMsg(input){ //顯示訊息用
    toastr.success(input);
}

function post_once(data_list, c_idx){ // 推一則文章
  let push_content = "[div]"+post_content[c_idx]+"[/div]";
  if(post_url[c_idx].length!=0){
    push_content = push_content.concat("[div][url=", post_url[c_idx], "]", post_url[c_idx], "[/url][/div]");
  }
  if(post_img[c_idx].length!=0){
    push_content = push_content.concat("[div][img=", post_img[c_idx],"][/div]");
  }
  if(post_movie[c_idx].length!=0){
    push_content = push_content.concat("[div][movie=", post_movie[c_idx]," width=640 height=360][/div]");
  }
  jQuery.ajax({
        type: "POST",
        data: {
            rtecontent: push_content,
            pwd:    data_list[1 ],
            type:   data_list[2 ],
            code:   data_list[3 ],
            subbsn: data_list[4 ],
            title:  data_list[5 ],
            sign:   data_list[6 ],
            ptype:  data_list[7 ],
            bbsign: data_list[8 ],
            ccsign: data_list[9 ],
            onpost: data_list[10]
        },
        url: data_list[0],
        success: function (rt) {
            if(rt.match(`系統訊息`)!=null){//處理發文失敗
                showErrorMsg(rt);
            }else{
                showSuccessMsg();
            }
        },
        error: function (errMsg) {
            toastr.warning("推文失敗，未知的錯誤。");
        },
    });
}

function auto_post(b_idx){ // 自動推文主函式
    jQuery.ajax({
    type: "GET",
    url: post_building[b_idx],
    success: function (data) {
      let info = jQuery.parseHTML(data);
      let bkgd = info.find((function(bkgd_data){
        return bkgd_data.id === "BH-background";
      }))

      let BH_wrap = bkgd.children[0];
      let BH_mas;
      let post_form;
      for(let x=0;x<BH_wrap.children.length;x++){
        if(BH_wrap.children[x].id==="BH-master"){ // find "BH_master"
           BH_mas = BH_wrap.children[x];
           break;
        }
      }

      for(let x=0;x<BH_mas.children.length;x++){
        if(BH_mas.children[x].name==="frm"){ // find "frm"
           post_form = BH_mas.children[x];
           break;
        }
      }
      let action_cp = post_form.action;
      let pwd_cp = post_form.children[1].value;
      let type_cp = post_form.children[2].value;
      let code_cp = post_form.children[3].value;
      let subbsn_cp = post_form.children[4].value;
      let title_cp = post_form.children[5].value;
      let sign_cp = post_form.children[6].value;
      let bbsign_cp = post_form.children[7].value;
      let ccsign_cp = post_form.children[8].value;
      let onpost_cp = post_form.children[9].value;
      let data_li = [action_cp, pwd_cp, type_cp, code_cp, subbsn_cp, title_cp, sign_cp, bbsign_cp, ccsign_cp, onpost_cp];

      let post_rslt;
      post_rslt = post_once(data_li,b_idx); // 取得發文資訊 推一則文章
    },
    error: function () {
      toastr.warning("取得資料失敗，未知的錯誤。");
    }
  });
}

//---------------------------------------------------

async function DDSavior() {
  console.log(post_building.length-1);
  // 顯示訊息
  let total_length = post_building.length-1;
  let start_msg = "開始蓋樓，總共"+total_length.toString()+"樓"
  showMsg(start_msg);
  // 依序執行
  for (let i = 0; i < post_building.length-1; i++) {
    let range = Math.floor(Math.random()*5+1);
    let rand_timer = 60000 + range*1000;
    await post_cnt(rand_timer, i);
    console.log(i, '執行完畢', rand_timer);
    let fin_msg = "完成第"+i.toString()+"樓";
    showMsg(fin_msg);
  }
  alert("完成所有推文囉!!!");
}

function post_cnt(time, cnt){ // button 呼叫的函式
    return new Promise((resolve, reject) => {
    setTimeout(() => {
      auto_post(cnt);
      resolve('Success');
    }, time);
  });
}



(function() {
    'use strict';
    //建立按鈕
    jQuery(".BH-menu-forumA-right").parent().append("<li class=\"BH-menu-forumA-right material-icons DDSavior\"><a title=\"一鍵蓋樓\"><i>note_add</i></a></li>");
    // jQuery(".DDSavior").click(DDSavior);
    jQuery(".DDSavior").click(DDSavior);
})();