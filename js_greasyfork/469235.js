// ==UserScript==
// @name         贪吃蛇_By_chunqiu
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  进去挂机即可
// @author       春秋，wechat：chunqiu031
// @match        https://play.ordz.games/inscription/2e988961208c9d93d9eed5dbc1c51476533ca97c355af45d290c33a8f1fc3c10i0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469235/%E8%B4%AA%E5%90%83%E8%9B%87_By_chunqiu.user.js
// @updateURL https://update.greasyfork.org/scripts/469235/%E8%B4%AA%E5%90%83%E8%9B%87_By_chunqiu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var iframe = document.getElementById('gameFrame');
        console.log("尝试注入", iframe);
        if (iframe) {
            try {
                var iframeWindow = iframe.contentWindow;
                var iframeDocument = iframe.contentDocument || iframeWindow.document;

                var script = iframeDocument.createElement('script');
                script.textContent = `
                window._gameInstance = (function () {
                    let gameInstance = null;
                    let snakeInstance = null;
                
                    const defaultSnakeMoveSpeed = 80;
                    const gameData = {
                      score: 0,
                      foodCount: 0,
                      playTime: 0,
                      operateCount: 0,
                      snakeMoveSpeed: defaultSnakeMoveSpeed,
                      snakeMoveSpeedTimer: null,
                      eValue: '',
                      ac: '',
                      uid: '',
                      dataUrl: '',
                    };
                
                    const gameUtils = {
                      renderBorder(){
                        let gameContent = document.querySelector('.game-content');
                        let boxSize = 3;
                        let size = 450/10/boxSize;
                        for(let i=1; i<size; i++){
                          let renderHorizontalBox = document.createElement('div');
                          renderHorizontalBox.style.top = \`\${i*boxSize*10}px\`;
                          renderHorizontalBox.classList.add('horizontal');
                          let renderVerticalBox = document.createElement('div');
                          renderVerticalBox.style.left = \`\${i*boxSize*10}px\`;
                          renderVerticalBox.classList.add('vertical');
                
                          gameContent.appendChild(renderHorizontalBox);
                          gameContent.appendChild(renderVerticalBox);
                        };
                      },
                      // 调整速度
                      checkSnakeMoveSpeed(){
                        if(gameData.foodCount == 5){
                          gameData.snakeMoveSpeed = 50;
                          
                          clearInterval(gameData.snakeMoveSpeedTimer);
                          gameData.snakeMoveSpeedTimer = setInterval(function () {
                            snakeInstance.move();
                          }, gameData.snakeMoveSpeed);
                        }
                      },
                      updateScore(){
                        var valueDiv = document.getElementById("score");
                        let stringScore = String(gameData.score);
                        let scoreValue = '';
                        for(let i = 0; i < 5-stringScore.length; i++){
                          scoreValue += '0';
                        }
                        valueDiv.innerHTML = \`\${scoreValue}\${gameData.score}\`;
                      },
                      updateOperate(){
                        return;
                        var valueDiv = document.querySelector('.header #operate');
                        let stringOperate = String(gameData.operateCount);
                        let operateValue = '';
                        for(let i = 0; i < 5-stringOperate.length; i++){
                          operateValue += '0';
                        }
                        valueDiv.innerHTML = \`\${operateValue}\${gameData.operateCount}\`;
                      },
                      updateFoodCount(){
                        var valueDiv = document.querySelector('.header #food');
                        let stringValue = String(gameData.foodCount);
                        let renderalue = '';
                        for(let i = 0; i < 2-stringValue.length; i++){
                          renderalue += '0';
                        }
                        valueDiv.innerHTML = \`\${renderalue}\${gameData.foodCount}\`;
                      },
                      playTimeTimer: null,
                      startPlayTime(){
                        clearInterval(this.playTimeTimer);
                        this.playTimeTimer = setInterval(() => {
                          gameData.playTime += 1;
                          this.formatTime(gameData.playTime);
                        }, 1000);
                      },
                      formatTime(timestamp){
                        let timeDom = document.querySelector('.header #time');
                        let minute = Math.floor(timestamp / 60);
                        let second = timestamp % 60;
                        timeDom.innerHTML = \`\${minute>=10 ? minute : '0'+minute}:\${second>=10 ? second : '0'+second}\`;
                      },
                      // 创建截图
                      _createScreenshot(){
                        var node = document.querySelector('.snake-content .actual-region');
                        let _this = this;
                        domtoimage.toPng(node, { quality: 1.0, magnification: 0.5, bgcolor: '#000' }).then(function (dataUrl) {
                          console.log('dataUrl=>>>', dataUrl);
                          if(dataUrl.indexOf('base64,')){
                            dataUrl = dataUrl.split('base64,')[1];
                          }
                          gameData.dataUrl = dataUrl || ''
                          // _this.setPassword(dataUrl || '');
                        })
                      },
                      setPassword (_p){
                        let ac = window.btoa(\`\${gameData.eValue}-b-\${gameData.score}-b-\${gameData.foodCount}-b-\${gameData.playTime}-b-\${gameData.uid}-b-\${this.getLocalTime(0)}-b-\${_p}-b-ordz-snake\`);
                        let b = (Math.random() + 1).toString(36).substring(2, 8);
                        let c = (Math.random() + 1).toString(36).substring(2, 6);
                        gameData.ac = ac = \`\${ac.slice(0,8)}\${b}\${ac.slice(8,13)}\${c}\${ac.slice(13)}\`;
                        console.log('token=>>>', \`\${gameData.eValue}-b-\${gameData.score}-b-\${gameData.foodCount}-b-\${gameData.playTime}-b-\${gameData.uid}-b-\${this.getLocalTime(0)}-b-\${_p}-b-ordz-snake\`);
                        const tokenDom = document.querySelector('.replay-content #token-input');
                        tokenDom.innerText = ac;
                        try {
                          // 发送token
                          window.parent.postMessage({target : 'game-token', data: {
                            value: ac
                          }}, '*');
                        } catch (error) {}
                
                        try {
                          // 发送邮箱
                          window.parent.postMessage({target : 'game-email', data: {
                            value: gameData.eValue
                          }}, '*');
                        } catch (error) {}
                
                        // 发送游戏状态
                        window.submitPlayerRecord({
                          type: 'success',
                          email: gameData.eValue,
                          score: gameData.score,
                          token: gameData.uid
                        })
                
                      },
                      // get utc0 timestamp
                      getUtcTime(len, i){
                        var D = new Date();
                        if(len){
                          D = new Date(len);
                        }
                        len = D.getTime();
                        var offset = D.getTimezoneOffset() * 60000;
                        var utcTime = len + offset;
                        let time = new Date(utcTime + 3600000 * i);
                        return time;
                      },
                      getLocalTime(i){
                        let time = this.getUtcTime('', i);
                        let m = time.getMonth()+1;
                        let d = time.getDate();
                        let str = \`\${time.getFullYear()}-\${m>10 ? m : '0'+m}-\${d+1>10 ? d : '0'+d}\`;
                        return str;
                      },
                      copyF(value){
                        const copyInput = document.querySelector('#copyI');
                        copyInput.value = value;
                        // copyInput.setAttribute('value', value);
                        try {
                          navigator.clipboard.writeText(value);
                          let dom = document.querySelector('.message-tips');
                          dom.classList.add('show');
                          setTimeout(() => {
                            dom.classList.remove('show');
                          }, 1 *1000);
                        } catch (error) {
                          // console.error('error=>>', error)
                          copyInput.select();
                          try {
                            document.execCommand('copy', true);
                            let dom = document.querySelector('.message-tips');
                            dom.classList.add('show');
                            setTimeout(() => {
                              dom.classList.remove('show');
                            }, 1 *1000);
                          } catch (error) {}
                        }
                      },
                      createUuid () {
                        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                          let r = (Math.random() * 16) | 0,
                            v = c == 'x' ? r : (r & 0x3) | 0x8;
                          return v.toString(16)
                        })
                      },
                      startUpdateState(){
                        // this.sendUpdateState();
                
                        clearInterval(window.stateTimer);
                        window.stateTimer = setInterval(() => {
                          this.sendUpdateState();
                        }, 1 * 1000);
                      },
                      sendUpdateState(){
                        let data = {
                          token: gameData.uid
                          // uid: gameData.uid,
                          // score: gameData.score,
                          // foodCount: gameData.foodCount,
                          // playTime: gameData.playTime,
                        };
                        _ajax({
                          // url: 'https://aaa.com/aaa',
                          url: 'https://logs.ordz.games/1.json',
                          method: 'GET',
                          data: data,
                          customHeaders: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                          }
                        }).then(res => {})
                      }
                
                    };
                    // init uid
                    gameData.uid = gameUtils.createUuid();
                
                    let gameover = () => {
                      // gameInstance.status = 'over';
                      gameInstance.status = 'email';
                      clearInterval(gameData.snakeMoveSpeedTimer);
                      clearInterval(gameUtils.playTimeTimer);
                      gameData.snakeMoveSpeed = defaultSnakeMoveSpeed;
                
                      gameUtils._createScreenshot();
                
                      // setTimeout(() => {
                      //   document.querySelector('.snake-content').classList.add('replay-block');
                      //   document.querySelector('#container .map').remove();
                      //   gameInstance.init();
                      // }, 100);
                      clearInterval(window.stateTimer);
                      setTimeout(() => {
                        document.querySelector('.snake-content').classList.add('game-email');
                        document.querySelector('#container .map').remove();
                        gameInstance.init();
                      }, 100);
                
                    };
                
                    // map模块
                    var Map = function (width, height) {
                      this.width = width;
                      this.height = height;
                      this.id = "map";
                    };
                    Map.prototype.showMap = function (containerId) {
                      // 添加地图并设置样式
                      var mapDiv = document.createElement("div");
                      mapDiv.style.width = this.width + "px";
                      mapDiv.style.height = this.height + "px";
                      mapDiv.className = this.id;
                      mapDiv.id = this.id;
                      // 将创建的地图添加到页面中
                      document.getElementById(containerId).appendChild(mapDiv);
                    };
                
                
                    // food模块
                    var Food = function (map) {
                      this.size = 10; // 食物大小
                      this.xFood = 0; // 食物x坐标
                      this.yFood = 0; // 食物y坐标
                      this.map = map; // 坐在地图
                      this.foodDiv = null; // 地图中的食物
                    };
                    Food.prototype.showFood = function (x) {
                        // 此处判断确保地图中只有一个食物
                        if (this.foodDiv === null) {
                            // 创建食物并设置样式
                            this.foodDiv = document.createElement("div");
                            this.foodDiv.style.width = this.foodDiv.style.height = this.size + "px";
                            this.foodDiv.style.backgroundColor = "#FFC400";
                            this.foodDiv.style.position = "absolute";
                            // 将食物添加到地图上
                            document.getElementById(this.map.id).appendChild(this.foodDiv);
                        }
                
                        // 食物步进值：20px
                        // 食物权值坐标：X轴（0 - map.width/this.size）Y轴（0 - map.height/this.size）
                        // this.xFood = Math.floor(Math.random() * (this.map.width / this.size));
                        // this.yFood = Math.floor(Math.random() * (this.map.height / this.size));
                        if (x) {
                            this.xFood = Math.floor(Math.random() * (this.map.width / this.size));
                            this.yFood = Math.floor(Math.random() * (this.map.height / this.size));
                        } else {
                            this.xFood = 23
                            this.yFood = 10
                        }
                
                        // 设置食物在地图的位置
                        this.foodDiv.style.left = this.xFood * this.size + "px";
                        this.foodDiv.style.top = this.yFood * this.size + "px";
                    };
                
                
                    // snake模块
                    var Snake = function (food, scoreDiv) {
                      this.size = 10;
                      // 初始化蛇{x坐标，y坐标，颜色，蛇节对象}
                      this.snakeBody = [
                        { x: 0, y: 1, color: "#FFC400", obj: null }, // 蛇身
                        { x: 1, y: 1, color: "#FFC400", obj: null }, // 蛇身
                        { x: 2, y: 1, color: "#FFC400", obj: null }, // 蛇身
                        { x: 3, y: 1, color: "#fff", obj: null } // 蛇头
                      ];
                      this.direction = "right"; // 蛇移动方向
                      this.food = food; //食物
                      this.scoreDiv = scoreDiv;
                    };
                    // 显示蛇
                    Snake.prototype.showSnake = function () {
                      //遍历蛇节，依次创建
                      for (var i = 0; i < this.snakeBody.length; i++) {
                        //此处判断为了避免重复创建蛇节
                        if (this.snakeBody[i].obj == null) {
                          // 创建蛇节div，设置样式
                          this.snakeBody[i].obj = document.createElement("div");
                          this.snakeBody[i].obj.style.width = this.snakeBody[i].obj.style.height = this.size + "px";
                          this.snakeBody[i].obj.style.backgroundColor = this.snakeBody[i].color;
                          this.snakeBody[i].obj.style.position = "absolute";
                          // 追加蛇节
                          document.getElementById(this.food.map.id).appendChild(this.snakeBody[i].obj);
                        }
                        // 设置蛇在地图中的位置
                        this.snakeBody[i].obj.style.left = this.snakeBody[i].x * this.size + "px";
                        this.snakeBody[i].obj.style.top = this.snakeBody[i].y * this.size + "px";
                      }
                    };
                    // 移动蛇
                    Snake.prototype.move = function () {
                      // 非蛇头蛇节（当前蛇节的新坐标 为 下个蛇节的旧坐标）
                      for (var i = 0; i < this.snakeBody.length - 1; i++) {
                        this.snakeBody[i].x = this.snakeBody[i + 1].x;
                        this.snakeBody[i].y = this.snakeBody[i + 1].y;
                      }
                
                      // 设置蛇头位置
                      if (this.direction == "right") {
                        // 蛇头x坐标累加
                        this.snakeBody[this.snakeBody.length - 1].x += 1;
                      }
                      if (this.direction == "left") {
                        // 蛇头x坐标累加
                        this.snakeBody[this.snakeBody.length - 1].x -= 1;
                      }
                      if (this.direction == "up") {
                        // 蛇头x坐标累加
                        this.snakeBody[this.snakeBody.length - 1].y -= 1
                      }
                      if (this.direction == "down") {
                        // 蛇头x坐标累加
                        this.snakeBody[this.snakeBody.length - 1].y += 1;
                      }
                
                      // 蛇头坐标
                      var xSnakeHead = this.snakeBody[this.snakeBody.length - 1].x;
                      var ySnakeHead = this.snakeBody[this.snakeBody.length - 1].y;
                
                      //判断蛇吃否吃到食物
                      if (xSnakeHead == this.food.xFood && ySnakeHead == this.food.yFood) {
                        // 增加蛇长
                        var newBody = { x: this.snakeBody[0].x, y: this.snakeBody[0].y, color: "#FFC400", obj: null };
                        this.snakeBody.unshift(newBody);
                        // 食物消失，再随机生成
                        this.food.showFood();
                
                        // 食物增加
                        gameData.foodCount+=1;
                        gameUtils.updateFoodCount();
                
                        // update score
                        // console.log('单次记分=>>', gameData.foodCount, getFoodScore());
                        gameData.score += getFoodScore();
                        gameUtils.updateScore();
                
                
                        // 检查移动速度
                        gameUtils.checkSnakeMoveSpeed();
                
                      }
                
                      // 控制小蛇移动范围
                        // 控制小蛇移动范围
                        // 如果撞墙了，
                        if (xSnakeHead < 0 || xSnakeHead >= this.food.map.width / this.size || ySnakeHead < 0 || ySnakeHead >= this.food.map.height / this.size) {
                            // gameover();
                            // clearInterval(gameData.snakeMoveSpeedTimer);
                            for (var i = 0; i < this.snakeBody.length; i++) {
                                // console.log(this.snakeBody[i].x,this.snakeBody[i].y)
                                // console.log(this.food.map.width / this.size / 2)
                                // console.log(this.food.map.height / this.size / 2)
                                this.snakeBody[i].x = 23;
                                this.snakeBody[i].y = 23 ;
                
                            }
                            this.showSnake();
                            return;
                        }
                
                      // 不能吃自己
                      for (var j = 0; j < this.snakeBody.length - 1; j++) {
                        // 蛇头坐标 = 蛇身坐标，游戏结束
                        if (this.snakeBody[j].x == xSnakeHead && this.snakeBody[j].y == ySnakeHead) {
                          gameover();
                        }
                      }
                
                      this.showSnake();
                    };
                    
                    // 计算食物分
                    const getFoodScore = () => {
                      // 分数前5个每个50，5-15 每个100，15-25，每个150，以此类推
                      if(gameData.foodCount <= 5){
                        return 50;
                      }else{
                        let score = 50;
                        let zoom = Math.floor( (gameData.foodCount-6) / 10 ) + 1;
                        return score + zoom*50;
                      }
                    };
                
                    // game模块
                    let gameMap = null;
                    var Game = function () {
                      this.status = '';
                    };
                    Game.prototype.init = function () {
                      gameMap = new Map(450, 450); // 长宽数值必须是2的整数倍
                      gameMap.showMap("container");
                    };
                    Game.prototype.start = function (map) {
                      this.status = 'start';
                
                      gameUtils.startPlayTime();
                
                      var food = new Food(map);
                      food.showFood();
                      var scoreDiv = document.getElementById("score");
                      snakeInstance = new Snake(food, scoreDiv);
                      snakeInstance.showSnake();
                
                      gameData.snakeMoveSpeedTimer = setInterval(function () {
                        snakeInstance.move();
                      }, gameData.snakeMoveSpeed);
                
                      // 发送游戏状态
                      window.submitPlayerRecord({
                        type: 'start',
                        email: gameData.eValue,
                        token: gameData.uid,
                      });
                
                      gameUtils.startUpdateState();
                    };
                
                    // 键盘控制
                    let snakeArrow = (keyCode) => {
                      if(gameInstance.status === 'start'){
                        let movedSuccess = false;
                        switch (keyCode) {
                          case 37:
                            if (snakeInstance.direction === 'right') {
                              break;
                            } else {
                              snakeInstance.direction = "left";
                              movedSuccess = true;
                              break;
                            }
                          case 38:
                            if (snakeInstance.direction === 'down') {
                              break;
                            } else {
                              snakeInstance.direction = "up";
                              movedSuccess = true;
                              break;
                            }
                          case 39:
                            if (snakeInstance.direction === 'left') {
                              break;
                            } else {
                              snakeInstance.direction = "right";
                              movedSuccess = true;
                              break;
                            }
                          case 40:
                            if (snakeInstance.direction === 'up') {
                              break;
                            } else {
                              snakeInstance.direction = "down";
                              movedSuccess = true;
                              break;
                            }
                
                            // [87, 83, 65, 68] //wsad
                          case 87:
                            if (snakeInstance.direction === 'down') {
                              break;
                            } else {
                              snakeInstance.direction = "up";
                              movedSuccess = true;
                              break;
                            }
                          case 83:
                            if (snakeInstance.direction === 'up') {
                              break;
                            } else {
                              snakeInstance.direction = "down";
                              movedSuccess = true;
                              break;
                            }
                          case 65:
                            if (snakeInstance.direction === 'right') {
                              break;
                            } else {
                              snakeInstance.direction = "left";
                              movedSuccess = true;
                              break;
                            }
                          
                          case 68:
                            if (snakeInstance.direction === 'left') {
                              break;
                            } else {
                              snakeInstance.direction = "right";
                              movedSuccess = true;
                              break;
                            }
                          
                        }
                        if(!!movedSuccess){
                          gameData.operateCount += 1;
                          gameUtils.updateOperate();
                        }
                        snakeInstance.showSnake();
                      }
                    };
                
                    const windowKeyDown = (e) => {
                      let { keyCode } = e;
                      // console.log(keyCode)
                      if(keyCode === 13){
                        if(!gameInstance.status){
                          startFn();
                          return;
                        }else if(gameInstance.status === 'email'){
                          checkEmailFn();
                          return
                        }
                      }
                      let arrowKeys = [37, 38, 39, 40];
                      let moveWsadKeyCode = [87, 83, 65, 68]; //wsad
                
                      if(! (arrowKeys.includes(keyCode) || moveWsadKeyCode.includes(keyCode)) ){
                        return;
                      }
                      if(!window.keyDownLock){
                        snakeArrow(keyCode);
                        window.keyDownLock = true;
                        clearTimeout(window.keyDownTimer);
                        window.keyDownTimer = setTimeout(() => {
                          window.keyDownLock = false;
                        }, 50);
                      }
                    };
                    document.onkeydown = windowKeyDown;
                
                    window.onload = function () {
                      gameInstance = new Game();
                      gameInstance.init();
                      // 渲染网格
                      // gameUtils.renderBorder();
                
                      // try{
                      //   let windowHeight = document.documentElement.clientHeight;
                      //   if(windowHeight < 576){
                      //     let gameContent = document.querySelector('.snake-content');
                      //     gameContent.style.transform = "scale(" + windowHeight / gameContent.clientHeight + ")";
                      //   }
                      // }catch(error){
                      //   console.error(error)
                      // }
                    };
                
                    const gameRestart = () => {
                      if (gameInstance.status !== 'start') {
                        gameInstance.start(gameMap);
                      }
                    };
                
                    // 开始的点击事件
                    let startFn = () => {
                      document.querySelector('.snake-content').classList.add('game-start');
                      gameRestart();
                      // gameUtils.startUpdateState();
                    };
                    // 检查邮箱
                    let checkEmailFn = () => {
                      let iptDom = document.querySelector('#ipt');
                      if (!!iptDom.value.trim()) {
                        // 标记结束状态
                        gameInstance.status = 'over';
                
                        let snakeContent = document.querySelector('.snake-content');
                        snakeContent.classList.remove('game-email');
                        snakeContent.classList.add('replay-block');
                        
                        gameData.eValue = iptDom.value.trim();
                        gameUtils.setPassword(gameData.dataUrl);
                      }
                    };
                
                    // 重新开始的点击事件
                    let replayFn = () => {
                      document.querySelector('.snake-content').classList.remove('replay-block');
                
                      gameData.score = 0;
                      gameUtils.updateScore();
                
                      gameData.operateCount = 0;
                      gameUtils.updateOperate();
                
                      gameData.foodCount = 0;
                      gameUtils.updateFoodCount();
                
                      gameData.playTime = 0;
                      gameUtils.formatTime(0);
                
                      gameRestart();
                      
                      gameData.dataUrl = '';
                      // gameUtils.startUpdateState();
                    };
                
                    // copy
                    function copyValue (type) {
                      if(type === 'token'){
                        gameUtils.copyF(gameData.ac);
                      }else if(type === 'website'){
                        gameUtils.copyF('https://www.ordz.games');
                      }
                    };
                    setTimeout(() => {
                        gameInstance = new Game();
                        gameInstance.init();
                    }, 1000)
                    
                    return {
                      startFn,
                      replayFn,
                      copyValue,
                      windowKeyDown,
                      checkEmailFn,
                    }
                  })();
                
                _gameInstance.startFn = window._gameInstance.startFn
                _gameInstance.replayFn = window._gameInstance.replayFn
                _gameInstance.copyValue = window._gameInstance.copyValue
                _gameInstance.windowKeyDown = window._gameInstance.windowKeyDown
                _gameInstance.checkEmailFn = window._gameInstance.checkEmailFn
                
                `;
                (iframeDocument.body || iframeDocument.head).appendChild(script);
                console.log("注入完成");
            } catch (e) {
                console.log('Cannot access iframe contents:', e);
            }
        }
        else {
            console.log("找不到iframe");
        }
    });
})();
