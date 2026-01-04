// ==UserScript==
// @name         Action Counter
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  counts every PC and Tspin, and displays it in-game
// @author       Justin1L8
// @match        https://*.jstris.jezevec10.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/422835/Action%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/422835/Action%20Counter.meta.js
// ==/UserScript==

const textX = 100
const textY = 500
const fontSize = 16
const textColor = "#FFFFFF"

// set what to display; doesn't affect what gets counted
const displayPCs = true
const displayTSpins = true

if (typeof Game != "undefined") {
    var box = document.createElement('div');
    box.id = 'counter';

    box.style.position = 'absolute';
    box.style.top = textY + 'px';
    box.style.left = textX +'px';
    box.style.fontSize = fontSize + 'px';
    box.style.color = textColor;
    box.style.whiteSpace = "pre"

    function updateCounterText() {
        var text = "";
        if (displayPCs) {
            text += "PCs: " + GM_getValue("pcCounter", 0) + "\r\n";
        }
        if (displayTSpins) {
            text += "TSpins: " + GM_getValue("tspinCounter", 0) + "\r\n";
        }
        box.textContent = text;
    }

    updateCounterText();
    document.body.appendChild(box);

    Game.prototype.addToCounter = function(counterID) {
        GM_setValue(counterID, GM_getValue(counterID, 0)+1)
        updateCounterText();
    }

    // just overwriting a function; could easily cheat by changing this so don't do that :)
    Game.prototype.checkLineClears = function(_40) {
        let _107 = 0
        , _108 = -1
        , _109 = 0
        , _10a = 0
        , _10b = false
        , _10c = 0
        , _10d = 0
        , _92 = []
        , _10e = null
        , _35 = this.blockSets[this.activeBlock.set].blocks[this.activeBlock.id]
        , _10f = "";
        this.wasBack2Back = this.isBack2Back;
        this.spinMiniPossible = false;
        if (!this.ISGAME && this.pmode === 3) {
            _10d = this.countGarbageHeight()
        }
        ;if (!this.R.clearLines) {
            this.comboCounter = -1;
            return
        }
        ;if (this.spinPossible) {
            if (_35.id === 2 || _35.id === 202) {
                this.checkTSpin(_35.id)
            } else {
                if (this.R.allSpin === 2) {
                    this.spinPossible = false;
                    this.checkAllSpin(_35.id)
                } else {
                    if (this.R.allSpin !== 1) {
                        this.spinPossible = false
                    }
                }
            }
        }
        ;for (let _19 = 0; _19 < 10; ++_19) {
            if (this.deadline[_19] !== 0) {
                ++_109
            } else {
                if (_109 > 0) {
                    break
                }
            }
        }
        ;if (_109 === 10) {
            this.deadline = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            ++_107
        } else {
            _10c += _109
        }
        ;for (let _18 = 0; _18 < 20; _18++) {
            _109 = 0;
            _10a = 0;
            for (let _19 = 0; _19 < 10; _19++) {
                let _110 = this.matrix[_18][_19];
                if (_110 === 9) {
                    break
                } else {
                    if (_110 !== 0) {
                        _109++;
                        _10a |= _110
                    } else {
                        if ((_10c + _109) > 0) {
                            break
                        }
                    }
                }
            }
            ;if (_109 === 10) {
                if (this.R.clearDelay) {
                    if (_10e === null) {
                        _10e = copyMatrix(this.matrix)
                    }
                    ;_92.push(_18)
                }
                ;if (this.matrix[_18].indexOf(8) >= 0) {
                    this.gamedata.garbageCleared++
                }
                ;for (let _13 = _18; _13 > 0; _13--) {
                    this.matrix[_13] = this.matrix[_13 - 1]
                }
                ;this.matrix[0] = this.deadline.slice(0);
                this.deadline = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                _109 = 0;
                _107++;
                _108 = _18;
                if (this.ISGAME && this.isPmode(false) === 6 && this.MapManager.mapData.finish === this.MapManager.FINISH_STANDARD) {
                    this.MapManager.lineCleared(_18)
                }
                ;if (_10a & 16) {
                    _10b = true
                }
            }
            ;_10c += _109
        }
        ;if (_107 > 0) {
            this.gamedata.lines += _107;
            if (this.GameStats) {
                this.GameStats.get("LINES").set(this.gamedata.lines)
            }
            ;var _56 = 0
            , _111 = null;
            switch (_107) {
                case 1:
                    this.gamedata.singles++;
                    _56 = this.linesAttack[1];
                    if (this.spinPossible) {
                        if (this.debug) {
                            _10f = "T-Spin Single"
                        }
                        ;_111 = this.Scoring.A.TSPIN_SINGLE;
                        _56 = this.linesAttack[7];
                        if (this.isBack2Back) {
                            this.gamedata.B2B += 1;
                            _56 += this.linesAttack[10]
                        } else {
                            this.isBack2Back = true
                        }
                    } else {
                        if (this.spinMiniPossible) {
                            _111 = this.Scoring.A.TSPIN_MINI_SINGLE;
                            if (this.isBack2Back) {
                                this.gamedata.B2B += 1
                            } else {
                                this.isBack2Back = true
                            }
                            ;_56 = this.linesAttack[8];
                            if (this.debug) {
                                _10f = "T-Spin Mini Single"
                            }
                        } else {
                            this.isBack2Back = false;
                            _111 = this.Scoring.A.CLEAR1
                        }
                    }
                    ;break;
                case 2:
                    this.gamedata.doubles++;
                    _56 = this.linesAttack[2];
                    if (this.spinPossible || this.spinMiniPossible) {
                        this.gamedata.TSD++;
                        _56 = this.linesAttack[5];
                        _111 = this.Scoring.A.TSPIN_DOUBLE;
                        if (this.isBack2Back) {
                            this.gamedata.B2B += 1;
                            _56 += this.linesAttack[10]
                        } else {
                            this.isBack2Back = true
                        }
                        ;if (this.debug) {
                            _10f = "T-Spin Double"
                        }
                    } else {
                        this.isBack2Back = false;
                        _111 = this.Scoring.A.CLEAR2
                    }
                    ;break;
                case 3:
                    this.gamedata.triples++;
                    _56 = this.linesAttack[3];
                    if ((this.spinPossible || this.spinMiniPossible) && (_35.id === 2 || _35.id === 50)) {
                        _56 = this.linesAttack[6];
                        _111 = this.Scoring.A.TSPIN_TRIPLE;
                        if (this.isBack2Back) {
                            this.gamedata.B2B += 1;
                            _56 += this.linesAttack[10]
                        } else {
                            this.isBack2Back = true
                        }
                        ;if (this.debug) {
                            _10f = "T-Spin Triple"
                        }
                    } else {
                        this.isBack2Back = false;
                        _111 = this.Scoring.A.CLEAR3
                    }
                    ;break;
                case 4:
                    this.gamedata.tetrises++;
                    _111 = this.Scoring.A.CLEAR4;
                    _56 = this.linesAttack[4];
                    if (this.isBack2Back) {
                        this.gamedata.B2B += 1;
                        _56 += this.linesAttack[10]
                    } else {
                        this.isBack2Back = true
                    }
                    ;if (this.debug) {
                        _10f = "Tetris"
                    }
                    ;break;
                default:
                    this.gamedata.tetrises++;
                    _111 = this.Scoring.A.CLEAR5;
                    _56 = this.linesAttack[6];
                    if (this.isBack2Back) {
                        this.gamedata.B2B += 1;
                        _56 += this.linesAttack[10]
                    } else {
                        this.isBack2Back = true
                    }
                    ;if (this.debug) {
                        _10f = "Multitris (" + _107 + ")"
                    }
                    ;break
            }
            ;if (this.R.allSpin && this.spinPossible) {
                if (this.excludedBlocksAS && this.excludedBlocksAS.length && this.excludedBlocksAS.indexOf(_35.name) !== -1) {
                    _56 = 0;
                    if (this.debug) {
                        _10f = "Ignored " + _35.name + "-Spin"
                    }
                } else {
                    if (_35.id !== 2) {
                        _111 = 127;
                        if (this.R.allSpin === 1) {
                            if (_107 >= 4) {
                                _56 = this.linesAttack[6] + 1
                            } else {
                                if (_107 === 3) {
                                    _56 = this.linesAttack[6]
                                } else {
                                    if (_107 === 2) {
                                        _56 = this.linesAttack[5]
                                    } else {
                                        _56 = this.linesAttack[7]
                                    }
                                }
                            }
                        } else {
                            _56 = this.spinMiniPossible ? Math.min(2, _107) : Math.min(5, 2 * _107)
                        }
                        ;if (this.wasBack2Back) {
                            _56 += this.linesAttack[10]
                        }
                        ;this.isBack2Back = true;
                        if (this.debug && this.ISGAME) {
                            _10f = _35.name + "-Spin " + ((_107 <= 4) ? this.multipleNames[_107 - 1] : this.multipleNames[4]);
                            if (this.spinMiniPossible) {
                                _10f += " Mini"
                            }
                            ;if (this.wasBack2Back) {
                                _10f = "B2B " + _10f
                            }
                        }
                    }
                }
            }
            ;if (_111 >= 8 && _111 <= 11) {
                this.gamedata.wasted--;
                this.gamedata.tspins++
                this.addToCounter("tspinCounter")
            }
            ;this.score(_111);
            let _112 = _111;
            if (_10c === 0) {
                this.gamedata.PCs++;
                this.addToCounter("pcCounter");
                _56 = this.linesAttack[9];
                _112 = this.Scoring.A.PERFECT_CLEAR;
                if (this.debug) {
                    _10f = "Perfect Clear"
                }
                ;this.score(_112);
                if (this.ISGAME && this.isPmode(false) === 6 && this.MapManager.mapData.finish === this.MapManager.FINISH_BY_PC) {
                    this.practiceModeCompleted(_40)
                }
            }
            ;if (this.ISGAME && this.isPmode(false) === 6 && this.MapManager.mapData.finish === this.MapManager.FINISH_STANDARD && this.MapManager.mapLines.length === 0) {
                this.practiceModeCompleted(_40)
            }
            ;this.fourWideFlag = this.ISGAME && this.Live.noFourWide && ((this.fourWideFlag && this.comboCounter >= 0) || this.is4W(_108));
            this.comboCounter++;
            if (this.comboCounter > 0) {
                this.score(this.Scoring.A.COMBO, this.comboCounter)
            }
            ;if (this.comboCounter > this.gamedata.maxCombo) {
                this.gamedata.maxCombo = this.comboCounter
            }
            ;var _113 = this.getComboAttack(this.comboCounter);
            this.gamedata.linesSent += _56 + _113;
            let _114 = {
                type: _112,
                b2b: this.wasBack2Back,
                cmb: this.comboCounter
            };
            if (_56 > 0 || _113 > 0) {
                if (this.GameStats) {
                    this.GameStats.get("ATTACK").set(this.gamedata.linesSent)
                }
            }
            ;if (this.ISGAME) {
                let _115 = [_112, _111, (this.wasBack2Back && this.isBack2Back), this.comboCounter];
                this.playSound(this.SFXset.getClearSFX(..._115), 1);
                if (this.VSEenabled) {
                    this.playSound(this.VSFXset.getClearSFX(..._115), 2)
                }
                ;if (this.debug && _10f) {
                    this.Live.showInChat("", _10f)
                }
            }
            ;if (this.isPmode(false)) {
                this.gamedata.attack = this.gamedata.linesSent;
                if (this.isPmode(false) === 1) {
                    if (this.linesRemaining >= _107) {
                        this.linesRemaining -= _107
                    } else {
                        this.linesRemaining = 0
                    }
                    ;if (this.ISGAME) {
                        this.lrem.textContent = this.linesRemaining
                    }
                } else {
                    if (this.isPmode(false) === 3) {
                        let _116 = this.countGarbageHeight();
                        if (this.ISGAME) {
                            if (this.cheeseLevel > _116) {
                                var _5d = this.cheeseLevel - _116;
                                this.cheeseLevel = _116;
                                this.linesRemaining -= _5d;
                                if (this.linesRemaining > this.cheeseLevel && this.cheeseLevel < this.minCheeseHeight) {
                                    this.addGarbage(1);
                                    this.cheeseLevel += 1
                                }
                            }
                            ;this.setLrem(this.linesRemaining)
                        } else {
                            let _5d = _10d - _116;
                            this.linesRemaining -= _5d
                        }
                    } else {
                        if (this.isPmode(false) === 7) {
                            if (this.ISGAME && _111 !== this.Scoring.A.TSPIN_DOUBLE) {
                                this.Caption.gameWarning(i18n.notTSD, i18n.notTSDInfo);
                                this.practiceModeCompleted()
                            }
                            ;if (this.ISGAME) {
                                this.lrem.textContent = this.gamedata.TSD
                            }
                            ;if (this.gamedata.TSD === 20) {
                                this.gamedata.TSD20 = Math.round(this.clock * 1000)
                            }
                        } else {
                            if (this.ISGAME && this.isPmode(false) === 8) {
                                if (_112 === this.Scoring.A.PERFECT_CLEAR) {
                                    this.gamedata.lastPC = this.clock;
                                    this.lrem.textContent = this.gamedata.PCs;
                                    if (this.ISGAME) {
                                        this.PCdata = {
                                            blocks: 0,
                                            lines: 0
                                        }
                                    }
                                } else {
                                    if (this.ISGAME) {
                                        this.PCdata.blocks++;
                                        this.PCdata.lines += _107;
                                        this.evalPCmodeEnd()
                                    }
                                }
                            } else {
                                if (this.ISGAME && this.isPmode(false) === 9) {
                                    let _117 = this.gamedata.lines - _107;
                                    for (let _13 = 1; _13 <= _107; ++_13) {
                                        this.ModeManager.on(this.ModeManager.LINE, _117 + _13)
                                    }
                                    ;this.ModeManager.on(this.ModeManager.LINECLEAR, _107);
                                    if (_56 > 0) {
                                        this.blockOrSendAttack(_56, _40)
                                    }
                                    ;if (_113 > 0) {
                                        this.blockOrSendAttack(_113, _40)
                                    }
                                }
                            }
                        }
                    }
                }
                ;if (!this.linesRemaining && this.ISGAME) {
                    this.practiceModeCompleted()
                }
            } else {
                if (this.ISGAME) {
                    if (this.fourWideFlag && _113 && this.Live.noFourWide) {
                        this.Caption.gameWarning(i18n.fwDetect, i18n.fwDetectInfo);
                        while (_113 > 0) {
                            this.addGarbage(1);
                            --_113
                        }
                    }
                    ;let _118 = null
                    , _119 = null;
                    if (_56 > 0) {
                        _118 = this.blockOrSendAttack(_56, _40)
                    }
                    ;if (_113 > 0) {
                        _119 = this.blockOrSendAttack(_113, _40)
                    }
                    ;if (_118 || _119) {
                        this.Live.sendAttack(_118, _119, _114)
                    }
                }
            }
            ;if (this.ISGAME) {
                if (_10b) {
                    this.Items.pickup()
                }
                ;if (this.R.clearDelay && !this.redrawBlocked) {
                    this.play = false;
                    this.redrawBlocked = true;
                    this.animator = new LineClearAnimator(_10e,_92,this)
                }
            } else {
                this.v.onLinesCleared(_56, _113, _114)
            }
        } else {
            this.comboCounter = -1;
            let _112 = null;
            if (this.spinPossible) {
                _112 = this.Scoring.A.TSPIN;
                if (this.debug && this.ISGAME) {
                    this.Live.showInChat("", _35.name + "-Spin")
                }
            } else {
                if (this.spinMiniPossible) {
                    _112 = this.Scoring.A.TSPIN_MINI;
                    if (this.debug && this.ISGAME) {
                        this.Live.showInChat("", _35.name + "-Spin Mini")
                    }
                }
            }
            ;if (_112) {
                this.score(_112);
                if (this.ISGAME) {
                    let _115 = [_112, _112, false, -1];
                    this.playSound(this.SFXset.getClearSFX(..._115), 1);
                    if (this.VSEenabled) {
                        this.playSound(this.VSFXset.getClearSFX(..._115), 2)
                    }
                }
            }
            ;if (this.ISGAME && this.isPmode(false) === 3) {
                var _11a = this.maxCheeseHeight - this.cheeseLevel;
                if (_11a > 0) {
                    var _11b = Math.min(_11a, this.linesRemaining - this.cheeseLevel);
                    for (let _13 = 0; _13 < _11b; _13++) {
                        this.addGarbage(1)
                    }
                    ;this.cheeseLevel += _11b
                }
            } else {
                if (this.ISGAME && this.isPmode(false) === 8) {
                    this.PCdata.blocks++;
                    this.evalPCmodeEnd()
                }
            }
        }
    }

}