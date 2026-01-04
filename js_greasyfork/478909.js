// ==UserScript==
// @name        pss0310 - 10086.cn
// @namespace   Violentmonkey Scripts
// @match       https://wap.sc.10086.cn/scmccMiniWap/pandagame/pinsu0310/index.html
// @grant       GM_getValue
// @version     1.0.0
// @author      lg8294
// @description 2023/10/25 14:38:15
// @license      GPL-3.0 License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/478909/pss0310%20-%2010086cn.user.js
// @updateURL https://update.greasyfork.org/scripts/478909/pss0310%20-%2010086cn.meta.js
// ==/UserScript==
console.log("UserScript Start");

var gameManager = (function () {
  var gameOptions = {
      gameTime: 15 * 1000,
      gameTimeInterval: null,
      remaTime: 0,
      startTime: 0,
      type: 0, //游戏状态 0=准备完成 1=游戏进行中 -1=游戏暂停
      clickTime: undefined,
    },
    gameStarting = false,
    gameScore = 0,
    starInterval,
    starOptions = {
      minSize: 2,
      maxSize: 150,
      newOn: 200,
      flakeColor: "#FFFFFF",
    },
    documentHeight = $(document).height(),
    documentWidth = $(document).width();
  //星星开始掉落
  function starStart() {
    //先加载有的
    $(".game .star").each(function (i, v) {
      addStar(v);
    });
    //再开始生成新的
    starInterval = setInterval(function () {
      addStar();
    }, starOptions.newOn);

    //生成星星
    function addStar(item) {
      var obj;
      if (item) {
        //原先的
        obj = $(item);
      } else {
        //新的
        var startPositionLeft = Math.random() * (documentWidth + 100) - 100,
          startOpacity = 0.5 + Math.random(),
          sizeFlake =
            starOptions.minSize +
            Math.random() * (starOptions.maxSize - starOptions.minSize);
        obj = $('<div class="star"><div class="bg_star"></div></div>')
          .css({
            position: "fixed",
            top: "-1.2rem",
            zIndex: "-1",
            left: startPositionLeft,
            opacity: startOpacity,
            fontSize: sizeFlake,
            color: starOptions.flakeColor,
          })
          .appendTo(".game");
      }
      var endPositionTop = documentHeight - 40,
        endPositionLeft = Math.random() * (documentWidth + 100) - 100,
        durationFall = documentHeight * 3 + Math.random() * 5000;
      obj.animate(
        //增加雪花动态效果
        {
          top: endPositionTop,
          left: endPositionLeft,
          opacity: 0.2,
        },
        durationFall,
        "swing",
        function () {
          $(this).remove();
        }
      );
    }
  }

  //星星暂停
  function starPause() {
    if (starInterval) {
      clearInterval(starInterval);
    }
    //停止星星下落
    $(".game .star").stop(true, false);
  }

  //星星停止
  function starTop() {
    if (starInterval) {
      clearInterval(starInterval);
    }
    $(".game .star").remove();
  }

  //游戏开始
  function gameStart() {
    if (gameStarting) {
      return;
    }
    gameStarting = true;
    if (gameOptions.type == 0) {
      gameReset();
      $(".game").addClass("dn");
      $(".game_start").removeClass("dn");
      $(".countdown").removeClass("dn");
      //礼花
      lottie.loadAnimation({
        container: $(".countdown_fireworks")[0],
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "./json/countdown_fireworks.json",
      });
      //倒计时
      lottie
        .loadAnimation({
          container: $(".countdown_count")[0],
          renderer: "svg",
          loop: false,
          autoplay: true,
          path: "./json/countdown_count.json",
        })
        .addEventListener("complete", function () {
          if (document.visibilityState === "visible") {
            startImpl();
          } else {
            gameOptions.type = 1;
            gamePause();
          }
        });
    } else if (gameOptions.type == -1) {
      startImpl();
    } else {
      gameStarting = false;
    }

    function startImpl() {
      gameStarting = false;
      gameOptions.type = 1;
      gameOptions.startTime =
        new Date().getTime() - (gameOptions.gameTime - gameOptions.remaTime);
      $(".countdown").addClass("dn");
      $(".game").removeClass("dn");
      gameOptions.gameTimeInterval = setInterval(function () {
        gameOptions.remaTime =
          gameOptions.gameTime - (new Date().getTime() - gameOptions.startTime);
        updateGameView();
        if (
          gameOptions.clickTime &&
          new Date().getTime() - gameOptions.clickTime >= 50
        ) {
          stopClickAnimation();
        }
        if (gameOptions.remaTime <= 0) {
          gameStop();
        }
      }, 50);
      starStart();

      //点击
      $(".game_click").on("click", function () {
        clickcode("game_click", "游戏界面_点我按钮");
        if (gameOptions.remaTime <= 0) {
          return;
        }
        gameScore++;
        gameScore =
          gameMaxScore > 0 ? Math.min(gameMaxScore, gameScore) : gameScore;
        gameOptions.clickTime = new Date().getTime();
        $(".light").removeClass("dn"); //光效
        $(".click_mebg").addClass("dn");
        $(".click_img").addClass("big1").css("bottom", "4.1rem");
        //是否播放声音
        if ($(".music_bg").hasClass("active")) {
          // var audio = document.getElementById('game_audio');
          // audio.currentTime = 0.0;
          // audio.play();
        }
        updateGameView();
      });
    }
  }

  //停止按钮动画
  function stopClickAnimation() {
    $(".light").addClass("dn"); //光效
    $(".click_mebg").removeClass("dn");
    $(".click_img").css("bottom", "4.2rem");
  }

  //更新游戏界面
  function updateGameView() {
    //倒计时
    $(".game_bottom .time_Sod").text(
      Math.max(gameOptions.remaTime / 1000, 0).toFixed(2)
    );
    //分数
    $(".game_bottom .score_Sod").text(gameScore);
    //加油文字
    if (gameOptions.remaTime < 2000) {
      $(".game_text_src").addClass("dn").eq(3).removeClass("dn");
    } else if (gameOptions.remaTime < 5000) {
      $(".game_text_src").addClass("dn").eq(2).removeClass("dn");
    } else if (gameOptions.remaTime < 8000) {
      $(".game_text_src").addClass("dn").eq(1).removeClass("dn");
    } else {
      $(".game_text_src").addClass("dn").eq(0).removeClass("dn");
    }
  }

  //游戏暂停
  function gamePause() {
    if (gameOptions.type === 1) {
      gameOptions.type = -1;
      clearInterval(gameOptions.gameTimeInterval);
      starPause();
      stopClickAnimation();
      $(".game_click").off("click");
    }
  }

  //游戏结束
  function gameStop() {
    if (gameOptions.type === 1) {
      gameOptions.type = 0;
      clearInterval(gameOptions.gameTimeInterval);
      $(".game_click").off("click");
      $(".game_audio").remove();
      starTop();
      stopClickAnimation();
      $(".countdown_fireworks, .countdown_count").html("");

      showDialog("game_over");
      setTimeout(function () {
        if (gameNumber > 0) {
          getSaveNumber(gameCode, saveGameLog, function () {
            showMsg("游戏记录保存异常，即将回到首页", 2500);
            setTimeout(function () {
              hideDialog("game_over");
              $(".game_start").addClass("dn");
            }, 2500);
          });
        } else {
          hideDialog("game_over", true);
          show403Dialog(true);
        }
      }, 1200);
    }
  }

  function gameReset() {
    gameScore = 0;
    gameOptions.remaTime = gameOptions.gameTime;
  }

  //游戏重新开始(暂停后再开始)
  function gameRestart() {
    if (gameOptions.type === -1) {
      gameStart();
    }
  }

  //保存游戏记录
  function saveGameLog(randomNum,callback) {
    extAjax({
      url:
        "/scmccMiniWap/padgame/saveGameLog/" + getAddUrl(gameScore, randomNum),
      data: {
        gameCode: gameCode,
      },
      success: function (data) {
        if (data.code == 0) {
          var obj = data.obj;
          if (obj.doubleIt > 1) {
            $(".game_dialog1 .fenshu").text(obj.baseScore + "分");
            $(".game_dialog1 .doubleIt_title").text(
              obj.doubleIt + "倍额外奖励"
            );
            $(".game_dialog1 .doubleIt").text("X" + obj.doubleIt + "倍");
            $(".game_dialog1 .finalScore").text(obj.finalScore + "分");
            hideDialog("game_over", true);
            showDialog("game_dialog1", true);
          } else {
            $(".game_max .unmultiples .fenshu").text(obj.finalScore + "分");
            $(".game_max .unmultiples").removeClass("dn");
            $(".game_max .on_chance").addClass("dn");
            hideDialog("game_over", true);
            showDialog("game_max", true);
          }
          maxScore = Math.max(maxScore, obj.finalScore);
          gameNumber--;
          updatePage();
          if(typeof callback == "function"){
            callback(obj)
          }
        } else if (data.code == 403) {
          hideDialog("game_over", true);
          show403Dialog(true);
        } else if (data.code == 402) {
          hideDialog("game_over", true);
          showDialog("not_zige", true);
        } else if (data.code == 504) {
          showMsg("页面已更新，即将重新进入页面");
          setTimeout(function () {
            cleanCacheReplace();
          }, 2000);
        } else {
          showMsg(data.info, 2000);
          setTimeout(function () {
            hideDialog("game_over");
            $(".game_start").addClass("dn");
          }, 2000);
        }
      },
      error: function () {
        showMsg("游戏记录保存异常，即将回到首页", 2500);
        setTimeout(function () {
          hideDialog("game_over");
          $(".game_start").addClass("dn");
        }, 2500);
      },
    });
  }

  function myGameStop(score,callback) {
    gameScore = score;
    function mySaveGameLog(d) {
      console.log(arguments);
      saveGameLog(d,callback);
    }
    getSaveNumber(gameCode, mySaveGameLog, function () {
      showMsg("游戏记录保存异常");
    });
  }
  return {
    start: gameStart,
    pause: gamePause,
    restart: gameRestart,
    myGameStop: myGameStop,
  };
})();


(function () {
  let context = {
    score: GM_getValue("score", 150), // 分数
    count: 0, // 已执行次数
    maxCount: GM_getValue("maxCount", 10), // 最大执行次数
    interval: GM_getValue("interval", 25000), // 25s 执行一次
    currentInterval: null,
    timeout: GM_getValue("timeout", 600000), // 10 minute 超时
    currentTimer: null,
    button: null,
    running: false,
  };

  /**
   * 保存游戏记录
   * @param {Number} score 分数
   * @param {Function} callback 成功回调
   */
  function saveGameLog(score, callback) {
    // callback('test');
    // return;
    gameManager.myGameStop(150,callback);
  }

  /**
   * 开始运行
   */
  function start() {
    if (context.running) return;
    context.running = true;
    context.button.innerText = "Stop";
    // 先保存一次
    saveGameLog(context.score, function (log) {
      context.count++;
      console.log("完成", context.count, "次");
      console.log(log);
      checkFinish();
    });
    context.currentInterval = setInterval(function () {
      saveGameLog(context.score, function (log) {
        context.count++;
        console.log("完成", context.count, "次");
        console.log(log);
        checkFinish();
      });
    }, context.interval);

    // 超时后，停止
    context.currentTimer = setTimeout(stop, context.timeout);
  }

  function checkFinish() {
    if (context.count >= context.maxCount) {
      stop();
    }
  }

  /**
   * 停止运行
   */
  function stop() {
    if (!context.running) return;
    if (context.currentInterval != null) {
      clearInterval(context.currentInterval);
      context.currentInterval = null;
    }
    if (context.currentTimer != null) {
      clearTimeout(context.currentTimer);
      context.currentTimer = null;
    }
    context.running = false;
    context.button.innerText = "Restart";
    console.log("执行结束了,总共执行", context.count, "次");
  }

  /**
   * 创建UI
   */
  function createElement() {
    // 添加执行按键
    var button = document.createElement("div");
    button.id = "lg_start";
    button.innerText = "Start";
    button.style = `
      font-size: 44px;
      position: fixed;
      top: 50vh;
      color: #fff;
      background: #0007;
      margin: 8px;
      padding: 8px;
      border-radius: 8px;
      z-index: 1000;
      font-family: ui-monospace;
    `;
    button.addEventListener("click", function () {
      if (context.running) {
        stop();
      } else {
        start();
      }
    });
    document.lastChild.appendChild(button);
    context.button = button;
  }

  createElement();
})();

console.log("UserScript End");
