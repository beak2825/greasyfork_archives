// ==UserScript==
// @name         Prettier-81Dojo
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  A CSS and shortcuts on 81 Dojo.
// @author       Quisette
// @match        http://81dojo.com/client/
// @match        https://system.81dojo.com/ja/kifus/
// @match        https://system.81dojo.com/en/kifus/

// @icon         http://81dojo.com/client/favicon.ico
// @grant        GM_log
// @grant        GM_addStyle
// @run-at     document-start
// @license private

// @downloadURL https://update.greasyfork.org/scripts/449051/Prettier-81Dojo.user.js
// @updateURL https://update.greasyfork.org/scripts/449051/Prettier-81Dojo.meta.js
// ==/UserScript==


!function() {
    'use strict';

    addCustomScripts()
    deleteOldScripts()
    removeClock()
    //addArrowKeyMoveKifu()


}();

function addArrowKeyMoveKifu(){
        document.addEventListener("keydown", e=>{
        if(e.key === "ArrowLeft" ){
            _replayButtonClick(-1)
        }else if(e.key === "ArrowRight"){
            _replayButtonClick(1)
        }else if(e.key === "ArrowUp"){
            _replayButtonClick(-2)
        }else if(e.key === "ArrowDown"){
            _replayButtonClick(2)
        }else if(e.key === "Escape"){
            _closeBoard()
        }
    })

}
function removeClock(){


    new MutationObserver(function(mutations) {

    if (document.getElementsByTagName('body')) {
    const clock = document.getElementById("worldClocks")

    if(clock){
                   clock.remove(clock)
            this.disconnect(); // disconnect the observer

    }


    }
}).observe(document, {childList: true, subtree: true});



}

function addCustomScripts(){


    var scriptElem = document.createElement('script')
    scriptElem.innerHTML = (`
class Board{

  constructor(div){
    ////////////////////////////////////////////////////////
    ///// EDIT THE PATH HERE TO CHANGE YOUR KOMA STYLE /////
    ////////////////////////////////////////////////////////
    //       default koma style is here                   //
    // this.komaOrigin = 'http://81dojo.com/client/img/themes/ryoko/'
    ////////////////////////////////////////////////////////

    this.komaOrigin = 'https://raw.githubusercontent.com/Quisette/komakasou/main/Portella_2moji/'

    ////////////////////////////////////////////////////////
    this.komaUrl = this.komaOrigin
    // Board Condition parameters
    this.myRoleType = null // 0: sente as player, 1: gote as player, 2: watcher
    this.isPostGame = false
    this.studyHostType = null  // 0: not host, 1: Sub-host, 2: Host
    // Properties
    this._div = div
    this._originalWidth = div.width()
    this._originalHeight = div.height()
    this._komadais = new Array(2)
    this.playerInfos = new Array(2)
    this._timers = new Array(2)
    this.accumulatedTimes = new Array(2)
    this.endTime = null
    this._flags = new Array(2)
    this._publicPosition
    this._position
    this._direction = Position.CONST.SENTE
    this.pieceDesignType = 0
    this._selectedSquare = null
    this._lastSquare = null
    this._mouseDownSquare = null
    this._pickedPiece = null
    this._canMoveMyPiece = true
    this._canMoveHisPiece = true
    this.onListen = true
    this._initialPositionStr = null
    this.moves = new Array()
    this.game = null
    this.result = null // 0: sente win, 1: gote win, -1: draw
    this._kid = null
    this._rematchReady = [false, false]
    this._arrowsSelf = []
    this._arrowsPublic = []
    this._scale = 1
    this._promotionDialog = null
    this.hostMark = null
    this._generateParts()
    this._setTheme()

    this.loadPieceDesignOption()

  }
  detectKomaUrl(theme){ //wip

     if (this.komaOrigin !== ''){
     this.komaUrl = this.KomaOrigin
     }else{
     this.komaUrl = 'http://81dojo.com/client/img/themes/' + theme + '/'

     }
  }

  _generateParts(){
    this._div.empty()
    this._ban = $('<div></div>', {id: 'banField'}).appendTo(this._div)
    this._coord = $('<div></div>', {id: 'coord'}).appendTo(this._div)
    this._komadais[0] = $('<div></div>', {id: 'senteKomadai', class: 'komadai'}).appendTo(this._div)
    this._komadais[1] = $('<div></div>', {id: 'goteKomadai', class: 'komadai'}).appendTo(this._div)
    this.playerInfos[0] = $('<div></div>', {id: 'senteInfo', class: 'player-info'}).appendTo(this._div)
    this.playerInfos[1] = $('<div></div>', {id: 'goteInfo', class: 'player-info'}).appendTo(this._div)
    this._timers[0] = new GameTimer($('<div></div>', {id: 'senteTimer', class: 'game-timer'}).appendTo(this._div))
    this._timers[1] = new GameTimer($('<div></div>', {id: 'goteTimer', class: 'game-timer'}).appendTo(this._div))
    this._flags[0] = $('<div></div>', {id: 'senteFlag', class: 'board-flag'}).appendTo(this._div)
    this._flags[1] = $('<div></div>', {id: 'goteFlag', class: 'board-flag'}).appendTo(this._div)
    for (let i = 0; i < 2; i++){
      this.playerInfos[i].append('<div class="avatar-wrapper" style="margin:5px 15px;"><img class="avatar"/></div><span id="player-info-mark" style="font-size:15px">' + (i == 0 ? '☗' : '☖') + '</span><span id="player-info-name"></span><br><span id="player-info-rate"></span>')
    }
    $('[id=player-info-name]').dblclick(function(){_playerNameDblClick($(this).text())})
    $('div.player-info').on('touchstart', function(e){
      mouseX = e.originalEvent.touches[0].clientX
      mouseY = e.originalEvent.touches[0].clientY
      _playerNameDblClick($(this).find('#player-info-name').text())
    })
    this._arrowCanvas = $('<canvas></canvas>', {id: 'boardCanvas'}).attr({width: this._originalWidth, height: this._originalHeight}).appendTo(this._div)
    this._pickedPiece = $('<div></div>', {class: 'picked-piece'})
    this.hostMark = $('<i></i>', {class: 'fa fa-graduation-cap fa-lg'}).css('color', '#008')
    let thisInstance = this
    $('#senteKomadai, #goteKomadai').click(function(e){
      thisInstance._handleKomadaiClick()
    })
  }

  _setTheme(){
    this._theme = "ichiji"
    this._banW = 410
    this._banH = 454
    this._banX = 185
    this._banY = 10
    this._komadaiW = 170
    this._komadaiH = 200
    this._hisKomadaiX = 7
    this._hisKomadaiY = 10
    this._myKomadaiX = 605
    this._myKomadaiY = 264
    this._myInfoX = 615
    this._myInfoY = 16
    this._hisInfoX = 7
    this._hisInfoY = 267
    this._myFlagX = 718
    this._myFlagY = 215
    this._hisFlagX = 10
    this._hisFlagY = 215
    this._myTimerX = 615
    this._myTimerY = 220
    this._hisTimerX = 80
    this._hisTimerY = 220
    this._komaW = 43
    this._komaH = 48
    this._banEdgeX = 11
    this._banEdgeY = 11

    this._partSize()
    this._partLayout()
    //this.detectKomaUrl(this._theme)

    this._preloadPieceImages(this._theme)
  }

  _partSize(){
    this._ban.css({width: this._banW + 'px', height: this._banH + 'px'})
    this._coord.css({width: this._banW + 'px', height: this._banH + 'px'})
    $(this._komadais.map(e => e[0])).css({width: this._komadaiW + 'px', height: this._komadaiH + 'px'})
    this._pickedPiece.css({width: this._komaW + 'px', height: this._komaH + 'px'})
  }

  _imagePath(){
    let dir = ['dobutsu', 'blind_extreme'].includes(this._theme) ? this._theme : 'default'
    this._ban.css('background-image', 'url(img/themes/' + dir + '/ban.jpg)')
    this._coord.css('background-image', 'url(img/themes/' + dir + (this._direction ? '/Scoord.png)' : '/Gcoord.png)'))
    this._komadais[this._direction ? 0 : 1].css('background-image', 'url(img/themes/' + dir + '/Shand.jpg)')
    this._komadais[this._direction ? 1 : 0].css('background-image', 'url(img/themes/' + dir + '/Ghand.jpg)')
  }

  _partLayout(){
    let myTurnIndex = this._direction ? 0 : 1
    let hisTurnIndex = this._direction ? 1 : 0
    this._ban.css({left: this._banX + 'px', top: this._banY + 'px'})
    this._coord.css({left: this._banX + 'px', top: this._banY + 'px'})
    this._komadais[myTurnIndex].css({left: this._myKomadaiX + 'px', top: this._myKomadaiY + 'px'})
    this._komadais[hisTurnIndex].css({left: this._hisKomadaiX + 'px', top: this._hisKomadaiY + 'px'})
    this.playerInfos[myTurnIndex].css({left: this._myInfoX + 'px', top: this._myInfoY + 'px'})
    this.playerInfos[hisTurnIndex].css({left: this._hisInfoX + 'px', top: this._hisInfoY + 'px'})
    this._flags[myTurnIndex].css({left: this._myFlagX + 'px', top: this._myFlagY + 'px'})
    this._flags[hisTurnIndex].css({left: this._hisFlagX + 'px', top: this._hisFlagY + 'px'})
    this._timers[myTurnIndex].setPosition(this._myTimerX, this._myTimerY)
    this._timers[hisTurnIndex].setPosition(this._hisTimerX, this._hisTimerY)
  }

  _generateSquares(){
    //Call after direction is set!
    this._ban.empty()
    for(let y = 1; y <= 9; y++){
      for(let x = 1; x <= 9; x++){
        let left
        let top
        if (this._direction) {
          left = this._banEdgeX + (9-x) * this._komaW
          top = this._banEdgeY + (y-1) * this._komaH
        } else {
          left = this._banEdgeX + (x-1) * this._komaW
          top = this._banEdgeY + (9-y) * this._komaH
        }
        let sq = $('<div></div>', {id: 'sq' + x + '_' + y, class: 'square'}).data({x: x, y: y})
        sq.css({width: this._komaW + 'px', height: this._komaH + 'px', left: left + 'px', top: top + 'px'})
        if (x < this.position.xmin || x > this.position.xmax || y < this.position.ymin || y > this.position.ymax) sq.addClass('square-wall')
        sq.appendTo(this._ban)
      }
    }
    let thisInstance = this
    $('.square').not('.square-wall').on("click", function(e){
      if (e.ctrlKey) return
      thisInstance._handleSquareClick($(this))
    })
    $('.square').not('.square-wall').on("mousedown", function(){
      thisInstance._handleSquareMouseDown($(this))
    })
    $('.square').not('.square-wall').on("mouseup", function(e){
      thisInstance._handleSquareMouseUp($(this), e.ctrlKey)
    })
  }

  

  _refreshSquare(sq){
    sq.removeClass("square-last")
    if (sq.hasClass("square-wall")) return
    let koma = this._position.getPieceFromSquare(sq)
    if (koma) {
      sq.css('background-image', 'url(' + this.komaUrl + koma.toImagePath(!this._direction) + ')')
    } else {
      sq.css('background-image', 'none')
    }
  }


 _refreshPosition(){
    if (this._position == null) return
    let thisInstance = this
    for (let i = 0; i < 2; i++){
      this._komadais[i].empty()
    }
    $('.square').each(function(){
      thisInstance._refreshSquare($(this))
    })
    $(".square-selected").removeClass("square-selected")
//    $(".square-last").removeClass("square-last")
    for (let i = 0; i < 2; i++){
      let _layoutHandPiece = this._layoutHandPieceClosureFunc(i)
      this._position.komadais[i].sort(function(a,b){return - a.type + b.type})
      this._position.komadais[i].forEach(function(piece){
        if (piece.CSA == 'OU' && this.game.gameType != 'vazoo') return
        let sq = $('<div></div>', {id: 'sq' + (piece.owner ? 0 : -1) + '_' + piece.getType(), class: 'square'}).data({x: piece.owner ? 0 : -1, y: piece.getType()})
        sq.css({width: this._komaW + 'px', height: this._komaH + 'px'})
        sq.css('background-image', 'url(' + this.komaUrl + piece.toImagePath(!this._direction) + ')')
        _layoutHandPiece(sq, piece)
        let thisInstance = this
        sq.on("click", function(e){
          thisInstance._handleSquareClick($(this))
          e.stopPropagation()
        })
        sq.on("mousedown", function(){
          thisInstance._handleSquareMouseDown($(this))
        })
        sq.appendTo(this._komadais[i])
      }, this)
      _layoutHandPiece = null
    }
    if (this._position.lastMove) {
      $('#sq' + this._position.lastMove.toX + '_' + this._position.lastMove.toY).addClass('square-last')
      $('#sq' + this._position.lastMove.fromX + '_' + this._position.lastMove.fromY).addClass('square-last')
    }
    if ($("#modalImpasse").dialog('isOpen')) this.calcImpasse()
    $(".name-popup").remove()
    this.highlightIfIllegal()
  }


  highlightIfIllegal(){
    let arrows = this.onListen ? this._arrowsPublic : this._arrowsSelf
    if (arrows.length > 0) return
    let obj = this.position.checkIllegal()
    if (obj){
      let name = EJ('ILLEGAL', '反則')
      if (obj.cause == 'NIFU'){
        this.addArrow(-1, obj.x1, obj.y1, obj.x1, obj.y1, 0xff0000, this.onListen, name)
        this.addArrow(-1, obj.x2, obj.y2, obj.x2, obj.y2, 0xff0000, this.onListen, name)
      } else if(obj.cause == 'SUICIDE'){
        this.addArrow(-1, obj.x1, obj.y1, obj.x2, obj.y2, 0xff0000, this.onListen, name)
      }
    }
  }

  _layoutHandPieceClosureFunc(i){
    let hash = this._position.handCoordinateHash(i)
    let direction = this._direction == (i == 0)
    let komaW = this._komaW
    return function(sq, piece){
      //square, piece
      let dirSign = direction ? 1 : -1
      let h = hash[piece.CSA]
      if (h.i == 0) h.dx = h.n > 1 ? ((h.xmax - h.xmin) / (h.n - 1)) : 0
      if (h.n > h.fanmax) {
        let sqX = h.xmin + h.i * h.dx
        let sqY = h.y
        sq.css({left: sqX + 'px', top: sqY + 'px'})
      } else {
        let theta = direction ? (Math.floor((h.n - 1) / 2) * 11.2 - h.i * 11.2) : (Math.floor(h.n / 2) * (-11.2) + h.i * 11.2)
        let sqX = 0.5 * (h.xmin + h.xmax) - 3 + (h.n % 2 == 0 ? (direction ? -0.35 : 0.45) * komaW : 0)
        let sqY = h.y + (h.n > 3 && direction ? 8 : 0) + Math.abs(theta)*0.1*dirSign
        let oY = 24 - dirSign * h.originH
        sq.css({left: sqX + 'px', top: sqY + 'px', 'transform-origin': '50% ' + oY + 'px', transform: 'rotate(' + theta + 'deg)'})
      }
      h.i += 1
    }
  }

  loadPieceDesignOption(){
    let newTheme
    let v = options.piece_type || 0
    if (v <= 8) newTheme = ['ichiji', 'ninju', 'hidetchi', 'ichiji_ryoko', 'dobutsu', 'kinki', 'ryoko', 'kiyoyasu', 'shogicz'][v]
    else if (v >= 100) newTheme = ['blind_middle', 'blind_hard', 'blind_extreme'][v - 100]
    if (this._theme != newTheme) this._preloadPieceImages(newTheme)
    this._theme = newTheme

    this._imagePath()
    //this.detectKomaUrl(this._theme)
    this._refreshPosition()
  }

  _preloadPieceImages(theme){
     let komaUrl = this.komaUrl;
    ['ou', 'gyoku', 'ryu', 'hi', 'uma', 'kaku', 'kin', 'ngin', 'gin', 'nkei', 'kei', 'nkyo', 'kyo', 'to', 'fu'].forEach(function(p){
      $('<img>').attr('src', komaUrl  + '/S' + p + '.png')
      $('<img>').attr('src', komaUrl + '/G' + p + '.png')
    })
  }

  setScale(scale){
    if (scale == this._scale) return false // Not changed
    this._div.css('transform', 'scale(' + scale + ')')
    let hMargin = (scale - 1) * this._originalHeight / 2
    let wMargin = (scale - 1) * this._originalWidth / 2
    this._div.css('margin', hMargin + 'px ' + wMargin + 'px')
    this._scale = scale
    return true // Changed
  }

  actualWidth(){
    return this._div.width() * this._scale
  }

  actualHeight(){
    return this._div.height() * this._scale
  }

  setGame(game){
    this.game = game
    this.displayPlayerInfos()
    if (!this.game.isStudy()) {
      if (!this.game.isBlackIn && this.game.black.name != me.name) this.playerNameClassChange(0, "name-left", true)
      if (!this.game.isWhiteIn && this.game.white.name != me.name) this.playerNameClassChange(1, "name-left", true)
    }
    for (let i = 0; i < 2; i++){
      this._flags[i].css('opacity', this.game.isStudy() ? 0 : 1)
      this._timers[i].setOpacity(this.game.isStudy() ? 0 : 1)
    }
  }

  setDirection(direction){
    this._direction = direction
    this._partLayout()
    this._imagePath()
  }

  displayPlayerInfos(){
    for (let i = 0; i < 2; i++){
      let user = i == 0 ? this.game.black : this.game.white
      this.playerInfos[i].find("img.avatar").attr("src", user.avatarURL())
      this.playerInfos[i].find("#player-info-name").html(user.name)
      this.playerInfos[i].find("#player-info-rate").html('R: ' + user.rate + ' (' + makeRankFromRating(user.rate) + ')')
      if (user.titleName() != "") this.playerInfos[i].find("#player-info-rate").append('<span style="color:white;font-weight:bold;background:crimson;padding:0 0.2em;margin-left:0.3em;cursor:default">' + user.titleTag() + '</span>')
      this._flags[i].html(user.country.flagImgTagMovie())
    }
  }

  flipBoard(){
    this._cancelSelect()
    this.setDirection(!this._direction)
    this._generateSquares()
    this._refreshPosition()
    this.redrawAllArrows(this.onListen)
  }

  loadNewPosition(str = Position.CONST.INITIAL_POSITION){
    this._publicPosition = new Position(this.game ? this.game.gameType : null)
    this._publicPosition.superior = this.game ? (!this.game.isHandicap() && this.game.black.rate > this.game.white.rate) : false
    this._publicPosition.loadFromString(str)
    this._position = new Position(this.game ? this.game.gameType : null)
    this._position.superior = this.game ? (!this.game.isHandicap() && this.game.black.rate > this.game.white.rate) : false
    this._position.loadFromString(str)
    this._initialPositionStr = str
    this._generateSquares()
    this._refreshPosition()
    this._scratchKifu()
  }

  _scratchKifu(){
    this.moves = new Array()
    let firstMove = new Movement()
    this.moves.push(firstMove)
    kifuGrid.clear()
    this.addMoveToKifuGrid(firstMove)
  }

  static get MOVEMENT_CONST(){
    return Movement.CONST
  }

  addMoveToKifuGrid(move, highlight = true){
    if (move.num < kifuGrid.rows().count()) {
      while (kifuGrid.row(move.num).length == 1) kifuGrid.row(move.num).remove()
    }
    kifuGrid.row.add(move)
    kifuGrid.draw()
    if (highlight) {
      kifuGrid.rows().deselect()
      kifuGrid.row(move.num).select()
      scrollGridToSelected(kifuGrid)
    }
  }

  startGame(positionStr, myRoleType, move_strings = [], since_last_move = 0) {
    this.myRoleType = myRoleType
    if (myRoleType == 2) this.setDirection(true)
    else this.setDirection(myRoleType == 0)
    this.loadNewPosition(positionStr)
    this.clearArrows(true)
    this.clearArrows(false)
    this.isPostGame = false
    if (this.studyHostType == null) this.studyHostType = 0 // Keep the same host level as before even if startGame() is newly called
    this.onListen = true
    this._timers[0].initialize(this.game.total, this.game.byoyomi)
    this._timers[1].initialize(this.game.total, this.game.byoyomi)
    this.accumulatedTimes[0] = 0
    this.accumulatedTimes[1] = 0
    if (this.isPlayer()) this._timers[this.myRoleType].myPlayingTimer = true
    this.clearRematch()
    /*
    _board_coord_image.visible = false;
    studyOrigin = 0;
    */
    if (move_strings.length > 0) {
      move_strings.forEach(function(move_str){
        if (move_str.match(/^%TORYO/)) {
          resignTime = parseInt(move_str.split(",")[1])
          return
        }
        let move = this.getFinalMove().constructNextMove()
        move.setFromCSA(move_str.split(",")[0])
        move.setTime(parseInt(move_str.split(",")[1]), this)
        this.runningTimer.useTime(move.time)
        move = this._publicPosition.makeMove(move, false)
        this.moves.push(move)
        kifuGrid.row.add(move)
      }, this)
      this._position.deepCopy(this._publicPosition)
      this._refreshPosition()
      kifuGrid.draw()
      kifuGrid.rows().deselect()
      kifuGrid.row(":last").select()
      scrollGridToSelected(kifuGrid)
    }
		if (since_last_move > 0) {
      this.runningTimer.useTime(since_last_move, true)
		}
    this.runningTimer.run()
    this.updateTurnHighlight()
  }

  handleMonitorMove(move){
    this.runningTimer.useTime(move.time)
    move = this._publicPosition.makeMove(move)
    this.moves.push(move)
    if (!kifuGrid.row(':last').data().branch) {
      kifuGrid.row.add(move)
      if (this.onListen) {
        kifuGrid.draw()
        kifuGrid.rows().deselect()
        kifuGrid.row(":last").select()
        scrollGridToSelected(kifuGrid)
      } else {
        drawGridMaintainScroll(kifuGrid)
      }
    }
    if (this.onListen) {
      this._position.deepCopy(this._publicPosition)
      this._refreshPosition()
    }
    this.updateTurnHighlight()
    this.runningTimer.run()
  }

  refreshKifuGrid(){
  }

  _handleSquareMouseDown(sq){
    this._mouseDownSquare = sq
  }

  _handleSquareMouseUp(sq, circleEnabled){
    if (this._mouseDownSquare == null) return
    if (circleEnabled && this._mouseDownSquare.is(sq) || !this._mouseDownSquare.is(sq)) {
      if (this.onListen){
        if (!board.isPlaying()) {
          if (_studyBase != null || !this.isPostGame) this._addMyArrow(sq, true)
        }
      } else {
        this._addMyArrow(sq, false)
      }
    }
    this._mouseDownSquare = null
  }

  _addMyArrow(sqTo, isPublic){
    if (me && me.isGuest) return
    let fromType = -1
    let fromX = this._mouseDownSquare.data().x
    let fromY = this._mouseDownSquare.data().y
    let toX = sqTo.data().x
    let toY = sqTo.data().y
    if (fromX <= 0) {
      fromType = fromX == 0 ? 0 : 1
      fromX = fromY
      fromY = 0
      let thisInstance = this
      this._komadais[fromType].find('.square').each(function(i, node){
        if ($(node).is(thisInstance._mouseDownSquare)) {
          return false
        } else if ($(node).data().y == thisInstance._mouseDownSquare.data().y) {
          fromY++
        }
      })
    }
    this.addArrow(fromType, fromX, fromY, toX, toY, options.arrow_color, isPublic, me ? me.name : null)
    if (isPublic) client.gameChat("[##ARROW]" + fromType + "," + fromX + "," + fromY + "," + toX + "," + toY + ",0x" + options.arrow_color.toString(16))
  }

  _handleSquareClick(sq){
    if (false) {
      let koma_test = this._position.getPieceFromSquare(sq)
      if (koma_test) this._position.komadais[koma_test.owner ? 0 : 1].push(koma_test)
      this._refreshPosition()
      return
    }
    if (!this._selectedSquare) {
      let koma = this._position.getPieceFromSquare(sq)
      if (this._canMovePieceNow() && koma && koma.owner == this._position.turn) {
        this._selectedSquare = sq
        sq.addClass("square-selected")
        if (!isTouchDevice && options.hold_piece && options.piece_type != 102) this._pickUpPiece(sq)
        if (this.isPlaying()) { //Send ##GRAB message
          let x = sq.data().x
          let y = sq.data().y
          if (x <= 0) {
            x = 100 + koma.type
            y = 0
          }
          sendGrab(x, y)
        }
        this._position.getMovableGridsFromSquare(sq).forEach(function(e){
          $("#sq" + e[0] + "_" + e[1]).addClass("square-movable")
          if (options.highlight_movable == 1 && options.piece_type != 102) $("#sq" + e[0] + "_" + e[1]).addClass("square-movable-highlight")
        })
      }
    } else {
      if (sq.hasClass("square-movable")) {
      	$(this._div).unbind("mouseleave")
        let res = this._position.canPromote(this._selectedSquare, sq)
        if (this.game.isKyoto() && this._selectedSquare.data().x <= 0) this._openPromotionDialog(sq, true) // Kyoto-shogi drop dialog
        else if (res == 2) this._manualMoveCommandComplete(sq, true)
        else if (res == 1) this._openPromotionDialog(sq)
        else this._manualMoveCommandComplete(sq, false)
      } else {
        this._cancelSelect()
      }
    }
  }

  _handleKomadaiClick(){
    if (this._selectedSquare) this._cancelSelect()
  }

  _pickUpPiece(sq){
    this._pickedPiece.css('background-image', sq.css('background-image'))
    this._positionPickedPiece(mouseX, mouseY)
    this._pickedPiece.appendTo(this._div)
    sq.addClass("square-picked-up")
    let thisInstance = this
  	$(this._div).mousemove(function(e){
      thisInstance._positionPickedPiece(e.pageX, e.pageY)
  	})
    $(this._div).mouseleave(function(e){
      if (e.pageX <= thisInstance._div.offset().left ||
          e.pageX >= thisInstance._div.offset().left + thisInstance.actualWidth() ||
          e.pageY <= thisInstance._div.offset().top ||
          e.pageY >= thisInstance._div.offset().top + thisInstance.actualHeight()) thisInstance._cancelSelect()
    })
  }

  _positionPickedPiece(mouse_X, mouse_Y){
    this._pickedPiece.css({
			top: (mouse_Y - this._div.offset().top) / this._scale - this._komaW/2 - 4 + 'px',
			left: (mouse_X - this._div.offset().left) / this._scale - this._komaH/2 + 2 + 'px'
		})
  }

  _openPromotionDialog(sq, kyotoFlipDrop = false){
    //square
    let thisInstance = this
    this._promotionDialog = $("<div></div>",{
      title: kyotoFlipDrop ? i18next.t("board.ask_flip") : i18next.t("board.ask_promote"),
      html: '<div id="promotion-window">\
        <button type=button id="promote-yes" class="promotion-button"><img class="promotion-image" id="promote-yes-image"></button>\
        <button type=button id="promote-no" class="promotion-button"><img class="promotion-image" id="promote-no-image"></button>\
        </div>'
    }).dialog({
      dialogClass: 'no-close',
      modal: true,
      autoOpen: false,
      width: 100,
      minHeight: 0,
      position: {at:'left+'+mouseX+' top+'+mouseY},
      close: function(e){
        thisInstance._promotionDialog.dialog('destroy').remove()
        thisInstance._promotionDialog = null
      }
    })
    let koma = this._position.getPieceFromSquare(this._selectedSquare)
    let komaUrl = this.komaUrl
    this._promotionDialog.find('#promote-yes-image').attr('src', this.komaUrl + (kyotoFlipDrop ? koma.convertKyoto().toImagePath(!this._direction) : koma.toImagePath(!this._direction, true)))
    this._promotionDialog.find('#promote-no-image').attr('src', this.komaUrl + koma.toImagePath(!this._direction))
    $('#promote-yes').click(function(){
      thisInstance._manualMoveCommandComplete(sq, true)
    })
    $('#promote-no').click(function(){
      thisInstance._manualMoveCommandComplete(sq, false)
    })
    this._promotionDialog.dialog('open')
  }

  _manualMoveCommandComplete(destinationSquare, promote){
    //sqaure, boolean
    let move = kifuGrid.row({selected: true}).data().constructNextMove()
    move.setFromManualMove(this._position.turn, this._selectedSquare, destinationSquare, promote)
    this._cancelSelect()
    this._executeManualMove(move)
  }

  _executeManualMove(move){
    this.clearArrows(false)
    if (this.isPlaying()) {
      this.runningTimer.stop()
    }
    move = this._position.makeMove(move)
    if (this.isPlaying()) {
      sendMoveAsPlayer(move)
      this._publicPosition.deepCopy(this._position)
      this.updateTurnHighlight()
    } else {
      move.branch = true
      this.addMoveToKifuGrid(move)
      if (this.onListen && this.studyHostType >= 1) {
        sendStudy()
        this.clearArrows(true)
      } else forceKifuMode(0)
    }
    this._refreshPosition()
  }

  handleReceivedMove(move){
    move = this._publicPosition.makeMove(move)
    this.moves.push(move)
    this.addMoveToKifuGrid(move)
    if (this.onListen) {
      this._position.deepCopy(this._publicPosition)
      this._refreshPosition()
    }
  }

  replayMoves(moves){
    this._cancelSelect()
	  //_last_to_square = null;
    this._position.loadFromString(this._initialPositionStr)
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].replayable()) this._position.makeMove(moves[i], false)
    }
    /*
		  if (mv.replayable()) {
			  _last_to_square = _cells[mv.to.y][mv.to.x];
			  _last_to_square.setStyle('backgroundColor', '0xCC3333');
			  if (mv.from.x < Kyokumen.HAND) {
				_last_from_square = _cells[mv.from.y][mv.from.x];
				_last_from_square.setStyle('backgroundColor', '0xFF5555');
			  }
		  }
      */
    this._refreshPosition()
  }

  handleBranchMove(move, withSound = false){
    return this._position.makeMove(move, withSound)
  }

  handleGrab(x, y){
    $(".square-selected").removeClass("square-selected")
    if (x == 0) {
      return
    } else if (x >= 100) {
      y = x - 100
      x = this._position.turn ? 0 : -1
    }
    $("#sq" + x + "_" + y).addClass("square-selected")
  }

  setResult(v){
    this.result = v // 0: sente win, 1: gote win, -1: draw
    if (v >= 0) {
    	board.playerNameClassChange(v, "name-winner", true)
    }
  }

  setBoardConditions(){
    if (this.isPlaying()) {
      this._canMoveMyPiece = true
      this._canMoveHisPiece = false
      this._coord.css('opacity', 0)
    } else {
      this._canMoveMyPiece = !this.onListen || this.studyHostType >= 1
      this._canMoveHisPiece = !this.onListen || this.studyHostType >= 1
      this._coord.css('opacity', 1)
    }
  }

  _canMovePieceNow(){
    return (this._canMoveMyPiece && this._position.turn == this._direction) || (this._canMoveHisPiece && this._position.turn != this._direction)
  }

  _cancelSelect(){
    if (this._promotionDialog) this._promotionDialog.dialog('close')
    if (this._selectedSquare != null){
    	$(this._div).unbind("mousemove mouseleave")
      $(".square").removeClass("square-movable square-movable-highlight")
      this._pickedPiece.remove()
      this._selectedSquare.removeClass("square-selected square-picked-up")
      this._selectedSquare = null
    }
    if (this.isPlaying()) sendGrab(0,0)
		//_endGrab();
		//_pieceGrab = false;
  }

  updateTurnHighlight(){
    if (this.isPostGame) {
      this.playerInfos[0].removeClass('player-info-has-turn')
      this.playerInfos[1].removeClass('player-info-has-turn')
    } else {
      this.playerInfos[this._publicPosition.turn ? 1 : 0].removeClass('player-info-has-turn')
      this.playerInfos[this._publicPosition.turn ? 0 : 1].addClass('player-info-has-turn')
    }
  }

  playerNameClassChange(turn, className, add_or_remove){
    //int, string, boolean
    if (add_or_remove) this.playerInfos[turn].find("#player-info-name").addClass(className)
    else this.playerInfos[turn].find("#player-info-name").removeClass(className)
  }

  pauseAllTimers(){
    this._timers[0].stop(true)
    this._timers[1].stop(true)
  }

  close(){
    this.myRoleType = null
    this.studyHostType = null
    this.game = null
    this.result = null
    this.playerInfos[0].find("#player-info-name").removeClass("name-winner name-left name-mouse-out")
    this.playerInfos[1].find("#player-info-name").removeClass("name-winner name-left name-mouse-out")
    this._timers[0].stop()
    this._timers[1].stop()
    this.endTime = null
  }

  rematch(turn){
    //integer
    this._rematchReady[turn] = true
  }

  rematchAgreed(){
    return this._rematchReady[0] == true && this._rematchReady[1] == true
  }

  clearRematch(){
    this._rematchReady = [false, false]
  }

  disconnectTimer(turn){
    //integer
    this._timers[turn].disconnect()
  }

  reconnectTimer(turn){
    //integer
    this._timers[turn].reconnect()
    if (this.isPlaying) this.runningTimer.run()
  }

  calcImpasse(){
    if (this.isPlaying() && this.myRoleType == (this._position.turn ? 0 : 1)) {
      _updateImpasseWindow(this._position.calcImpasse(), this.myRoleType)
    } else {
      _updateImpasseWindow(this._position.calcImpasse())
    }
  }

  refreshPosition(){
    this._refreshPosition()
  }

  addArrow(fromType, fromX, fromY, toX, toY, color, isPublic, sender){
    //integer, integer, integer, integer, integer, uint, boolean, string
    let arrows = isPublic ? this._arrowsPublic : this._arrowsSelf
    let isFull = arrows.length >= BoardArrow.CONST.MAX_ARROWS
    if (isFull) {
      arrows.shift()
      if (this.onListen == isPublic) this.redrawAllArrows(isPublic)
    }
    let arrow = new BoardArrow(fromType, fromX, fromY, toX, toY, color, sender, this._arrowCanvas)
    arrows.push(arrow)
    if (this.onListen == isPublic) {
      arrow.draw(this._scale)
      if (sender && me && sender != me.name) this.popupName(toX, toY, sender, color)
    }
  }

  clearArrows(isPublic, sender = "*"){
    let arrows = isPublic ? this._arrowsPublic : this._arrowsSelf
    let found = false
    if (sender != "*") {
      for (let i = arrows.length - 1; i >= 0; i--) {
        if (arrows[i].name == sender) {
          found = true
          arrows.splice(i,1)
        }
      }
    }
    if (!found) arrows.length = 0
    if (this.onListen && isPublic || !this.onListen && !isPublic) this.redrawAllArrows(isPublic)
    return found
  }

  redrawAllArrows(isPublic, withLabel = false){
    let arrows = isPublic ? this._arrowsPublic : this._arrowsSelf
    this.clearCanvas()
    arrows.forEach(function(arrow){
      arrow.draw(this._scale)
      if (withLabel) this.popupName(arrow.toX, arrow.toY, arrow.name, arrow.color)
    }, this)
  }

  popupName(x, y, name, color){
    let sq = $('#sq' + x + '_' + y)
    let posX = (sq.offset().left - this._div.offset().left) / this._scale + 0.56 * sq.width()
    let posY = (sq.offset().top - this._div.offset().top) / this._scale + 0.66 * sq.height()
    let element = $("<div></div>",{
      class: 'name-popup',
      html: '<span>' + name + '</span>'
    }).css({left: posX, top: posY, color: intToColorStyle(color)})
    this._div.append(element)
    element.delay(1500).animate({top: (posY - 15) + 'px', opacity: 0}, 1500, function(){$(this).remove()})
  }

  clearCanvas(){
    this._arrowCanvas.get(0).getContext('2d').clearRect(0, 0, this._arrowCanvas.width(), this._arrowCanvas.height())
  }

  isPlayer(){
    return (this.myRoleType == 0 || this.myRoleType == 1)
  }

  isPlaying(){
    return this.isPlayer() && !this.isPostGame
  }

  isWatcher(){
    return this.myRoleType == 2
  }

  isHost(){
    return this.studyHostType == 2
  }

  isSubHost(){
    return this.studyHostType == 1
  }

  isPlayerPresent(turn){
    //integer: 0 or 1
    return !this.playerInfos[turn].find("#player-info-name").hasClass("name-left")
  }

  getPlayerRoleFromName(name){
    if (!this.game) return null
    if (name == this.game.black.name) return 0
    else if (name == this.game.white.name) return 1
    else return null
  }

  getFinalMove(){
    return this.moves[this.moves.length - 1]
  }

  getPlayersTimer(sente){
    return this._timers[sente ? 0 : 1]
  }

  getOpponent(){
    if (this.myRoleType == 0) return this.game.white
    else if (this.myRoleType == 1) return this.game.black
    else return null
  }

  setKifuId(kid){
    this._kid = kid
  }

  toKifuURL(withOption = false){
    if (this._kid == null || this._kid == 0) {
      return ""
    } else {
      let url = "http://system.81dojo.com/" + EJ('en', 'ja') + "/kifus/" + this._kid
      if (withOption) {
        let vars = []
        if (!this._direction) vars.push("turn=1")
        if (kifuGrid.row({selected: true}).index() != 0) vars.push("moves=" + kifuGrid.row({selected: true}).index())
      	if (vars.length > 0) url += "?" + vars.join("&")
      }
      return url
    }
  }

  getMaterialBalance(joban){
    return this._position.materialBalance(this._direction, joban)
  }

  get runningTimer(){
    return this._timers[this._publicPosition.turn ? 0 : 1]
  }

  get position(){
    return this._position
  }

  get div(){
    return this._div
  }

}



class Piece{


  constructor(owner, promoted = false){
    //boolean(sente:true), int, int, boolean
    this.owner = owner
    this._promoted = promoted
    this.type
    this.CSA = ""
    this.promotedCSA = null
    this._img = ""
    this._promotedImg = null
    this._sfen = ""
    this.normalNotation = 'S'
    this.reversedNotation ='G'


  }
  

  normalMoves(){
    return []
  }

  promotedMoves(){
    return []
  }

  adjacentMoves(){
    return this._promoted ? this.promotedMoves() : this.normalMoves()
  }

  farMoves(){
    return []
  }

  promote(){
    if (!this._promoted) this._promoted = true
  }

  depromote(){
    if (this._promoted) this._promoted = false
  }

  toString(){
    let str = this.owner ? "+" : "-"
    return str + (this._promoted ? this.promotedCSA : this.CSA)
  }

  toImagePath(reverse = false, showPromotedSide = false){
    return (this.owner == !reverse ? this.normalNotation : this.reversedNotation ) + ((this._promoted || showPromotedSide) ? this._promotedImg : this._img) + ".png"
  }

  getType(){
    return this.type + (this._promoted ? 8 : 0)
  }

  isPromoted(){
    return this._promoted
  }

  isKing(){
    return false
  }

  isPawn(){
    return false
  }

  isPromotable(){
    return true
  }

  toSFEN(){
    let str = (this.isPromotable() && this.isPromoted() ? "+" : "") + this._sfen
    return this.owner ? str : str.toLowerCase()
  }

  soundVolume(){
    return 1
  }
//  kyotoConvert(){
//  		 kyoto_conversion:Array = new Array(0, 7, 4, 5, 2, 3, 15, 1, 8, 9, 10, 11, 12, 13, 14, 6);
//  }

  mustPromote(rowsAhead){
    // integer (how many rows are ahead of the piece until the end of the opponent side)
    return false
  }

  checkSibling(){ //whether the piece needs to check siblings when moved
    return true
  }

  convertKyoto(){
    return this
  }
}

class PieceOU extends Piece{
  constructor(owner, promoted){
    super(owner, promoted)
    this.point = 0
    this.type = 0
    this.CSA = "OU"
    this.promotedCSA = "OU"
    this._img = "gyoku"
    this._promotedImg = "ou"
    this._sfen = "K"
  }
  normalMoves(){
    return [[0, +1], [+1, +1], [-1, +1], [+1, +0], [-1, +0], [0, -1], [+1, -1], [-1, -1]]
  }
  promotedMoves(){
    return this.normalMoves()
  }
  isKing(){
    return true
  }
  isPromotable(){
    return false
  }
  checkSibling(){
    return false
  }
}

class PieceHI extends Piece{
  constructor(owner, promoted){
    super(owner, promoted)
    this.point = 5
    this.type = 1
    this.CSA = "HI"
    this.promotedCSA = "RY"
    this._img = "hi"
    this._promotedImg = "ryu"
    this._sfen = "R"
  }
  promotedMoves(){
    return [[+1, +1], [-1, +1], [+1, -1], [-1, -1]]
  }
  farMoves(){
    return [[0, +1], [+1, 0], [0, -1], [-1, 0]]
  }
  soundVolume(){
    return this._promoted ? 1 : 0.9
  }
  convertKyoto(){
    return new PieceFU(this.owner)
  }
}

class PieceKA extends Piece{
  constructor(owner, promoted){
    super(owner, promoted)
    this.point = 5
    this.type = 2
    this.CSA = "KA"
    this.promotedCSA = "UM"
    this._img = "kaku"
    this._promotedImg = "uma"
    this._sfen = "B"
  }
  promotedMoves(){
    return [[0, +1], [+1, 0], [-1, 0], [0, -1]]
  }
  farMoves(){
    return [[+1, +1], [+1, -1], [-1, -1], [-1, +1]]
  }
  soundVolume(){
    return this._promoted ? 1 : 0.9
  }
  convertKyoto(){
    return new PieceGI(this.owner)
  }
}

class PieceKI extends Piece{
  constructor(owner, promoted){
    super(owner, false)
    this.point = 1
    this.type = 3
    this.CSA = "KI"
    this._img = "kin"
    this._sfen = "G"
  }
  normalMoves(){
    return [[0, +1], [+1, +1], [-1, +1], [+1, +0], [-1, +0], [0, -1]]
  }
  isPromotable(){
    return false
  }
  soundVolume(){
    return 0.65
  }
  convertKyoto(){
    return new PieceKE(this.owner)
  }
}

class PieceGI extends Piece{
  constructor(owner, promoted){
    super(owner, promoted)
    this.point = 1
    this.type = 4
    this.CSA = "GI"
    this.promotedCSA = "NG"
    this._img = "gin"
    this._promotedImg = "ngin"
    this._sfen = "S"
  }
  normalMoves(){
    return [[0, +1], [+1, +1], [-1, +1], [+1, -1], [-1, -1]]
  }
  promotedMoves(){
    return [[0, +1], [+1, +1], [-1, +1], [+1, +0], [-1, +0], [0, -1]]
  }
  soundVolume(){
    return 0.65
  }
  convertKyoto(){
    return new PieceKA(this.owner)
  }
}

class PieceKE extends Piece{
  constructor(owner, promoted){
    super(owner, promoted)
    this.point = 1
    this.type = 5
    this.CSA = "KE"
    this.promotedCSA = "NK"
    this._img = "kei"
    this._promotedImg = "nkei"
    this._sfen = "N"
  }
  normalMoves(){
    return [[+1, +2], [-1, +2]]
  }
  promotedMoves(){
    return [[0, +1], [+1, +1], [-1, +1], [+1, +0], [-1, +0], [0, -1]]
  }
  soundVolume(){
    return 0.5
  }
  mustPromote(rowsAhead){
    return !this._promoted && rowsAhead < 2
  }
  convertKyoto(){
    return new PieceKI(this.owner)
  }
}

class PieceKY extends Piece{
  constructor(owner, promoted){
    super(owner, promoted)
    this.point = 1
    this.type = 6
    this.CSA = "KY"
    this.promotedCSA = "NY"
    this._img = "kyo"
    this._promotedImg = "nkyo"
    this._sfen = "L"
  }
  promotedMoves(){
    return [[0, +1], [+1, +1], [-1, +1], [+1, +0], [-1, +0], [0, -1]]
  }
  farMoves(){
    return this._promoted ? [] : [[0, +1]]
  }
  soundVolume(){
    return 0.5
  }
  mustPromote(rowsAhead){
    return !this._promoted && rowsAhead < 1
  }
  checkSibling(){
    return this._promoted
  }
  convertKyoto(){
    return new PieceFU(this.owner, true)
  }
}

class PieceFU extends Piece{
  constructor(owner, promoted){
    super(owner, promoted)
    this.point = 1
    this.type = 7
    this.CSA = "FU"
    this.promotedCSA = "TO"
    this._img = "fu"
    this._promotedImg = "to"
    this._sfen = "P"
  }
  normalMoves(){
    return [[0, +1]]
  }
  promotedMoves(){
    return [[0, +1], [+1, +1], [-1, +1], [+1, +0], [-1, +0], [0, -1]]
  }
  isPawn(){
    return !this._promoted
  }
  soundVolume(){
    return this._promoted ? 0.4 : 0.35
  }
  mustPromote(rowsAhead){
    return !this._promoted && rowsAhead < 1
  }
  checkSibling(){
    return this._promoted
  }
  convertKyoto(){
    return this._promoted ? new PieceKY(this.owner) : new PieceHI(this.owner)
  }
}

class PieceZL extends PieceOU{
  constructor(owner, promoted){
    super(owner, promoted)
    this._img = "ra"
    this._promotedImg = "ra"
  }
}

class PieceZG extends Piece{
  constructor(owner, promoted){
    super(owner, false)
    this.type = 1
    this.CSA = "ZG"
    this._img = "ki"
  }
  normalMoves(){
    return [[0, +1], [+1, +0], [-1, +0], [0, -1]]
  }
  isPromotable(){
    return false
  }
}

class PieceZE extends Piece{
  constructor(owner, promoted){
    super(owner, false)
    this.type = 2
    this.CSA = "ZE"
    this._img = "zo"
  }
  normalMoves(){
    return [[+1, +1], [-1, +1], [+1, -1], [-1, -1]]
  }
  isPromotable(){
    return false
  }
}

class PieceZC extends Piece{
  constructor(owner, promoted){
    super(owner, promoted)
    this.type = 7
    this.CSA = "ZC"
    this.promotedCSA = "TO"
    this._img = "hi"
    this._promotedImg = "ni"
  }
  normalMoves(){
    return [[0, +1]]
  }
  promotedMoves(){
    return [[0, +1], [+1, +1], [-1, +1], [+1, +0], [-1, +0], [0, -1]]
  }
  checkSibling(){
    return this._promoted
  }
}


    `)
    document.head.appendChild(scriptElem)


}

function deleteOldScripts(){

    new MutationObserver(function(mutations) {

    if (document.getElementsByTagName('body')) {
        var scripts = document.querySelectorAll('script');
        if (scripts) {
            for (var i = (scripts.length-1); i >= 0; i--) {

                if(scripts[i].getAttribute('src') === 'js/Board.js?2.2.7\n' || scripts[i].getAttribute('src') === 'js/Piece.js?2.2.7\n'|| scripts[i].getAttribute('src') === 'js/WorldClock.js?2.2.7\n' ){
                    scripts[i].parentNode.removeChild(scripts[i]);
                }

            }
            this.disconnect(); // disconnect the observer
        }
    }
}).observe(document, {childList: true, subtree: true});


}

GM_addStyle(`
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP&family=Roboto+Mono:wght@500&display=swap');   body{
   font-family: Noto Serif JP, sans-serif !important;
   font-size: 14px !important;
   transition: 0.2s !important;
   }

  #playerListBox{
   width: 30% !important;
  }
  #replayButtonFirst, #replayButtonBack, #replayButtonForward, #replayButtonLast {
  border-radius: 8px !important;

  }
  #replayButtonFirst:hover, #replayButtonBack:hover, #replayButtonForward:hover, #replayButtonLast:hover {
  transform: scale(0.9) translateY(3px)!important;
  transition: 0.2s !important;
  }
  a{
  transition: 0.2s!important;
  }
  .picked-piece{
  background-size: cover !important;

  }
  .square{
  transition: 0.2s !important;
  background-position:center !important;
  background-size: cover !important;
  }
  @keyframes testAnimation{
   0%{
    opacity: 100%
  }
  50%{
    opacity: 0%
  }
  100%{
    opacity: 100%
  }
  }
  tr{
  transition: 0.15s !important;
  }
  .ui-dialog{
  transition: 0.2s !important;
  border-radius: 10px !important;
  }
  .game-timer{
  border-radius: 8px !important;
  border: 0px !important;
  box-shadow: 3px 3px 3px 0px #303030 !important;
  }
  #goteInfo, #senteInfo{
  border-radius: 8px !important;
  box-shadow: 3px 3px 3px 0px #303030 !important;
  text-align: center !important;

  }
  .avatar{
  box-shadow: 2px 2px 3px 0px #aaaaaa !important;


  border: solid 2px #ddd !important;
  border-radius: 8px !important;
  }
  .game-timer-label{
  font-family: Roboto Mono!important;
  }
  .game-timer-sub-label{
  font-family: Roboto Mono !important;
  color: 	#0080ff !important;
  width: 95% !important;
  }
  #player-info-name #player-info-rate{
  text-align: center !important;
  }
  #boardBox{
  background: #DFCCA1 !important;
  border-radius: 10px !important;
  }
  .ui-widget{
  font-family: Noto Serif JP !important;
  border-radius: 10px !important;
  }
  .boardChatInput,.lobbyChatInput{
  border-radius: 2em !important;
  font-family: Noto Serif JP !important;
  }
  div#playerGridWrapper, #waiterGridWrapper, #lobbyChatBox, #gameGridWrapper,#lobbyMessageArea{
    border-radius: 10px;
    margin-bottom: 10px;
 }
 #loginButton, #reloginButton{
 transition: 0.2s; border-radius: 9999em !important; height: 30px

 }
 #banField{
 border-radius: 5px !important;
 box-shadow: 3px 3px 3px 0px #303030 !important;


 }
 .komadai{
 border-radius: 10px !important;
  background-image: url("https://www.shogi-extend.com/system/material/board/12.png") !important;
  box-shadow: 3px 3px 3px 0px #303030 !important;
 }
 .layer{
 transition: 0.2s;
 }

 ::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  // box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: grey;
  border-radius: 5px;
}
#lobbyMessageArea{
overflow-y: auto !important;
}

`)

