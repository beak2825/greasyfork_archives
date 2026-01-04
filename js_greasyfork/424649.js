// ==UserScript==
// @name          Exhentai better experience
// @namespace discuz
// @description This script will bring a better experience for exhentai
// @include        http*://exhentai.org/*
// @include        http*://e-hentai.org/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @version 1.92
// @downloadURL https://update.greasyfork.org/scripts/424649/Exhentai%20better%20experience.user.js
// @updateURL https://update.greasyfork.org/scripts/424649/Exhentai%20better%20experience.meta.js
// ==/UserScript==

// 默认收藏夹值，修改数字可更改默认收藏夹
var default_favcat = 0

// gallery detail page
if (/\/g\//.test(location.pathname)) {
  // enable tag link
  var xpath = "//div[@class='gt' or @class='gtl']/a[@onclick]";
  var nodes = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  var node = null;
  var index = 0;
  while ((node = nodes.snapshotItem(index))) {
    node.removeAttribute("onclick");
    index++;
  }

  var fav_url = popbase + "addfav"; // popbase is from exhentai js file

  // fav operation without popup
  function fav_post() {
    if (
      $("#favoritelink").find("img").length
    ) {
      $.post(fav_url, {
        favcat: default_favcat,
        favnote: "",
        apply: "Add to Favorites",
        update: "1",
      }).done(function () {
        if (document.getElementById("favoritelink") != undefined) {
          document.getElementById("fav").innerHTML =
            '<div class="i" style="background-image:url(https://exhentai.org/img/fav.png); background-position:0px -2px; margin-left:10px" title="Favorites '+default_favcat+'"></div>';
          document.getElementById("favoritelink").innerHTML = "Favorites " + default_favcat;
        }
      });
    } else {
      $.post(fav_url, {
        favcat: "favdel",
        favnote: "",
        apply: "Apply Changes",
        update: "1",
      }).done(function () {
        if (document.getElementById("favoritelink") != undefined) {
          document.getElementById("fav").innerHTML = "";
          document.getElementById("favoritelink").innerHTML =
            '<img src="https://exhentai.org/img/mr.gif" /> Add to Favorites';
        }
      });
    }
  }

  var gdf_div = document.querySelector("#gdf");
  gdf_div.removeAttribute("onclick");
  gdf_div.addEventListener("click", fav_post, false);

}

// general gallery pages
if (/(\/g\/)|(watched)|(popular)|(favorites)|()/.test(location.pathname)) {

  // global search
  var nb_div = document.querySelector("#nb");

  function createElementFromHTML(htmlString) {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  function global_search() {
    var s_content = document.getElementById("g_search");
    window.location.href = "/?f_search=" + s_content.value + "&advsearch=1&f_sname=on&f_stags=on&f_sh=on&f_spf=&f_spt="; //relative to domain
  }

  var html_string =
      '<p class="nopm"><input type="text" id="g_search" name="g_search" placeholder="Search expunged galleries" size="50" maxlength="200"><input type="submit" id="g_search_btn" value="Apply Filter"></p>';
  var search_bar = createElementFromHTML(html_string);
  nb_div.appendChild(search_bar);

  var g_search_btn = document.querySelector("#g_search_btn");
  g_search_btn.addEventListener("click", global_search, false);
  $("#g_search").keydown(function (e){
    if(e.keyCode == 13){
      global_search();}
  })

  // global search only appears when hovering
  $("#nb").css("transition", "0.2s")
  var global_s_style = "<style>#nb:hover{max-height:47px} #nb { max-height: 47px};</style>";
  $("head").append(global_s_style);

  // quick fav operation, show favcat num
  function fav_post_pages() {
    $('[id*="posted_"]').each(function() {
      var date_div = $(this);
      var favcat_tag_id = date_div.attr("id") + "_favcat"
      var favcat_btn_id = date_div.attr("id")+ "_favbtn"
      var fav_btn_content = `
            <div class="cs ct2" id = ${favcat_btn_id} style="
            position: absolute;
            top: -2px;
            left: -36px;
            width: 30px;
            height: 18px;
            line-height: 18px;
            background: #1c563dcc;
            border-color: #671c17;
            ">` + "收藏" + "</div>";
          // If favoriite, change style, show favcat num
          if (date_div.attr("title")){
            var title = date_div.attr("title")
            var favcat = title.slice(-1)
            var style = date_div.attr("style")
            var border_color = date_div.css("border-color")
            // var background_color = date_div.css("background-color")
            var background_color = border_color
            var style_for_fav1 = "border-color:#e4ee2c;background-color:rgb(70 141 220 / 85%)"
            if (favcat == "0"){background_color="#309427"; border_color="#671c17"; style=style_for_fav1}
            date_div.attr("style", style);
            date_div.attr("title", title);
            var favcat_tag_content = `
                <div class="cs ct2" id = ${favcat_tag_id} style="
                position: absolute;
                top: -2px;
                left: -36px;
                width: 30px;
                height: 18px;
                line-height: 18px;
                background: ${background_color};
                border-color: ${border_color};
                ">fav` + favcat + "</div>";
              date_div.append(favcat_tag_content)
              // debugger;
            } else {
              date_div.append(fav_btn_content)
            }
          var popUpStr = $(this).attr("onclick");
          var fav_url = popUpStr.slice(7, -10);
          $(this).removeAttr("onclick");
          $(this).click(function(){
            if (! $(this).attr("title")) {
              $.post(fav_url, {
                favcat: default_favcat,
                favnote: "",
                apply: "Add to Favorites",
                update: "1",
              }).done(function (data) {
                // debugger;
                var patt_borderColor = /borderColor="(.*?)"/
                var borderColor = patt_borderColor.exec(data)[1];
                var patt_backgroundColor = /backgroundColor="(.*?)"/
                // var backgroundColor = patt_backgroundColor.exec(data)[1];
                var backgroundColor = borderColor
                var patt_title = /title="(.*?)"/
                var title = patt_title.exec(data)[1];
                var favcat = title.slice(-1);
                var style_for_fav1 = "border-color:#e4ee2c;background-color:rgb(70 141 220 / 85%)"

                if (favcat == "0"){backgroundColor="#309427"; borderColor="#671c17"; style=style_for_fav1};

                date_div.attr("style", style_for_fav1);
                date_div.attr("title", title)
                var favcat_tag_content = `
                        <div class="cs ct2" id = ${favcat_tag_id} style="
                        position: absolute;
                        top: -2px;
                        left: -36px;
                        width: 30px;
                        height: 18px;
                        line-height: 18px;
                        background: ${backgroundColor};
                        border-color: ${borderColor};
                        ">fav` + default_favcat + "</div>";
                      date_div.append(favcat_tag_content);
                      $("#"+favcat_btn_id).remove();
                      // debugger;
                    })
                } else {
                  $.post(fav_url, {
                    favcat: "favdel",
                    favnote: "",
                    apply: "Apply Changes",
                    update: "1",
                  }).done(function () {
                    // debugger;
                    date_div.attr("style", "");
                    date_div.attr("title", "");
                    $("#"+favcat_tag_id).remove();
                    date_div.append(fav_btn_content);
                    // debugger;
                  });
                }
            }
                         )
        }
                                 )
    };
  fav_post_pages()
}

// Chinsese translation highlight
var title_path = "//div[contains(@class, 'gl4t')]";
var titles = document.evaluate(
  title_path,
  document,
  null,
  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
  null
);
var title = null;
var idx = 0;
while ((title = titles.snapshotItem(idx))) {
  var titlePatt = /中文|中国|Chinese|中國/
  var text = title.innerText;
  if (titlePatt.test(text)) {
    title.setAttribute("style", "color: #ff8d8d; font-weight: bold;");}
  idx++;
}