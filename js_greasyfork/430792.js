// ==UserScript==
// @name         找樂子快速讀帖
// @namespace    
// @version      1.0
// @description  省時省力看帖,建議先到論壇頂部找developer_mode調整視窗大小適配自己的螢幕,滑鼠移開預覽頁範圍即可關掉
// @author       kater4343587
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @match        https://okfun.org/forum*
// @match        https://okfun.org/thread*
// @downloadURL https://update.greasyfork.org/scripts/430792/%E6%89%BE%E6%A8%82%E5%AD%90%E5%BF%AB%E9%80%9F%E8%AE%80%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/430792/%E6%89%BE%E6%A8%82%E5%AD%90%E5%BF%AB%E9%80%9F%E8%AE%80%E5%B8%96.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
(() => {
  $(() => {
    //refresh mouse
    let BmouseX, BmouseY;
    document.onmousemove = handleMouseMove;

    function handleMouseMove(event) {
      let dot, eventDoc, doc, body, pageX, pageY;

      event = event || window.event; // IE-ism

      if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX =
          event.clientX +
          ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
          ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
        event.pageY =
          event.clientY +
          ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
          ((doc && doc.clientTop) || (body && body.clientTop) || 0);
      }
      BmouseX = event.pageX;
      BmouseY = event.pageY;
    }
//add icon on top
    $("#a_favorite")
      .parent()
      .append(
        '<li class="BH-menu-forumA-right material-icons bee_plugin_setting"><a><i>developer_mode</i></a></li>'
      );
    //int GM and add setting menu function
    //int GM and add setting menu function
    set_GM_();
    ////right click
    //get manager
    try {
      window.location.href.match(/fourm.php/) != null
        ? append_manager_("fourm")
        : append_manager_("thread");
    } catch (e) {}
    //get elements (checkbox)
    try {
      var temp_elements_checkbox = document.getElementsByName("jsn[]");
    } catch (e) {}
    const all_title = document.getElementsByClassName("common");
    const all_title_link = document.getElementsByClassName(
      "xst"
    );
    let temp_matcher;
    let temp_function_add_html;
    //box right click
setTimeout(function(){
    if (GM_config.get("preview_auto") == "是") {
      $(".xst").hover(function(e) {
        e.preventDefault();
        bee_able_frame = true;
        $("#bee_frame").attr(
          "src",
          `https://okfun.org/${$(this)
            .parent()
            .parent()
            .find(".xst")
            .attr("href")}`
        );
        $(".t9_bg01").css({
          height: "100%",
          "background-color": "black"
        });
        //instant show
        if (GM_config.get("preview_wait_load") == "否") {
          $(".bee_preview_wd").css({
            width: GM_config.get("preview_size")
            //"max-width": "1287px"
          });
        }
        return false;
      });
    }
},750);


    for (let $i = 0; $i < all_title.length; $i++) {
      //prevent bug
      try {
        temp_elements_checkbox[$i].checked = false;
      } catch (e) {}

      //add onclick
      //$(".b-list__main")[$i].onclick(function (event) {
      all_title[$i].onclick = function(bar_space) {
        //not trigger if click on title
        if (!$(this).hasClass("tbody")) {
          //disable right-click manager if check a title
          try {
            //is manager = hide menu
            $(".bee_manager").hide();
          } catch (e) {}
          //get inner
          temp_matcher = this.innerHTML;
          //get snA
          temp_matcher = temp_matcher.match(/forum/)[1];
          for (let i2 = 0; i2 < temp_elements_checkbox.length; i2++) {
            if (temp_elements_checkbox[i2].value == temp_matcher) {
              if (temp_elements_checkbox[i2].checked) {
                temp_elements_checkbox[i2].checked = false;
                $(this).css({
                  "background-color": ""
                });
                //$(this).css({"background-image":"linear-gradient(45deg,transparent 100%,hsla(48,20%,90%,1) 45%,hsla(48,20%,90%,1) 100%,transparent 0)"});
              } else {
                temp_elements_checkbox[i2].checked = true;
                //$(this).css({"border-style":"solid"});
                $(this).css({
                  "background-color": GM_config.get("bee_select_color")
                });
                /*$(this).css({"background-image":"linear-gradient(45deg,transparent 45%,hsla(48,20%,90%,1) 45%,hsla(48,20%,90%,1) 55%,transparent 0)",
                                                                         "background-size": "1em 1em",
                                                                         "-webkit-background-clip": "text",
                                                                         "-webkit-text-fill-color": "transparent",
                                                                         "-webkit-text-stroke": "2px #111"
                                                                        });*/
              }
            }
          }
        }
      };
      //right click (*only on element)
      all_title[$i].oncontextmenu = () => {
        const temp_scroll =
          window.scrollY ||
          window.scrollTop ||
          document.getElementsByTagName("html")[0].scrollTop;
        $(".bee_manager").css({
          left: `${BmouseX}px`,
          top: `${BmouseY - temp_scroll}px`
        });
        $(".bee_manager").show();
        //right click return
        return false;
      };
      //end for loop
    }
    //add preview window
    $("body").append(
      '<div class="bee_preview_wd" style="height: 100%;width: 0rem;z-index: 100;position: fixed; top: 1rem; right: 1%;transition: all 0s cubic-bezier(0.21, 0.3, 0.18, 1.37) 0s;"></div>'
    );

    //insert preivew html
    $(".bee_preview_wd").html(
      '<iframe id="bee_frame" title="bee_frame" src="" style="transition: all 0s cubic-bezier(0.21, 0.3, 0.18, 1.37) 0s; border: 1em solid rgb(170, 50, 220, 0);" width="100%" height="100%"></iframe>'
    );
    //setting default top menu css
    $(".t9_bg01").css({
      transition: "all 0s cubic-bezier(0.21, 0.3, 0.18, 1.37) 0s",
      height: "40px"
    });
    //able frame by btn
    $(".bee_preview").click(function() {
      $("#bee_frame").attr(
        "src",
        `https://okfun.org/${$(this)
          .parent()
          .parent()
          .find(".xst")
          .attr("href")}`
      );
      $(".t9_bg01").css({
        height: "100%",
        "background-color": "black"
      });
      //instant show
      if (GM_config.get("preview_wait_load") == "否") {
        $(".bee_preview_wd").css({
          width: GM_config.get("preview_size")
          //"max-width": "1287px"
        });
      }
    });
    //disable frame by click
    var bee_able_frame = false;
    $(".t9_bg01").hover(() => {
      //$(".bee_preview_wd").removeClass("bee_preview_show");
      bee_able_frame = false;
      $(".bee_preview_wd").css({
        width: "0%"
      });
      $(".t9_bg01").css({
        height: "40px",
        "background-color": "#fff"
      });
    });
    $(".t9_bg01").click(() => {
      //$(".bee_preview_wd").removeClass("bee_preview_show");
      bee_able_frame = false;
      $(".bee_preview_wd").css({
        width: "0%"
      });
      $(".t9_bg01").css({
        height: "40px",
        "background-color": "#fff"
      });
    });
    //onload frame , show
    $("#bee_frame").on("load", () => {
        var h1 = window.parent.frames[1].document.getElementByClassName('logoimg');
        //var h2 = window.parent.frames[1].document.getElementById('toptb');
        $("H2.logoimg",h1).remove();
        //$("#toptb",h2).remove();
      if (
        $("#bee_frame").attr("src") != "" &&
        bee_able_frame
        //$("#BH-menu-path").css("height") > "100px"
      ) {
        //$("#bee_frame").contents().find("#BH-menu-path").html(" ");
        $(".bee_preview_wd").css({
          width: GM_config.get("preview_size")
          //"max-width": "1287px"
        });
        
         
        /*$("#bee_frame").contents().find(".c-fixed--header").css({
                                    "top": "0px"
                            });
                            $("#bee_frame").contents().find("#bh-banner").css({
                                    "height": "0%"
                            });*/
      }
    });
    //copy link
    $(".bee_link").click(function() {
      let temp_scroll =
        window.scrollY ||
        window.scrollTop ||
        document.getElementsByTagName("html")[0].scrollTop;
      temp_scroll = BmouseY - temp_scroll;
      $("#bee_link_temp").remove();
      $(this).append('<input type="text" id="bee_link_temp">');
      $("#bee_link_temp").val(
        `https://okfun.org/${$(this)
          .parent()
          .parent()
          .find(".xst")
          .attr("href")}`
      );
      document.getElementById("bee_link_temp").select();
      document.execCommand("copy");
      $("#bee_link_temp").remove();
    });

    //hover show function pic
    $("#tbody").hover(
      function() {
        $(this)
          .find(".bee_preview")
          .css({
            display: ""
          });
        $(this)
          .find(".bee_open_new_wd")
          .css({
            display: ""
          });
        $(this)
          .find(".bee_link")
          .css({
            display: ""
          });
      },
      function() {
        $(this)
          .find(".bee_preview")
          .css({
            display: "none"
          });
        $(this)
          .find(".bee_open_new_wd")
          .css({
            display: "none"
          });
        $(this)
          .find(".bee_link")
          .css({
            display: "none"
          });
      }
    );
  });

  function set_GM_() {
    const frame = document.createElement("div");
    document.body.appendChild(frame);
    GM_config.init({
      id: "bee_plugin_setting",
      title: "各項設定", // Panel Title
      // Fields object
      fields: {
        preview_size: {
          label: "即時瀏覽視窗的大小", // Appears next to field
          type: "text", // Makes this setting a text field
          default: "65%" // Default value if user doesn't change it
        },
        preview_auto: {
          label: "一律即時瀏覽（覆寫文章換頁）", // Appears next to field
          type: "radio", // Makes this setting a series of radio elements
          options: ["是", "否"], // Possible choices
          default: "是" // Default value if user doesn't change it
        },
        preview_wait_load: {
          label: "即時瀏覽：是否等待載入完成才跳出顯示", // Appears next to field
          type: "radio", // Makes this setting a series of radio elements
          options: ["是", "否"], // Possible choices
          default: "否" // Default value if user doesn't change it
        },
        bee_select_color: {
          label: "勾選文章時的顏色（可含有透明度屬性）", // Appears next to field
          type: "text", // Makes this setting a text field
          default: "#fff" // Default value if user doesn't change it
        },

      },
      frame // Element used for the panel
    });
    $(".bee_plugin_setting").click(() => {
      GM_config.open();

      $("#bee_plugin_setting").css({
        position: "fixed",
        right: "1%",
        left: "auto",
        height: "auto",
        width: "auto"
      });
      $("#bee_plugin_setting")
        .contents()
        .find("#bee_plugin_setting_header")
        .css({
          margin: "10px"
        });
      $("#bee_plugin_setting")
        .contents()
        .find(".field_label")
        .css({
          margin: "10px"
        });
      $("#bee_plugin_setting")
        .contents()
        .find("#bee_plugin_setting_field_preview_auto")
        .css({
          margin: "10px"
        });
      $("#bee_plugin_setting")
        .contents()
        .find("#bee_plugin_setting_field_preview_size")
        .css({
          margin: "10px",
          width: "40px"
        });
      $("#bee_plugin_setting")
        .contents()
        .find("#bee_plugin_setting_field_preview_wait_load")
        .css({
          margin: "10px"
        });
      });
  }

  function append_manager_(page_code) {
    switch (page_code) {
      case "forum": {
        $(".managertools").append(
          `<div class="b-manager managertools bee_manager" style="z-index: 100;position: fixed; width: auto;"><div class="checkbox"></div><label for="check"></label><div class="bee" style="padding: 5px;">${
            $(".managertools").find("button")[0].outerHTML
          }${$(".managertools").find("button")[3].outerHTML}${
            $(".managertools").find("button")[7].outerHTML
          }</div><div class="bee" style="padding: 5px;"> ${
            $(".managertools").find("button")[2].outerHTML
          }${
            $(".managertools").find("button")[4].outerHTML
          }</div><div class="bee" style="padding: 5px;">${
            $(".managertools").find("button")[1].outerHTML
          }${
            $(".managertools").find("button")[8].outerHTML
          }</div><div class="bee" style="padding: 5px;">${
            $(".managertools").find("button")[5].outerHTML
          }${$(".managertools").find("button")[6].outerHTML}</div></div>`
        );
        //get_manage_bar[0].innerHTML = "<div class='checkbox'></div><label for='check'></label><div class='bee' style='padding: 5px;'>  <button class='btn--sm btn--ghost' onclick='del()'>刪除</button>  <button class='btn--sm btn--ghost' onclick='lock()'>鎖定</button>  <button class='btn--sm btn--ghost' onclick='move_sub()'>修改子板</button></div><div class='bee' style='padding: 5px;'>  <button class='btn--sm btn--ghost' onclick='settop()'>置頂</button>  <button class='btn--sm btn--ghost' onclick='gather()'>收精華</button></div><div class='bee' style='padding: 5px;'>  <button class='btn--sm btn--ghost' onclick='recover()'>回復刪除</button>  <button class='btn--sm btn--ghost' onclick='rm()'>移除精M圖</button></div><div class='bee' style='padding: 5px;'>  <button class='btn--sm btn--ghost' onclick='location.href='listtype.php?stype=5&amp;bsn=04220&amp;subbsn=0''>刪文模式</button>  <button class='btn--sm btn--ghost' onclick='location.href='listtype.php?stype=10&amp;bsn=04220''>正常模式</button></div></div>";
        $(".bee_manager").css({
          position: "fixed",
          width: "auto"
        });
        break;
      }
      case "thread": {
        //$(".managertools").append("<div class=\"c-section__main managertools bee_manager\" style=\"position: fixed; top: 17rem; width: auto; right: 10px;\"><div class=\"checkbox\"><input type=\"checkbox\" id=\"allPost\" onclick=\"jQuery('input[name^=jsn]').prop('checked', this.checked)\"><label for=\"allPost\"><span>全選</span></label></div><div class=\"bee\" style=\"padding-top:5px\">"+$(".managertools").find("button")[0].outerHTML+ $(".managertools").find("button")[3].outerHTML+$(".managertools").find("button")[4].outerHTML+"</div><div class=\"bee\" style=\"padding-top:5px;padding-bottom:5px;\">"+$(".managertools").find("button")[6].outerHTML+$(".managertools").find("button")[5].outerHTML+$(".managertools").find("button")[2].outerHTML+"</div>"+$(".managertools").find("button")[1].outerHTML+"<button type=\"button\" class=\"btn--sm btn--ghost bee_edit_parent\" onclick=\"window.open(move_article_sub.php?bsn="+ document.body.outerHTML.match(/post2.php\?bsn=(\d*)/)[1]+ "&jsn[]=" + document.body.outerHTML.match(/snA=(\d*)/)[1] +",'_blank','width=480,height=480,location=no,menubar=no,scrollbars=yes')\">修改子板</button></div>");
        $(".managertools")
          .append(
            `<div class="c-section__main managertools bee_manager" style="z-index: 100;position: fixed; top: 17rem; width: auto; right: 10px;"><div class="checkbox"><input type="checkbox" id="allPost" onclick="jQuery('input[name^=jsn]').prop('checked', this.checked)"><label for="allPost"><span>全選</span></label></div><div class="bee" style="padding-top:5px">${
              $(".managertools").find("button")[0].outerHTML
            }${$(".managertools").find("button")[3].outerHTML}${
              $(".managertools").find("button")[4].outerHTML
            }</div><div class="bee" style="padding-top:5px;padding-bottom:5px;">${
              $(".managertools").find("button")[6].outerHTML
            }${$(".managertools").find("button")[5].outerHTML}${
              $(".managertools").find("button")[2].outerHTML
            }</div>${
              $(".managertools").find("button")[1].outerHTML
            }<button type="button" class="btn--sm btn--ghost bee_edit_parent btn--addon-move-bsn1">修改子板</button></div>`
          )
          .ready(() => {
            //css float
            $(".bee_manager").css({
              position: "fixed",
              top: "17rem",
              width: "auto",
              right: "10px",
              float: "right",
              textAlign: "left"
            });
            $(".btn--ghost").css({
              marginRight: "5px"
            });

            $(".bee_edit_parent").click(() => {
              /*$("#bee_frame").attr(
              "src",
              `https://forum.gamer.com.tw/move_article_sub.php?bsn=${
                document.body.outerHTML.match(/post2.php\?bsn=(\d*)/)[1]
              }&jsn[]=${document.body.outerHTML.match(/snA=(\d*)/)[1]}`
            );*/
              move_sub();
              /*$("#BH-menu-path").css({
              height: "100%",
              "background-color": "#0e4355cc"
            });*/
            }); //bee_edit_parent_fun;
          });


        break;
      }
      default:
        break;
    }
  }
})();
