// ==UserScript==
// @name         巴哈姆特快速看帖
// @namespace    
// @version      1.0
// @description  鼠標指向文章標題滑入預覽頁,移開標題就移除,使用注意:需調整預覽頁到完全覆蓋整個標題列
// @author       kater4343587
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @match        https://forum.gamer.com.tw/B.php?*
// @match        https://forum.gamer.com.tw/C.php?*
// @downloadURL https://update.greasyfork.org/scripts/416275/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%BF%AB%E9%80%9F%E7%9C%8B%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/416275/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%BF%AB%E9%80%9F%E7%9C%8B%E5%B8%96.meta.js
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
    $(".BH-menu-forumA-right")
      .parent()
      .append(
        '<li class="BH-menu-forumA-right material-icons bee_plugin_setting"><a><i>developer_mode</i></a></li>'
      );
    //int GM and add setting menu function
    set_GM_();
    ////right click
    //get manager
    try {
      window.url(/B.php/) != null
        ? append_manager_("B")
        : append_manager_("C");
    } catch (e) {}
    //get elements (checkbox)
    try {
      var temp_elements_checkbox = document.getElementsByName("jsn[]");
    } catch (e) {}
    const all_title = document.getElementsByClassName("b-list__main");
    const all_title_link = document.getElementsByClassName(
      "b-list__main__title"
    );
    let temp_matcher;
    let temp_function_add_html;
    //box right click
    if (GM_config.get("add_function") == "是") {
      //add td
      $("<td></td>").insertAfter($(".b-list__filter"));
      for (let $i2 = 0; $i2 < all_title.length; $i2++) {
        //add function btn
        //dark theme
        if ($(".BH-menu__switch-box").hasClass("is-on")) {
          temp_function_add_html = `</td><td style="width: 5.7rem;"><a title="快速瀏覽" class="btn-icon btn-icon--inverse bee_preview"><i class="material-icons bee_preview" style="display:none;">fullscreen</i></a><a class="btn-icon btn-icon--inverse bee_open_new_wd" title="開新視窗" onclick="window.open('${$(
            all_title_link[$i2]
          ).attr(
            "href"
          )}')" ><i class="material-icons bee_open_new_wd" style="display:none;">open_in_new</i></a><a class="btn-icon btn-icon--inverse bee_link" title="複製連結"><i class="material-icons bee_link" id="bee_link_i" style="display:none;">link</i></a>`;
        } else {
          //white theme
          //all_title[$i].outerHTML = all_title[$i].outerHTML + "</td><td style=\"width: 5.7rem;\"><a title=\"快速瀏覽\" class=\"btn-icon btn-icon--inverse bee_preview\"><i class=\"material-icons bee_preview\" style=\"color: rgba(0, 0, 0, 0.4);\">fullscreen</i></a><a class=\"btn-icon btn-icon--inverse bee_open_new_wd\" title=\"開新視窗\" onclick=\"window.open('"  + $(all_title_link[$i]).attr("href") + "')\" ><i class=\"material-icons\" style=\"color: rgba(0, 0, 0, 0.4);\">open_in_new</i></a><a class=\"btn-icon btn-icon--inverse bee_link\" title=\"複製連結\"><i class=\"material-icons bee_link\" id=\"bee_link_i\" style=\"color: rgba(0, 0, 0, 0.4);\">link</i></a>";
          temp_function_add_html = `</td><td style="width: 5.7rem;"><a title="快速瀏覽" class="btn-icon btn-icon--inverse bee_preview"><i class="material-icons bee_preview" style="display:none;color: rgba(0, 0, 0, 0.4);">fullscreen</i></a><a class="btn-icon btn-icon--inverse bee_open_new_wd" title="開新視窗" onclick="window.open('${$(
            all_title_link[$i2]
          ).attr(
            "href"
          )}')" ><i class="material-icons bee_open_new_wd" style="display:none; color: rgba(0, 0, 0, 0.4);">open_in_new</i></a><a class="btn-icon btn-icon--inverse bee_link" title="複製連結"><i class="material-icons bee_link" id="bee_link_i" style="display:none; color: rgba(0, 0, 0, 0.4);">link</i></a>`;
        }
        $(".b-list__main")[$i2].outerHTML =
          $(".b-list__main")[$i2].outerHTML + temp_function_add_html;
      }
    }
    if (GM_config.get("preview_auto") == "是") {
      $(".b-list__main__title").hover(function(e) {
        e.preventDefault();
        bee_able_frame = true;
        $("#bee_frame").attr(
          "src",
          `https://forum.gamer.com.tw/${$(this)
            .parent()
            .parent()
            .find(".b-list__main__title")
            .attr("href")}`
        );
        $("#BH-menu-path").css({
          height: "100%",
          "background-color": "#0e4355cc"
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
    if (
      GM_config.get("new_design") == "是" &&
      window.location.href.match(/B.php/) != null
    ) {
      $(".b-list_ad").css({
        display: "none !important"
      }); //
      $("#BH-wrapper").css({
        width: GM_config.get("new_design_box")
      });
      $("#BH-master").css({
        width: GM_config.get("new_design_box_Left")
      });
      $("#BH-slave").css({
        width: GM_config.get("new_design_box_Right")
      });
    }
    if (
      GM_config.get("new_design_LRSwitch") == "是" &&
      window.location.href.match(/B.php/) != null
    ) {
      $("#BH-master").css({
        float: "right"
      });
      $("#BH-slave").css({
        float: "left"
      });
    }
    for (let $i = 0; $i < all_title.length; $i++) {
      //prevent bug
      try {
        temp_elements_checkbox[$i].checked = false;
      } catch (e) {}

      //add onclick
      //$(".b-list__main")[$i].onclick(function (event) {
      all_title[$i].onclick = function(bar_space) {
        //not trigger if click on title
        if (!$(this).hasClass("b-list__tile")) {
          //disable right-click manager if check a title
          try {
            //is manager = hide menu
            $(".bee_manager").hide();
          } catch (e) {}
          //get inner
          temp_matcher = this.innerHTML;
          //get snA
          temp_matcher = temp_matcher.match(/snA=(\d*)/)[1];
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
    if (GM_config.get("preview_LR") == "靠左") {
      $(".bee_preview_wd").css({
        left: "1%",
        right: ""
      });
    }
    //insert preivew html
    $(".bee_preview_wd").html(
      '<iframe id="bee_frame" title="bee_frame" src="" style="transition: all 0s cubic-bezier(0.21, 0.3, 0.18, 1.37) 0s; border: 1em solid rgb(170, 50, 220, 0);" width="100%" height="100%"></iframe>'
    );
    //setting default top menu css
    $("#BH-menu-path").css({
      transition: "all 0s cubic-bezier(0.21, 0.3, 0.18, 1.37) 0s",
      height: "40px"
    });
    //able frame by btn
    $(".bee_preview").click(function() {
      $("#bee_frame").attr(
        "src",
        `https://forum.gamer.com.tw/${$(this)
          .parent()
          .parent()
          .find(".b-list__main__title")
          .attr("href")}`
      );
      $("#BH-menu-path").css({
        height: "100%",
        "background-color": "#0e4355cc"
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
    $("#BH-menu-path").hover(() => {
      //$(".bee_preview_wd").removeClass("bee_preview_show");
      bee_able_frame = false;
      $(".bee_preview_wd").css({
        width: "0%"
      });
      $("#BH-menu-path").css({
        height: "40px",
        "background-color": "#0e4355"
      });
    });
    //onload frame , show
    $("#bee_frame").on("load", () => {
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
        $("#bee_frame")
          .contents()
          .find(".TOP-bh")
          .html("");
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
        `https://forum.gamer.com.tw/${$(this)
          .parent()
          .parent()
          .find(".b-list__main__title")
          .attr("href")}`
      );
      document.getElementById("bee_link_temp").select();
      document.execCommand("copy");
      $("#bee_link_temp").remove();
    });

    //hover show function pic
    $(".b-list__row").hover(
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
        add_function: {
          label: "標題後方插入功能", // Appears next to field
          type: "radio", // Makes this setting a series of radio elements
          options: ["是", "否"], // Possible choices
          default: "是" // Default value if user doesn't change it
        },
        preview_LR: {
          label: "即時瀏覽視窗的位置", // Appears next to field
          type: "radio", // Makes this setting a series of radio elements
          options: ["靠左", "靠右"], // Possible choices
          default: "靠右" // Default value if user doesn't change it
        },
        preview_size: {
          label: "即時瀏覽視窗的大小", // Appears next to field
          type: "text", // Makes this setting a text field
          default: "75%" // Default value if user doesn't change it
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
          default: "#000000b3" // Default value if user doesn't change it
        },
        new_design_LRSwitch: {
          label: "左右對調（聊天室在左方，讓文章標題在螢幕中間）", // Appears next to field
          type: "radio", // Makes this setting a series of radio elements
          options: ["是", "否"], // Possible choices
          default: "否" // Default value if user doesn't change it
        },
        new_design: {
          label: "自適型版面（根據下方自定比例適應）", // Appears next to field
          type: "radio", // Makes this setting a series of radio elements
          options: ["是", "否"], // Possible choices
          default: "否" // Default value if user doesn't change it
        },
        new_design_box: {
          label: "顯示區域佔比（文章顯示區+聊天室區的整體範圍）", // Appears next to field
          type: "text", // Makes this setting a text field
          default: "80%" // Default value if user doesn't change it
        },
        new_design_box_Left: {
          label: "文章佔比（佔上個設定「顯示區域」範圍內的比例）", // Appears next to field
          type: "text", // Makes this setting a text field
          default: "70%" // Default value if user doesn't change it
        },
        new_design_box_Right: {
          label: "聊天室佔比（佔上方設定「顯示區域」範圍內的比例）", // Appears next to field
          type: "text", // Makes this setting a text field
          default: "25%" // Default value if user doesn't change it
        }
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
        .find("#bee_plugin_setting_field_add_function")
        .css({
          margin: "10px"
        });
      $("#bee_plugin_setting")
        .contents()
        .find("#bee_plugin_setting_field_preview_LR")
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
      $("#bee_plugin_setting")
        .contents()
        .find("#bee_plugin_setting_field_new_design")
        .css({
          margin: "10px"
        });
      $("#bee_plugin_setting")
        .contents()
        .find("#bee_plugin_setting_field_new_design_LRSwitch")
        .css({
          margin: "10px"
        });
      $("#bee_plugin_setting")
        .contents()
        .find("#bee_plugin_setting_field_bee_select_color")
        .css({
          margin: "10px",
          width: "70px"
        });
      $("#bee_plugin_setting")
        .contents()
        .find("#bee_plugin_setting_field_new_design_box")
        .css({
          margin: "10px",
          width: "40px"
        });
      $("#bee_plugin_setting")
        .contents()
        .find("#bee_plugin_setting_field_new_design_box_Left")
        .css({
          margin: "10px",
          width: "40px"
        });
      $("#bee_plugin_setting")
        .contents()
        .find("#bee_plugin_setting_field_new_design_box_Right")
        .css({
          margin: "10px",
          width: "40px"
        });
    });
  }

  function append_manager_(page_code) {
    switch (page_code) {
      case "B": {
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
      case "C": {
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
