// ==UserScript==
// @name         Azelfie's Showdown Music Mod
// @namespace    https://github.com/ShadowKirby21/ssmm-showdown/
// @version      1.0
// @description  Sauce's Showdown Music Mod, but slightly different
// @author       Azelfie
// @match     https://play.pokemonshowdown.com/*
// @match     http://play.pokemonshowdown.com/*
// @grant        none
// @license      AGPL-3.0; https://github.com/smogon/pokemon-showdown-client/blob/master/LICENSE
// @downloadURL https://update.greasyfork.org/scripts/448258/Azelfie%27s%20Showdown%20Music%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/448258/Azelfie%27s%20Showdown%20Music%20Mod.meta.js
// ==/UserScript==

// == PART 1 ==

var
    BattleBGM = function () {
        function BattleBGM(url, loopstart, loopend) {
            this.sound = void 0;
            this.url = void 0;
            this.timer = undefined;
            this.loopstart = void 0;
            this.loopend = void 0;
            this.isPlaying = false;
            this.isActuallyPlaying = false;
            this.willRewind = true;
            this.url = url;
            this.loopstart = loopstart;
            this.loopend = loopend;
        }
        var _proto = BattleBGM.prototype;
        _proto.
            play = function play() {
                this.willRewind = true;
                this.resume();
            };
        _proto.
            resume = function resume() {
                this.isPlaying = true;
                this.actuallyResume();
            };
        _proto.
            pause = function pause() {
                this.isPlaying = false;
                this.actuallyPause();
                BattleBGM.update();
            };
        _proto.
            stop = function stop() {
                this.pause();
                this.willRewind = true;
            };
        _proto.
            destroy = function destroy() {
                BattleSound.deleteBgm(this);
                this.pause();
            };
        _proto.

            actuallyResume = function actuallyResume() {
                if (this !== BattleSound.currentBgm()) return;
                if (this.isActuallyPlaying) return;

                if (!this.sound) this.sound = BattleSound.getSoundSpecial(this.url);
                if (!this.sound) return;
                if (this.willRewind) this.sound.currentTime = 0;
                this.willRewind = false;
                this.isActuallyPlaying = true;
                this.sound.volume = BattleSound.bgmVolume / 100;
                this.sound.play();
                this.updateTime();
            };
        _proto.
            actuallyPause = function actuallyPause() {
                if (!this.isActuallyPlaying) return;
                this.isActuallyPlaying = false;
                this.sound.pause();
                this.updateTime();
            };
        _proto.

            updateTime = function updateTime() {
                var _this = this;
                clearTimeout(this.timer);
                this.timer = undefined;
                if (this !== BattleSound.currentBgm()) return;
                if (!this.sound) return;

                var progress = this.sound.currentTime * 1000;
                if (progress > this.loopend - 1000) {
                    this.sound.currentTime -= (this.loopend - this.loopstart) / 1000;
                }

                this.timer = setTimeout(function () {
                    _this.updateTime();
                }, Math.max(this.loopend - progress, 1));
            };
        BattleBGM.

            update = function update() {
                var current = BattleSound.currentBgm();
                for (var _i = 0, _BattleSound$bgm =
                    BattleSound.bgm; _i < _BattleSound$bgm.length; _i++) {
                    var bgm = _BattleSound$bgm[_i];
                    if (bgm.isPlaying) {
                        if (bgm === current) {
                            bgm.actuallyResume();
                        } else {
                            bgm.actuallyPause();
                        }
                    }
                }
            };
        return BattleBGM;
    }();































// == PART 2 ==

var BattleSound = new (function () {
    function _class2() {
        this.
            soundCache = {};
        this.

            bgm = [];
        this.

            effectVolume = 50;
        this.
            bgmVolume = 50;
        this.
            muted = false;
    }
    var _proto2 = _class2.prototype;
    _proto2.

        getSound = function getSound(url) {
            if (!window.HTMLAudioElement) return;
            if (this.soundCache[url]) return this.soundCache[url];
            try {
                var sound = document.createElement('audio');
                sound.src = 'https://' + Config.routes.client + '/' + url;
                sound.volume = this.effectVolume / 100;
                this.soundCache[url] = sound;
                return sound;
            } catch (_unused) {
                console.log(_unused)
            }
        };
    _proto2.

        getSoundSpecial = function getSoundSpecial(url) {
            if (!window.HTMLAudioElement) return;
            if (this.soundCache[url]) return this.soundCache[url];
            try {
                var sound = document.createElement('audio');
                sound.src = url;
                sound.volume = this.effectVolume / 100;
                this.soundCache[url] = sound;
                return sound;
            } catch (_unused) {
                console.log(_unused)
            }
        };
    _proto2.

        playEffect = function playEffect(url) {
            this.playSound(url, this.muted ? 0 : this.effectVolume);
        };
    _proto2.

        playSound = function playSound(url, volume) {
            if (!volume) return;
            var effect = this.getSound(url);
            if (effect) {
                effect.volume = volume / 100;
                effect.play();
            }
        };
    _proto2.

        loadBgm = function loadBgm(url, loopstart, loopend, replaceBGM) {
            if (replaceBGM) {
                replaceBGM.stop();
                this.deleteBgm(replaceBGM);
            }

            var bgm = new BattleBGM(url, loopstart, loopend);
            this.bgm.push(bgm);
            return bgm;
        };
    _proto2.
        deleteBgm = function deleteBgm(bgm) {
            var soundIndex = BattleSound.bgm.indexOf(bgm);
            if (soundIndex >= 0) BattleSound.bgm.splice(soundIndex, 1);
        };
    _proto2.

        currentBgm = function currentBgm() {
            if (!this.bgmVolume || this.muted) return false;
            for (var _i2 = 0, _this$bgm =
                this.bgm; _i2 < _this$bgm.length; _i2++) {
                var bgm = _this$bgm[_i2];
                if (bgm.isPlaying) return bgm;
            }
            return null;
        };
    _proto2.

        setMute = function setMute(muted) {
            muted = !!muted;
            if (this.muted === muted) return;
            this.muted = muted;
            BattleBGM.update();
        };
    _proto2.

        loudnessPercentToAmplitudePercent = function loudnessPercentToAmplitudePercent(loudnessPercent) {
            var decibels = 10 * Math.log(loudnessPercent / 100) / Math.log(2);
            return Math.pow(10, decibels / 20) * 100;
        };
    _proto2.
        setBgmVolume = function setBgmVolume(bgmVolume) {
            this.bgmVolume = this.loudnessPercentToAmplitudePercent(bgmVolume);
            BattleBGM.update();
        };
    _proto2.
        setEffectVolume = function setEffectVolume(effectVolume) {
            this.effectVolume = this.loudnessPercentToAmplitudePercent(effectVolume);
        };
    return _class2;
}())();
































// == PART 3 ==

BattleScene = function () {
    function BattleScene(battle, $frame, $logFrame) {
        this.battle = void 0;
        this.animating = true;
        this.acceleration = 1;
        this.gen = 7;
        this.mod = '';
        this.activeCount = 1;
        this.numericId = 0;
        this.$frame = void 0;
        this.$battle = null;
        this.$options = null;
        this.log = void 0;
        this.$terrain = null;
        this.$weather = null;
        this.$bgEffect = null;
        this.$bg = null;
        this.$sprite = null;
        this.$sprites = [null, null];
        this.$spritesFront = [null, null];
        this.$stat = null;
        this.$fx = null;
        this.$leftbar = null;
        this.$rightbar = null;
        this.$turn = null;
        this.$messagebar = null;
        this.$delay = null;
        this.$hiddenMessage = null;
        this.$tooltips = null;
        this.tooltips = void 0;
        this.sideConditions = [{}, {}];
        this.preloadDone = 0;
        this.preloadNeeded = 0;
        this.bgm = null;
        this.backdropImage = '';
        this.bgmNum = 0;
        this.preloadCache = {};
        this.messagebarOpen = false;
        this.customControls = false;
        this.interruptionCount = 1;
        this.curWeather = '';
        this.curTerrain = '';
        this.timeOffset = 0;
        this.pokemonTimeOffset = 0;
        this.minDelay = 0;
        this.activeAnimations = $();
        this.battle = battle;

        $frame.addClass('battle');
        this.$frame = $frame;
        this.log = new BattleLog($logFrame[0], this);
        this.log.battleParser.pokemonName = function (pokemonId) {
            if (!pokemonId) return '';
            if (battle.ignoreNicks || battle.ignoreOpponent) {
                var pokemon = battle.getPokemon(pokemonId);
                if (pokemon) return pokemon.speciesForme;
            }
            if (!pokemonId.startsWith('p')) return '???pokemon:' + pokemonId + '???';
            if (pokemonId.charAt(3) === ':') return pokemonId.slice(4).trim();
            else
                if (pokemonId.charAt(2) === ':') return pokemonId.slice(3).trim();
            return '???pokemon:' + pokemonId + '???';
        };

        var numericId = 0;
        if (battle.id) {
            numericId = parseInt(battle.id.slice(battle.id.lastIndexOf('-') + 1), 10);
            if (this.battle.id.includes('digimon')) this.mod = 'digimon';
        }
        if (!numericId) {
            numericId = Math.floor(Math.random() * 1000000);
        }
        this.numericId = numericId;
        this.tooltips = new BattleTooltips(battle);
        this.tooltips.listen($frame[0]);

        this.preloadEffects();
    }
    var _proto = BattleScene.prototype;
    _proto.

        reset = function reset() {
            this.updateGen();

            if (this.$options) {
                this.log.reset();
            } else {
                this.$options = $('<div class="battle-options"></div>');
                $(this.log.elem).prepend(this.$options);
            }

            this.$frame.empty();
            this.$battle = $('<div class="innerbattle"></div>');
            this.$frame.append(this.$battle);

            this.$bg = $('<div class="backdrop" style="background-image:url(' + Dex.resourcePrefix + this.backdropImage + ');display:block;opacity:0.8"></div>');
            this.$terrain = $('<div class="weather"></div>');
            this.$weather = $('<div class="weather"></div>');
            this.$bgEffect = $('<div></div>');
            this.$sprite = $('<div></div>');

            this.$sprites = [$('<div></div>'), $('<div></div>')];
            this.$spritesFront = [$('<div></div>'), $('<div></div>')];

            this.$sprite.append(this.$sprites[1]);
            this.$sprite.append(this.$spritesFront[1]);
            this.$sprite.append(this.$spritesFront[0]);
            this.$sprite.append(this.$sprites[0]);

            this.$stat = $('<div role="complementary" aria-label="Active Pokemon"></div>');
            this.$fx = $('<div></div>');
            this.$leftbar = $('<div class="leftbar" role="complementary" aria-label="Your Team"></div>');
            this.$rightbar = $('<div class="rightbar" role="complementary" aria-label="Opponent\'s Team"></div>');
            this.$turn = $('<div></div>');
            this.$messagebar = $('<div class="messagebar message"></div>');
            this.$delay = $('<div></div>');
            this.$hiddenMessage = $('<div class="message" style="position:absolute;display:block;visibility:hidden"></div>');
            this.$tooltips = $('<div class="tooltips"></div>');

            this.$battle.append(this.$bg);
            this.$battle.append(this.$terrain);
            this.$battle.append(this.$weather);
            this.$battle.append(this.$bgEffect);
            this.$battle.append(this.$sprite);
            this.$battle.append(this.$stat);
            this.$battle.append(this.$fx);
            this.$battle.append(this.$leftbar);
            this.$battle.append(this.$rightbar);
            this.$battle.append(this.$turn);
            this.$battle.append(this.$messagebar);
            this.$battle.append(this.$delay);
            this.$battle.append(this.$hiddenMessage);
            this.$battle.append(this.$tooltips);

            if (!this.animating) {
                this.$battle.append('<div class="seeking"><strong>seeking...</strong></div>');
            }

            this.messagebarOpen = false;
            this.timeOffset = 0;
            this.pokemonTimeOffset = 0;
            this.curTerrain = '';
            this.curWeather = '';

            this.log.battleParser.perspective = this.battle.mySide.sideid;

            this.resetSides(true);
        };
    _proto.

        animationOff = function animationOff() {
            this.$battle.append('<div class="seeking"><strong>seeking...</strong></div>');
            this.stopAnimation();

            this.animating = false;
            this.$messagebar.empty().css({
                opacity: 0,
                height: 0
            });
        };
    _proto.
        stopAnimation = function stopAnimation() {
            this.interruptionCount++;
            this.$battle.find(':animated').finish();
            this.$fx.empty();
        };
    _proto.
        animationOn = function animationOn() {
            if (this.animating) return;
            $.fx.off = false;
            this.animating = true;
            this.$battle.find('.seeking').remove();
            this.updateSidebars();
            for (var _i = 0, _this$battle$sides =
                this.battle.sides; _i < _this$battle$sides.length; _i++) {
                var side = _this$battle$sides[_i];
                for (var _i2 = 0, _side$pokemon =
                    side.pokemon; _i2 < _side$pokemon.length; _i2++) {
                    var pokemon = _side$pokemon[_i2];
                    pokemon.sprite.reset(pokemon);
                }
            }
            this.updateWeather(true);
            this.resetTurn();
            this.resetSideConditions();
        };
    _proto.
        pause = function pause() {
            var _this = this;
            this.stopAnimation();
            this.updateBgm();
            if (this.battle.turn > 0) {
                this.$frame.append('<div class="playbutton"><button name="play"><i class="fa fa-play icon-play"></i> Resume</button></div>');
            } else {
                this.$frame.append('<div class="playbutton"><button name="play"><i class="fa fa-play"></i> Play</button><br /><br /><button name="play-muted" class="startsoundchooser" style="font-size:10pt;display:none">Play (music off)</button></div>');
                this.$frame.find('div.playbutton button[name=play-muted]').click(function () {
                    _this.setMute(true);
                    _this.battle.play();
                });
            }
            this.$frame.find('div.playbutton button[name=play]').click(function () {
                return _this.battle.play();
            });
        };
    _proto.
        resume = function resume() {
            this.$frame.find('div.playbutton').remove();
            this.updateBgm();
        };
    _proto.
        setMute = function setMute(muted) {
            BattleSound.setMute(muted);
        };
    _proto.
        wait = function wait(time) {
            if (!this.animating) return;
            this.timeOffset += time;
        };
    _proto.

        addSprite = function addSprite(sprite) {
            if (sprite.$el) this.$sprites[+sprite.isFrontSprite].append(sprite.$el);
        };
    _proto.
        showEffect = function showEffect(effect, start, end, transition, after) {
            if (typeof effect === 'string') effect = BattleEffects[effect];
            if (!start.time) start.time = 0;
            if (!end.time) end.time = start.time + 500;
            start.time += this.timeOffset;
            end.time += this.timeOffset;
            if (!end.scale && end.scale !== 0 && start.scale) end.scale = start.scale;
            if (!end.xscale && end.xscale !== 0 && start.xscale) end.xscale = start.xscale;
            if (!end.yscale && end.yscale !== 0 && start.yscale) end.yscale = start.yscale;
            end = Object.assign({}, start, end);

            var startpos = this.pos(start, effect);
            var endpos = this.posT(end, effect, transition, start);

            var $effect = $('<img src="' + effect.url + '" style="display:block;position:absolute" />');
            this.$fx.append($effect);
            $effect = this.$fx.children().last();

            if (start.time) {
                $effect.css(Object.assign({}, startpos, {
                    opacity: 0
                }));
                $effect.delay(start.time).animate({
                    opacity: startpos.opacity
                },
                    1);
            } else {
                $effect.css(startpos);
            }
            $effect.animate(endpos, end.time - start.time);
            if (after === 'fade') {
                $effect.animate({
                    opacity: 0
                },
                    100);
            }
            if (after === 'explode') {
                if (end.scale) end.scale *= 3;
                if (end.xscale) end.xscale *= 3;
                if (end.yscale) end.yscale *= 3;
                end.opacity = 0;
                var endendpos = this.pos(end, effect);
                $effect.animate(endendpos, 200);
            }
            this.waitFor($effect);
        };
    _proto.
        backgroundEffect = function backgroundEffect(bg, duration) {
            var opacity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
            var delay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
            var $effect = $('<div class="background"></div>');
            $effect.css({
                background: bg,
                display: 'block',
                opacity: 0
            });

            this.$bgEffect.append($effect);
            $effect.delay(delay).animate({
                opacity: opacity
            },
                250).delay(duration - 250);
            $effect.animate({
                opacity: 0
            },
                250);
        };
    _proto.

        pos = function pos(loc, obj) {
            loc = Object.assign({
                x: 0,
                y: 0,
                z: 0,
                scale: 1,
                opacity: 1
            },
                loc);

            if (!loc.xscale && loc.xscale !== 0) loc.xscale = loc.scale;
            if (!loc.yscale && loc.yscale !== 0) loc.yscale = loc.scale;

            var left = 210;
            var top = 245;
            var scale = obj.gen === 5 ?
                2.0 - loc.z / 200 :
                1.5 - 0.5 * (loc.z / 200);
            if (scale < .1) scale = .1;

            left += (410 - 190) * (loc.z / 200);
            top += (135 - 245) * (loc.z / 200);
            left += Math.floor(loc.x * scale);
            top -= Math.floor(loc.y * scale);
            var width = Math.floor(obj.w * scale * loc.xscale);
            var height = Math.floor(obj.h * scale * loc.yscale);
            var hoffset = Math.floor((obj.h - (obj.y || 0) * 2) * scale * loc.yscale);
            left -= Math.floor(width / 2);
            top -= Math.floor(hoffset / 2);

            var pos = {
                left: left,
                top: top,
                width: width,
                height: height,
                opacity: loc.opacity
            };

            if (loc.display) pos.display = loc.display;
            return pos;
        };
    _proto.

        posT = function posT(loc, obj, transition, oldLoc) {
            var pos = this.pos(loc, obj);
            var oldPos = oldLoc ? this.pos(oldLoc, obj) : null;
            var transitionMap = {
                left: 'linear',
                top: 'linear',
                width: 'linear',
                height: 'linear',
                opacity: 'linear'
            };

            if (transition === 'ballistic') {
                transitionMap.top = pos.top < oldPos.top ? 'ballisticUp' : 'ballisticDown';
            }
            if (transition === 'ballisticUnder') {
                transitionMap.top = pos.top < oldPos.top ? 'ballisticDown' : 'ballisticUp';
            }
            if (transition === 'ballistic2') {
                transitionMap.top = pos.top < oldPos.top ? 'quadUp' : 'quadDown';
            }
            if (transition === 'ballistic2Back') {
                transitionMap.top = loc.z > 0 ? 'quadUp' : 'quadDown';
            }
            if (transition === 'ballistic2Under') {
                transitionMap.top = pos.top < oldPos.top ? 'quadDown' : 'quadUp';
            }
            if (transition === 'swing') {
                transitionMap.left = 'swing';
                transitionMap.top = 'swing';
                transitionMap.width = 'swing';
                transitionMap.height = 'swing';
            }
            if (transition === 'accel') {
                transitionMap.left = 'quadDown';
                transitionMap.top = 'quadDown';
                transitionMap.width = 'quadDown';
                transitionMap.height = 'quadDown';
            }
            if (transition === 'decel') {
                transitionMap.left = 'quadUp';
                transitionMap.top = 'quadUp';
                transitionMap.width = 'quadUp';
                transitionMap.height = 'quadUp';
            }
            return {
                left: [pos.left, transitionMap.left],
                top: [pos.top, transitionMap.top],
                width: [pos.width, transitionMap.width],
                height: [pos.height, transitionMap.height],
                opacity: [pos.opacity, transitionMap.opacity]
            };
        };
    _proto.

        waitFor = function waitFor(elem) {
            this.activeAnimations = this.activeAnimations.add(elem);
        };
    _proto.

        startAnimations = function startAnimations() {
            this.$fx.empty();
            this.activeAnimations = $();
            this.timeOffset = 0;
            this.minDelay = 0;
        };
    _proto.

        finishAnimations = function finishAnimations() {
            if (this.minDelay || this.timeOffset) {
                this.$delay.delay(Math.max(this.minDelay, this.timeOffset));
                this.activeAnimations = this.activeAnimations.add(this.$delay);
            }
            if (!this.activeAnimations.length) return undefined;
            return this.activeAnimations.promise();
        };
    _proto.

        preemptCatchup = function preemptCatchup() {
            this.log.preemptCatchup();
        };
    _proto.
        message = function message(_message) {
            var _this2 = this;
            if (!this.messagebarOpen) {
                this.log.addSpacer();
                if (this.animating) {
                    this.$messagebar.empty();
                    this.$messagebar.css({
                        display: 'block',
                        opacity: 0,
                        height: 'auto'
                    });

                    this.$messagebar.animate({
                        opacity: 1
                    },
                        this.battle.messageFadeTime / this.acceleration);
                }
            }
            if (this.battle.hardcoreMode && _message.slice(0, 8) === '<small>(') {
                _message = '';
            }
            if (_message && this.animating) {
                this.$hiddenMessage.append('<p></p>');
                var $message = this.$hiddenMessage.children().last();
                $message.html(_message);
                $message.css({
                    display: 'block',
                    opacity: 0
                });

                $message.animate({
                    height: 'hide'
                },
                    1,
                    function () {
                        $message.appendTo(_this2.$messagebar);
                        $message.animate({
                            height: 'show',
                            'padding-bottom': 4,
                            opacity: 1
                        },
                            _this2.battle.messageFadeTime / _this2.acceleration);
                    });
                this.waitFor($message);
            }
            this.messagebarOpen = true;
        };
    _proto.
        maybeCloseMessagebar = function maybeCloseMessagebar(args, kwArgs) {
            if (this.log.battleParser.sectionBreak(args, kwArgs)) {
                if (!this.messagebarOpen) return false;
                this.closeMessagebar();
                return true;
            }
            return false;
        };
    _proto.
        closeMessagebar = function closeMessagebar() {
            if (this.messagebarOpen) {
                this.messagebarOpen = false;
                if (this.animating) {
                    this.$messagebar.delay(this.battle.messageShownTime / this.acceleration).animate({
                        opacity: 0
                    },
                        this.battle.messageFadeTime / this.acceleration);
                    this.waitFor(this.$messagebar);
                }
                return true;
            }
            return false;
        };
    _proto.

        runMoveAnim = function runMoveAnim(moveid, participants) {
            if (!this.animating) return;
            var animEntry = BattleMoveAnims[moveid];
            if (this.acceleration >= 3) {
                var targetsSelf = !participants[1] || participants[0] === participants[1];
                var isSpecial = !targetsSelf && this.battle.dex.moves.get(moveid).category === 'Special';
                animEntry = BattleOtherAnims[targetsSelf ? 'fastanimself' : isSpecial ? 'fastanimspecial' : 'fastanimattack'];
            } else if (!animEntry) {
                animEntry = BattleMoveAnims['tackle'];
            }
            animEntry.anim(this, participants.map(function (p) {
                return p.sprite;
            }));
        };
    _proto.

        runOtherAnim = function runOtherAnim(moveid, participants) {
            if (!this.animating) return;
            BattleOtherAnims[moveid].anim(this, participants.map(function (p) {
                return p.sprite;
            }));
        };
    _proto.

        runStatusAnim = function runStatusAnim(moveid, participants) {
            if (!this.animating) return;
            BattleStatusAnims[moveid].anim(this, participants.map(function (p) {
                return p.sprite;
            }));
        };
    _proto.

        runResidualAnim = function runResidualAnim(moveid, pokemon) {
            if (!this.animating) return;
            BattleMoveAnims[moveid].residualAnim(this, [pokemon.sprite]);
        };
    _proto.

        runPrepareAnim = function runPrepareAnim(moveid, attacker, defender) {
            if (!this.animating || this.acceleration >= 3) return;
            var moveAnim = BattleMoveAnims[moveid];
            if (!moveAnim.prepareAnim) return;
            moveAnim.prepareAnim(this, [attacker.sprite, defender.sprite]);
        };
    _proto.

        updateGen = function updateGen() {
            var _this$battle$nearSide;
            var gen = this.battle.gen;
            if (Dex.prefs('nopastgens')) gen = 6;
            if (Dex.prefs('bwgfx') && gen > 5) gen = 5;
            this.gen = gen;
            this.activeCount = ((_this$battle$nearSide = this.battle.nearSide) == null ? void 0 : _this$battle$nearSide.active.length) || 1;

            var isSPL = typeof this.battle.rated === 'string' && this.battle.rated.startsWith("Smogon Premier League");
            var bg;
            if (isSPL) {
                if (gen <= 1) bg = 'fx/bg-gen1-spl.png';
                else
                    if (gen <= 2) bg = 'fx/bg-gen2-spl.png';
                    else
                        if (gen <= 3) bg = 'fx/bg-gen3-spl.png';
                        else
                            if (gen <= 4) bg = 'fx/bg-gen4-spl.png';
                            else
                                bg = 'fx/bg-spl.png';
                this.setBgm(-101);
            } else {
                if (gen <= 1) bg = 'fx/bg-gen1.png?';
                else
                    if (gen <= 2) bg = 'fx/bg-gen2.png?';
                    else
                        if (gen <= 3) bg = 'fx/' + BattleBackdropsThree[this.numericId % BattleBackdropsThree.length] + '?';
                        else
                            if (gen <= 4) bg = 'fx/' + BattleBackdropsFour[this.numericId % BattleBackdropsFour.length];
                            else
                                if (gen <= 5) bg = 'fx/' + BattleBackdropsFive[this.numericId % BattleBackdropsFive.length];
                                else
                                    bg = 'sprites/gen6bgs/' + BattleBackdrops[this.numericId % BattleBackdrops.length];
            }

            this.backdropImage = bg;
            if (this.$bg) {
                this.$bg.css('background-image', 'url(' + Dex.resourcePrefix + '' + this.backdropImage + ')');
            }
        };
    _proto.

        getDetailsText = function getDetailsText(pokemon) {
            var _pokemon$side;
            var name = (_pokemon$side = pokemon.side) != null && _pokemon$side.isFar && (
                this.battle.ignoreOpponent || this.battle.ignoreNicks) ? pokemon.speciesForme : pokemon.name;
            if (name !== pokemon.speciesForme) {
                name += ' (' + pokemon.speciesForme + ')';
            }
            if (pokemon === pokemon.side.active[0]) {
                name += ' (active)';
            } else if (pokemon.fainted) {
                name += ' (fainted)';
            } else {
                var statustext = '';
                if (pokemon.hp !== pokemon.maxhp) {
                    statustext += pokemon.getHPText();
                }
                if (pokemon.status) {
                    if (statustext) statustext += '|';
                    statustext += pokemon.status;
                }
                if (statustext) {
                    name += ' (' + statustext + ')';
                }
            }
            return BattleLog.escapeHTML(name);
        };
    _proto.
        getSidebarHTML = function getSidebarHTML(side, posStr) {
            var noShow = this.battle.hardcoreMode && this.battle.gen < 7;

            var speciesOverage = this.battle.speciesClause ? Infinity : Math.max(side.pokemon.length - side.totalPokemon, 0);
            var sidebarIcons =

                [];
            var speciesTable = [];
            var zoroarkRevealed = false;
            var hasIllusion = false;
            if (speciesOverage) {
                for (var i = 0; i < side.pokemon.length; i++) {
                    var species = side.pokemon[i].getBaseSpecies().baseSpecies;
                    if (speciesOverage && speciesTable.includes(species)) {
                        for (var _i3 = 0; _i3 <
                            sidebarIcons.length; _i3++) {
                            var sidebarIcon = sidebarIcons[_i3];
                            if (side.pokemon[sidebarIcon[1]].getBaseSpecies().baseSpecies === species) {
                                sidebarIcon[0] = 'pokemon-illusion';
                            }
                        }
                        hasIllusion = true;
                        speciesOverage--;
                    } else {
                        sidebarIcons.push(['pokemon', i]);
                        speciesTable.push(species);
                        if (['Zoroark', 'Zorua'].includes(species)) {
                            zoroarkRevealed = true;
                        }
                    }
                }
            } else {
                for (var _i4 = 0; _i4 < side.pokemon.length; _i4++) {
                    sidebarIcons.push(['pokemon', _i4]);
                }
            }
            if (!zoroarkRevealed && hasIllusion && sidebarIcons.length < side.totalPokemon) {
                sidebarIcons.push(['pseudo-zoroark', null]);
            }
            while (sidebarIcons.length < side.totalPokemon) {
                sidebarIcons.push(['unrevealed', null]);
            }
            while (sidebarIcons.length < 6) {
                sidebarIcons.push(['empty', null]);
            }

            var pokemonhtml = '';
            for (var _i5 = 0; _i5 < sidebarIcons.length; _i5++) {
                var _sidebarIcons$_i = sidebarIcons[_i5],
                    iconType = _sidebarIcons$_i[0],
                    pokeIndex = _sidebarIcons$_i[1];
                var poke = pokeIndex !== null ? side.pokemon[pokeIndex] : null;
                var tooltipCode = " class=\"picon has-tooltip\" data-tooltip=\"pokemon|" + side.n + "|" + pokeIndex + (iconType === 'pokemon-illusion' ? '|illusion' : '') + "\"";
                if (iconType === 'empty') {
                    pokemonhtml += "<span class=\"picon\" style=\"" + Dex.getPokemonIcon('pokeball-none') + "\"></span>";
                } else if (noShow) {
                    if (poke != null && poke.fainted) {
                        pokemonhtml += "<span" + tooltipCode + " style=\"" + Dex.getPokemonIcon('pokeball-fainted') + "\" aria-label=\"Fainted\"></span>";
                    } else if (poke != null && poke.status) {
                        pokemonhtml += "<span" + tooltipCode + " style=\"" + Dex.getPokemonIcon('pokeball-statused') + "\" aria-label=\"Statused\"></span>";
                    } else {
                        pokemonhtml += "<span" + tooltipCode + " style=\"" + Dex.getPokemonIcon('pokeball') + "\" aria-label=\"Non-statused\"></span>";
                    }
                } else if (iconType === 'pseudo-zoroark') {
                    pokemonhtml += "<span class=\"picon\" style=\"" + Dex.getPokemonIcon('zoroark') + "\" title=\"Unrevealed Illusion user\" aria-label=\"Unrevealed Illusion user\"></span>";
                } else if (!poke) {
                    pokemonhtml += "<span class=\"picon\" style=\"" + Dex.getPokemonIcon('pokeball') + "\" title=\"Not revealed\" aria-label=\"Not revealed\"></span>";
                } else if (!poke.ident && this.battle.teamPreviewCount && this.battle.teamPreviewCount < side.pokemon.length) {
                    var details = this.getDetailsText(poke);
                    pokemonhtml += "<span" + tooltipCode + " style=\"" + Dex.getPokemonIcon(poke, !side.isFar) + (";opacity:0.6\" aria-label=\"" + details + "\"></span>");
                } else {
                    var _details = this.getDetailsText(poke);
                    pokemonhtml += "<span" + tooltipCode + " style=\"" + Dex.getPokemonIcon(poke, !side.isFar) + ("\" aria-label=\"" + _details + "\"></span>");
                }
                if (_i5 % 3 === 2) pokemonhtml += "</div><div class=\"teamicons\">";
            }
            pokemonhtml = '<div class="teamicons">' + pokemonhtml + '</div>';
            var ratinghtml = side.rating ? " title=\"Rating: " + BattleLog.escapeHTML(side.rating) + "\"" : "";
            var faded = side.name ? "" : " style=\"opacity: 0.4\"";
            return "<div class=\"trainer trainer-" + posStr + "\"" + faded + "><strong>" + BattleLog.escapeHTML(side.name) + "</strong><div class=\"trainersprite\"" + ratinghtml + " style=\"background-image:url(" + Dex.resolveAvatar(side.avatar) + ")\"></div>" + pokemonhtml + "</div>";
        };
    _proto.
        updateSidebar = function updateSidebar(side) {
            if (this.battle.gameType === 'freeforall') {
                this.updateLeftSidebar();
                this.updateRightSidebar();
            } else if (side === this.battle.nearSide || side === this.battle.nearSide.ally) {
                this.updateLeftSidebar();
            } else {
                this.updateRightSidebar();
            }
        };
    _proto.
        updateLeftSidebar = function updateLeftSidebar() {
            var side = this.battle.nearSide;

            if (side.ally) {
                var side2 = side.ally;
                this.$leftbar.html(this.getSidebarHTML(side, 'near2') + this.getSidebarHTML(side2, 'near'));
            } else if (this.battle.sides.length > 2) {
                var _side = this.battle.sides[side.n === 0 ? 3 : 2];
                this.$leftbar.html(this.getSidebarHTML(_side, 'near2') + this.getSidebarHTML(side, 'near'));
            } else {
                this.$leftbar.html(this.getSidebarHTML(side, 'near'));
            }
        };
    _proto.
        updateRightSidebar = function updateRightSidebar() {
            var side = this.battle.farSide;

            if (side.ally) {
                var side2 = side.ally;
                this.$rightbar.html(this.getSidebarHTML(side, 'far2') + this.getSidebarHTML(side2, 'far'));
            } else if (this.battle.sides.length > 2) {
                var _side2 = this.battle.sides[side.n === 0 ? 3 : 2];
                this.$rightbar.html(this.getSidebarHTML(_side2, 'far2') + this.getSidebarHTML(side, 'far'));
            } else {
                this.$rightbar.html(this.getSidebarHTML(side, 'far'));
            }
        };
    _proto.
        updateSidebars = function updateSidebars() {
            this.updateLeftSidebar();
            this.updateRightSidebar();
        };
    _proto.
        updateStatbars = function updateStatbars() {
            for (var _i6 = 0, _this$battle$sides2 =
                this.battle.sides; _i6 < _this$battle$sides2.length; _i6++) {
                var side = _this$battle$sides2[_i6];
                for (var _i7 = 0, _side$active =
                    side.active; _i7 < _side$active.length; _i7++) {
                    var active = _side$active[_i7];
                    if (active) active.sprite.updateStatbar(active);
                }
            }
        };
    _proto.

        resetSides = function resetSides(skipEmpty) {
            if (!skipEmpty) {
                for (var _i8 = 0, _this$$sprites =
                    this.$sprites; _i8 < _this$$sprites.length; _i8++) {
                    var $spritesContainer = _this$$sprites[_i8];
                    $spritesContainer.empty();
                }
            }
            for (var _i9 = 0, _this$battle$sides3 =
                this.battle.sides; _i9 < _this$battle$sides3.length; _i9++) {
                var _side$missedPokemon, _side$missedPokemon$s;
                var side = _this$battle$sides3[_i9];
                side.z = side.isFar ? 200 : 0;
                (_side$missedPokemon = side.missedPokemon) == null ? void 0 : (_side$missedPokemon$s = _side$missedPokemon.sprite) == null ? void 0 : _side$missedPokemon$s.destroy();

                side.missedPokemon = {
                    sprite: new PokemonSprite(null, {
                        x: side.leftof(-100),
                        y: side.y,
                        z: side.z,
                        opacity: 0
                    },
                        this, side.isFar)
                };

                side.missedPokemon.sprite.isMissedPokemon = true;
            }
            if (this.battle.sides.length > 2 && this.sideConditions.length === 2) {
                this.sideConditions.push({}, {});
            }
            this.rebuildTooltips();
        };
    _proto.
        rebuildTooltips = function rebuildTooltips() {
            var tooltipBuf = '';
            var tooltips = this.battle.gameType === 'freeforall' ? {
                p2b: {
                    top: 70,
                    left: 250,
                    width: 80,
                    height: 100,
                    tooltip: 'activepokemon|1|1'
                },
                p2a: {
                    top: 90,
                    left: 390,
                    width: 100,
                    height: 100,
                    tooltip: 'activepokemon|1|0'
                },
                p1a: {
                    top: 200,
                    left: 130,
                    width: 120,
                    height: 160,
                    tooltip: 'activepokemon|0|0'
                },
                p1b: {
                    top: 200,
                    left: 350,
                    width: 150,
                    height: 160,
                    tooltip: 'activepokemon|0|1'
                }
            } : {
                p2c: {
                    top: 70,
                    left: 250,
                    width: 80,
                    height: 100,
                    tooltip: 'activepokemon|1|2'
                },
                p2b: {
                    top: 85,
                    left: 320,
                    width: 90,
                    height: 100,
                    tooltip: 'activepokemon|1|1'
                },
                p2a: {
                    top: 90,
                    left: 390,
                    width: 100,
                    height: 100,
                    tooltip: 'activepokemon|1|0'
                },
                p1a: {
                    top: 200,
                    left: 130,
                    width: 120,
                    height: 160,
                    tooltip: 'activepokemon|0|0'
                },
                p1b: {
                    top: 200,
                    left: 250,
                    width: 150,
                    height: 160,
                    tooltip: 'activepokemon|0|1'
                },
                p1c: {
                    top: 200,
                    left: 350,
                    width: 150,
                    height: 160,
                    tooltip: 'activepokemon|0|2'
                }
            };

            for (var _id in tooltips) {
                var layout = tooltips[_id];
                tooltipBuf += "<div class=\"has-tooltip\" style=\"position:absolute;";
                tooltipBuf += "top:" + layout.top + "px;left:" + layout.left + "px;width:" + layout.width + "px;height:" + layout.height + "px;";
                tooltipBuf += "\" data-id=\"" + _id + "\" data-tooltip=\"" + layout.tooltip + "\" data-ownheight=\"1\"></div>";
            }
            this.$tooltips.html(tooltipBuf);
        };
    _proto.

        teamPreview = function teamPreview() {
            var newBGNum = 0;
            for (var siden = 0; siden < 2 || this.battle.gameType === 'multi' && siden < 4; siden++) {
                var side = this.battle.sides[siden];
                var spriteIndex = +this.battle.sidesSwitched ^ siden % 2;
                var textBuf = '';
                var buf = '';
                var buf2 = '';
                this.$sprites[spriteIndex].empty();

                var ludicoloCount = 0;
                var lombreCount = 0;
                for (var i = 0; i < side.pokemon.length; i++) {
                    var pokemon = side.pokemon[i];
                    if (pokemon.speciesForme === 'Xerneas-*') {
                        pokemon.speciesForme = 'Xerneas-Neutral';
                    }
                    if (pokemon.speciesForme === 'Ludicolo') ludicoloCount++;
                    if (pokemon.speciesForme === 'Lombre') lombreCount++;

                    var spriteData = Dex.getSpriteData(pokemon, !!spriteIndex, {
                        gen: this.gen,
                        noScale: true,
                        mod: this.mod
                    });

                    var y = 0;
                    var x = 0;
                    if (spriteIndex) {
                        y = 48 + 50 + 3 * (i + 6 - side.pokemon.length);
                        x = 48 + 180 + 50 * (i + 6 - side.pokemon.length);
                    } else {
                        y = 48 + 200 + 3 * i;
                        x = 48 + 100 + 50 * i;
                    }
                    if (textBuf) textBuf += ' / ';
                    textBuf += pokemon.speciesForme;
                    var _url = spriteData.url;

                    buf += '<img src="' + _url + '" width="' + spriteData.w + '" height="' + spriteData.h + '" style="position:absolute;top:' + Math.floor(y - spriteData.h / 2) + 'px;left:' + Math.floor(x - spriteData.w / 2) + 'px" />';
                    buf2 += '<div style="position:absolute;top:' + (y + 45) + 'px;left:' + (x - 40) + 'px;width:80px;font-size:10px;text-align:center;color:#FFF;">';
                    var gender = pokemon.gender;
                    if (gender === 'M' || gender === 'F') {
                        buf2 += "<img src=\"" + Dex.fxPrefix + "gender-" + gender.toLowerCase() + ".png\" alt=\"" + gender + "\" width=\"7\" height=\"10\" class=\"pixelated\" style=\"margin-bottom:-1px\" /> ";
                    }
                    if (pokemon.level !== 100) {
                        buf2 += '<span style="text-shadow:#000 1px 1px 0,#000 1px -1px 0,#000 -1px 1px 0,#000 -1px -1px 0"><small>L</small>' + pokemon.level + '</span>';
                    }
                    if (pokemon.item === '(mail)') {
                        buf2 += ' <img src="' + Dex.resourcePrefix + 'fx/mail.png" width="8" height="10" alt="F" style="margin-bottom:-1px" />';
                    } else if (pokemon.item) {
                        buf2 += ' <img src="' + Dex.resourcePrefix + 'fx/item.png" width="8" height="10" alt="F" style="margin-bottom:-1px" />';
                    }
                    buf2 += '</div>';
                }
                side.totalPokemon = side.pokemon.length;
                if (textBuf) {
                    this.log.addDiv('chat battle-history',
                        '<strong>' + BattleLog.escapeHTML(side.name) + '\'s team:</strong> <em style="color:#445566;display:block;">' + BattleLog.escapeHTML(textBuf) + '</em>');
                }
                this.$sprites[spriteIndex].html(buf + buf2);

                if (!newBGNum) {
                    if (ludicoloCount >= 2) {
                        newBGNum = -3;
                    } else if (ludicoloCount + lombreCount >= 2) {
                        newBGNum = -2;
                    }
                }
            }
            if (newBGNum !== 0) {
                this.setBgm(newBGNum);
            }
            this.wait(1000);
            this.updateSidebars();
        };
    _proto.

        showJoinButtons = function showJoinButtons() {
            if (!this.battle.joinButtons) return;
            if (this.battle.ended || this.battle.rated) return;
            if (!this.battle.p1.name) {
                this.$battle.append('<div class="playbutton1"><button name="joinBattle">Join Battle</button></div>');
            }
            if (!this.battle.p2.name) {
                this.$battle.append('<div class="playbutton2"><button name="joinBattle">Join Battle</button></div>');
            }
        };
    _proto.
        hideJoinButtons = function hideJoinButtons() {
            if (!this.battle.joinButtons) return;
            this.$battle.find('.playbutton1, .playbutton2').remove();
        };
    _proto.

        pseudoWeatherLeft = function pseudoWeatherLeft(pWeather) {
            var buf = '<br />' + Dex.moves.get(pWeather[0]).name;
            if (!pWeather[1] && pWeather[2]) {
                pWeather[1] = pWeather[2];
                pWeather[2] = 0;
            }
            if (this.battle.gen < 7 && this.battle.hardcoreMode) return buf;
            if (pWeather[2]) {
                return buf + ' <small>(' + pWeather[1] + ' or ' + pWeather[2] + ' turns)</small>';
            }
            if (pWeather[1]) {
                return buf + ' <small>(' + pWeather[1] + ' turn' + (pWeather[1] === 1 ? '' : 's') + ')</small>';
            }
            return buf;
        };
    _proto.
        sideConditionLeft = function sideConditionLeft(cond, isFoe, all) {
            if (!cond[2] && !cond[3] && !all) return '';
            var buf = "<br />" + (isFoe && !all ? "Foe's " : "") + Dex.moves.get(cond[0]).name;
            if (this.battle.gen < 7 && this.battle.hardcoreMode) return buf;

            if (!cond[2] && !cond[3]) return buf;
            if (!cond[2] && cond[3]) {
                cond[2] = cond[3];
                cond[3] = 0;
            }
            if (!cond[3]) {
                return buf + ' <small>(' + cond[2] + ' turn' + (cond[2] === 1 ? '' : 's') + ')</small>';
            }
            return buf + ' <small>(' + cond[2] + ' or ' + cond[3] + ' turns)</small>';
        };
    _proto.
        weatherLeft = function weatherLeft() {
            if (this.battle.gen < 7 && this.battle.hardcoreMode) return '';

            var weatherhtml = "";

            if (this.battle.weather) {
                var weatherNameTable = {
                    sunnyday: 'Sun',
                    desolateland: 'Intense Sun',
                    raindance: 'Rain',
                    primordialsea: 'Heavy Rain',
                    sandstorm: 'Sandstorm',
                    hail: 'Hail',
                    deltastream: 'Strong Winds'
                };

                weatherhtml = "" + (weatherNameTable[this.battle.weather] || this.battle.weather);
                if (this.battle.weatherMinTimeLeft !== 0) {
                    weatherhtml += " <small>(" + this.battle.weatherMinTimeLeft + " or " + this.battle.weatherTimeLeft + " turns)</small>";
                } else if (this.battle.weatherTimeLeft !== 0) {
                    weatherhtml += " <small>(" + this.battle.weatherTimeLeft + " turn" + (this.battle.weatherTimeLeft === 1 ? '' : 's') + ")</small>";
                }
                var nullifyWeather = this.battle.abilityActive(['Air Lock', 'Cloud Nine']);
                weatherhtml = "" + (nullifyWeather ? '<s>' : '') + weatherhtml + (nullifyWeather ? '</s>' : '');
            }
            for (var _i10 = 0, _this$battle$pseudoWe =

                this.battle.pseudoWeather; _i10 < _this$battle$pseudoWe.length; _i10++) {
                var pseudoWeather = _this$battle$pseudoWe[_i10];
                weatherhtml += this.pseudoWeatherLeft(pseudoWeather);
            }

            return weatherhtml;
        };
    _proto.
        sideConditionsLeft = function sideConditionsLeft(side, all) {
            var buf = "";
            for (var _id2 in side.sideConditions) {
                buf += this.sideConditionLeft(side.sideConditions[_id2], side.isFar, all);
            }
            return buf;
        };
    _proto.
        upkeepWeather = function upkeepWeather() {
            var isIntense = ['desolateland', 'primordialsea', 'deltastream'].includes(this.curWeather);
            this.$weather.animate({
                opacity: 1.0
            },
                300).animate({
                    opacity: isIntense ? 0.9 : 0.5
                },
                    300);
        };
    _proto.
        updateWeather = function updateWeather(instant) {
            var _this3 = this;
            if (!this.animating) return;
            var isIntense = false;
            var weather = this.battle.weather;
            if (this.battle.abilityActive(['Air Lock', 'Cloud Nine'])) {
                weather = '';
            }
            var terrain = '';
            for (var _i11 = 0, _this$battle$pseudoWe2 =
                this.battle.pseudoWeather; _i11 < _this$battle$pseudoWe2.length; _i11++) {
                var pseudoWeatherData = _this$battle$pseudoWe2[_i11];
                var pwid = toID(pseudoWeatherData[0]);
                switch (pwid) {
                    case 'electricterrain':
                    case 'grassyterrain':
                    case 'mistyterrain':
                    case 'psychicterrain':
                        terrain = pwid;
                        break;
                    default:
                        if (!terrain) terrain = 'pseudo';
                        break;
                }
            }
            if (weather === 'desolateland' || weather === 'primordialsea' || weather === 'deltastream') {
                isIntense = true;
            }

            var weatherhtml = this.weatherLeft();
            for (var _i12 = 0, _this$battle$sides4 =
                this.battle.sides; _i12 < _this$battle$sides4.length; _i12++) {
                var side = _this$battle$sides4[_i12];
                weatherhtml += this.sideConditionsLeft(side);
            }
            if (weatherhtml) weatherhtml = "<br />" + weatherhtml;

            if (instant) {
                this.$weather.html('<em>' + weatherhtml + '</em>');
                if (this.curWeather === weather && this.curTerrain === terrain) return;
                this.$terrain.attr('class', terrain ? 'weather ' + terrain + 'weather' : 'weather');
                this.curTerrain = terrain;
                this.$weather.attr('class', weather ? 'weather ' + weather + 'weather' : 'weather');
                this.$weather.css('opacity', isIntense || !weather ? 0.9 : 0.5);
                this.curWeather = weather;
                return;
            }

            if (weather !== this.curWeather) {
                this.$weather.animate({
                    opacity: 0
                },
                    this.curWeather ? 300 : 100,
                    function () {
                        _this3.$weather.html('<em>' + weatherhtml + '</em>');
                        _this3.$weather.attr('class', weather ? 'weather ' + weather + 'weather' : 'weather');
                        _this3.$weather.animate({
                            opacity: isIntense || !weather ? 0.9 : 0.5
                        }, 300);
                    });
                this.curWeather = weather;
            } else {
                this.$weather.html('<em>' + weatherhtml + '</em>');
            }

            if (terrain !== this.curTerrain) {
                this.$terrain.animate({
                    top: 360,
                    opacity: 0
                },
                    this.curTerrain ? 400 : 1,
                    function () {
                        _this3.$terrain.attr('class', terrain ? 'weather ' + terrain + 'weather' : 'weather');
                        _this3.$terrain.animate({
                            top: 0,
                            opacity: 1
                        }, 400);
                    });
                this.curTerrain = terrain;
            }
        };
    _proto.
        resetTurn = function resetTurn() {
            if (this.battle.turn <= 0) {
                this.$turn.html('');
                return;
            }
            this.$turn.html('<div class="turn has-tooltip" data-tooltip="field" data-ownheight="1">Turn ' + this.battle.turn + '</div>');
        };
    _proto.
        incrementTurn = function incrementTurn() {
            if (!this.animating) return;

            var turn = this.battle.turn;
            if (turn <= 0) return;
            var $prevTurn = this.$turn.children();
            var $newTurn = $('<div class="turn has-tooltip" data-tooltip="field" data-ownheight="1">Turn ' + turn + '</div>');
            $newTurn.css({
                opacity: 0,
                left: 160
            });

            this.$turn.append($newTurn);
            $newTurn.animate({
                opacity: 1,
                left: 110
            },
                500).animate({
                    opacity: .4
                },
                    1500);
            $prevTurn.animate({
                opacity: 0,
                left: 60
            },
                500,
                function () {
                    $prevTurn.remove();
                });
            this.updateAcceleration();
            this.wait(500 / this.acceleration);
        };
    _proto.
        updateAcceleration = function updateAcceleration() {
            if (this.battle.turnsSinceMoved > 2) {
                this.acceleration = (this.battle.messageFadeTime < 150 ? 2 : 1) * Math.min(this.battle.turnsSinceMoved - 1, 3);
            } else {
                this.acceleration = this.battle.messageFadeTime < 150 ? 2 : 1;
                if (this.battle.messageFadeTime < 50) this.acceleration = 3;
            }
        };
    _proto.

        addPokemonSprite = function addPokemonSprite(pokemon) {
            var sprite = new PokemonSprite(Dex.getSpriteData(pokemon, pokemon.side.isFar, {
                gen: this.gen,
                mod: this.mod
            }), {
                x: pokemon.side.x,
                y: pokemon.side.y,
                z: pokemon.side.z,
                opacity: 0
            },
                this, pokemon.side.isFar);
            if (sprite.$el) this.$sprites[+pokemon.side.isFar].append(sprite.$el);
            return sprite;
        };
    _proto.

        addSideCondition = function addSideCondition(siden, id, instant) {
            if (!this.animating) return;
            var side = this.battle.sides[siden];
            var spriteIndex = +side.isFar;
            switch (id) {
                case 'auroraveil':
                    var auroraveil = new Sprite(BattleEffects.auroraveil, {
                        display: 'block',
                        x: side.x,
                        y: side.y,
                        z: side.behind(-14),
                        xscale: 1,
                        yscale: 0,
                        opacity: 0.1
                    },
                        this);
                    this.$spritesFront[spriteIndex].append(auroraveil.$el);
                    this.sideConditions[siden][id] = [auroraveil];
                    auroraveil.anim({
                        opacity: 0.7,
                        time: instant ? 0 : 400
                    }).
                        anim({
                            opacity: 0.3,
                            time: instant ? 0 : 300
                        });

                    break;
                case 'reflect':
                    var reflect = new Sprite(BattleEffects.reflect, {
                        display: 'block',
                        x: side.x,
                        y: side.y,
                        z: side.behind(-17),
                        xscale: 1,
                        yscale: 0,
                        opacity: 0.1
                    },
                        this);
                    this.$spritesFront[spriteIndex].append(reflect.$el);
                    this.sideConditions[siden][id] = [reflect];
                    reflect.anim({
                        opacity: 0.7,
                        time: instant ? 0 : 400
                    }).
                        anim({
                            opacity: 0.3,
                            time: instant ? 0 : 300
                        });

                    break;
                case 'safeguard':
                    var safeguard = new Sprite(BattleEffects.safeguard, {
                        display: 'block',
                        x: side.x,
                        y: side.y,
                        z: side.behind(-20),
                        xscale: 1,
                        yscale: 0,
                        opacity: 0.1
                    },
                        this);
                    this.$spritesFront[spriteIndex].append(safeguard.$el);
                    this.sideConditions[siden][id] = [safeguard];
                    safeguard.anim({
                        opacity: 0.7,
                        time: instant ? 0 : 400
                    }).
                        anim({
                            opacity: 0.3,
                            time: instant ? 0 : 300
                        });

                    break;
                case 'lightscreen':
                    var lightscreen = new Sprite(BattleEffects.lightscreen, {
                        display: 'block',
                        x: side.x,
                        y: side.y,
                        z: side.behind(-23),
                        xscale: 1,
                        yscale: 0,
                        opacity: 0.1
                    },
                        this);
                    this.$spritesFront[spriteIndex].append(lightscreen.$el);
                    this.sideConditions[siden][id] = [lightscreen];
                    lightscreen.anim({
                        opacity: 0.7,
                        time: instant ? 0 : 400
                    }).
                        anim({
                            opacity: 0.3,
                            time: instant ? 0 : 300
                        });

                    break;
                case 'mist':
                    var mist = new Sprite(BattleEffects.mist, {
                        display: 'block',
                        x: side.x,
                        y: side.y,
                        z: side.behind(-27),
                        xscale: 1,
                        yscale: 0,
                        opacity: 0.1
                    },
                        this);
                    this.$spritesFront[spriteIndex].append(mist.$el);
                    this.sideConditions[siden][id] = [mist];
                    mist.anim({
                        opacity: 0.7,
                        time: instant ? 0 : 400
                    }).
                        anim({
                            opacity: 0.3,
                            time: instant ? 0 : 300
                        });

                    break;
                case 'stealthrock':
                    var rock1 = new Sprite(BattleEffects.rock1, {
                        display: 'block',
                        x: side.leftof(-40),
                        y: side.y - 10,
                        z: side.z,
                        opacity: 0.5,
                        scale: 0.2
                    },
                        this);

                    var rock2 = new Sprite(BattleEffects.rock2, {
                        display: 'block',
                        x: side.leftof(-20),
                        y: side.y - 40,
                        z: side.z,
                        opacity: 0.5,
                        scale: 0.2
                    },
                        this);

                    var rock3 = new Sprite(BattleEffects.rock1, {
                        display: 'block',
                        x: side.leftof(30),
                        y: side.y - 20,
                        z: side.z,
                        opacity: 0.5,
                        scale: 0.2
                    },
                        this);

                    var rock4 = new Sprite(BattleEffects.rock2, {
                        display: 'block',
                        x: side.leftof(10),
                        y: side.y - 30,
                        z: side.z,
                        opacity: 0.5,
                        scale: 0.2
                    },
                        this);

                    this.$spritesFront[spriteIndex].append(rock1.$el);
                    this.$spritesFront[spriteIndex].append(rock2.$el);
                    this.$spritesFront[spriteIndex].append(rock3.$el);
                    this.$spritesFront[spriteIndex].append(rock4.$el);
                    this.sideConditions[siden][id] = [rock1, rock2, rock3, rock4];
                    break;
                case 'gmaxsteelsurge':
                    var surge1 = new Sprite(BattleEffects.greenmetal1, {
                        display: 'block',
                        x: side.leftof(-30),
                        y: side.y - 20,
                        z: side.z,
                        opacity: 0.5,
                        scale: 0.8
                    },
                        this);
                    var surge2 = new Sprite(BattleEffects.greenmetal2, {
                        display: 'block',
                        x: side.leftof(35),
                        y: side.y - 15,
                        z: side.z,
                        opacity: 0.5,
                        scale: 0.8
                    },
                        this);
                    var surge3 = new Sprite(BattleEffects.greenmetal1, {
                        display: 'block',
                        x: side.leftof(50),
                        y: side.y - 10,
                        z: side.z,
                        opacity: 0.5,
                        scale: 0.8
                    },
                        this);

                    this.$spritesFront[spriteIndex].append(surge1.$el);
                    this.$spritesFront[spriteIndex].append(surge2.$el);
                    this.$spritesFront[spriteIndex].append(surge3.$el);
                    this.sideConditions[siden][id] = [surge1, surge2, surge3];
                    break;
                case 'spikes':
                    var spikeArray = this.sideConditions[siden]['spikes'];
                    if (!spikeArray) {
                        spikeArray = [];
                        this.sideConditions[siden]['spikes'] = spikeArray;
                    }
                    var levels = this.battle.sides[siden].sideConditions['spikes'][1];
                    if (spikeArray.length < 1 && levels >= 1) {
                        var spike1 = new Sprite(BattleEffects.caltrop, {
                            display: 'block',
                            x: side.x - 25,
                            y: side.y - 40,
                            z: side.z,
                            scale: 0.3
                        },
                            this);
                        this.$spritesFront[spriteIndex].append(spike1.$el);
                        spikeArray.push(spike1);
                    }
                    if (spikeArray.length < 2 && levels >= 2) {
                        var spike2 = new Sprite(BattleEffects.caltrop, {
                            display: 'block',
                            x: side.x + 30,
                            y: side.y - 45,
                            z: side.z,
                            scale: .3
                        },
                            this);
                        this.$spritesFront[spriteIndex].append(spike2.$el);
                        spikeArray.push(spike2);
                    }
                    if (spikeArray.length < 3 && levels >= 3) {
                        var spike3 = new Sprite(BattleEffects.caltrop, {
                            display: 'block',
                            x: side.x + 50,
                            y: side.y - 40,
                            z: side.z,
                            scale: .3
                        },
                            this);
                        this.$spritesFront[spriteIndex].append(spike3.$el);
                        spikeArray.push(spike3);
                    }
                    break;
                case 'toxicspikes':
                    var tspikeArray = this.sideConditions[siden]['toxicspikes'];
                    if (!tspikeArray) {
                        tspikeArray = [];
                        this.sideConditions[siden]['toxicspikes'] = tspikeArray;
                    }
                    var tspikeLevels = this.battle.sides[siden].sideConditions['toxicspikes'][1];
                    if (tspikeArray.length < 1 && tspikeLevels >= 1) {
                        var tspike1 = new Sprite(BattleEffects.poisoncaltrop, {
                            display: 'block',
                            x: side.x + 5,
                            y: side.y - 40,
                            z: side.z,
                            scale: 0.3
                        },
                            this);
                        this.$spritesFront[spriteIndex].append(tspike1.$el);
                        tspikeArray.push(tspike1);
                    }
                    if (tspikeArray.length < 2 && tspikeLevels >= 2) {
                        var tspike2 = new Sprite(BattleEffects.poisoncaltrop, {
                            display: 'block',
                            x: side.x - 15,
                            y: side.y - 35,
                            z: side.z,
                            scale: .3
                        },
                            this);
                        this.$spritesFront[spriteIndex].append(tspike2.$el);
                        tspikeArray.push(tspike2);
                    }
                    break;
                case 'stickyweb':
                    var web = new Sprite(BattleEffects.web, {
                        display: 'block',
                        x: side.x + 15,
                        y: side.y - 35,
                        z: side.z,
                        opacity: 0.4,
                        scale: 0.7
                    },
                        this);
                    this.$spritesFront[spriteIndex].append(web.$el);
                    this.sideConditions[siden][id] = [web];
                    break;
            }
        };
    _proto.
        removeSideCondition = function removeSideCondition(siden, id) {
            if (!this.animating) return;
            if (this.sideConditions[siden][id]) {
                for (var _i13 = 0, _this$sideConditions$ =
                    this.sideConditions[siden][id]; _i13 < _this$sideConditions$.length; _i13++) {
                    var sprite = _this$sideConditions$[_i13];
                    sprite.destroy();
                }
                delete this.sideConditions[siden][id];
            }
        };
    _proto.
        resetSideConditions = function resetSideConditions() {
            for (var siden = 0; siden < this.sideConditions.length; siden++) {
                for (var _id3 in this.sideConditions[siden]) {
                    this.removeSideCondition(siden, _id3);
                }
                for (var _id4 in this.battle.sides[siden].sideConditions) {
                    this.addSideCondition(siden, _id4, true);
                }
            }
        };
    _proto.

        typeAnim = function typeAnim(pokemon, types) {
            var result = BattleLog.escapeHTML(types).split('/').map(function (type) {
                return (
                    '<img src="' + Dex.resourcePrefix + 'sprites/types/' + type + '.png" alt="' + type + '" class="pixelated" />');
            }).
                join(' ');
            this.resultAnim(pokemon, result, 'neutral');
        };
    _proto.
        resultAnim = function resultAnim(pokemon, result, type) {
            if (!this.animating) return;
            var $effect = $('<div class="result ' + type + 'result"><strong>' + result + '</strong></div>');
            this.$fx.append($effect);
            $effect.delay(this.timeOffset).css({
                display: 'block',
                opacity: 0,
                top: pokemon.sprite.top - 5,
                left: pokemon.sprite.left - 75
            }).
                animate({
                    opacity: 1
                },
                    1);
            $effect.animate({
                opacity: 0,
                top: pokemon.sprite.top - 65
            },
                1000, 'swing');
            this.wait(this.acceleration < 2 ? 350 : 250);
            pokemon.sprite.updateStatbar(pokemon);
            if (this.acceleration < 3) this.waitFor($effect);
        };
    _proto.
        abilityActivateAnim = function abilityActivateAnim(pokemon, result) {
            if (!this.animating) return;
            this.$fx.append('<div class="result abilityresult"><strong>' + result + '</strong></div>');
            var $effect = this.$fx.children().last();
            $effect.delay(this.timeOffset).css({
                display: 'block',
                opacity: 0,
                top: pokemon.sprite.top + 15,
                left: pokemon.sprite.left - 75
            }).
                animate({
                    opacity: 1
                },
                    1);
            $effect.delay(800).animate({
                opacity: 0
            },
                400, 'swing');
            this.wait(100);
            pokemon.sprite.updateStatbar(pokemon);
            if (this.acceleration < 3) this.waitFor($effect);
        };
    _proto.
        damageAnim = function damageAnim(pokemon, damage) {
            if (!this.animating) return;
            if (!pokemon.sprite.$statbar) return;
            pokemon.sprite.updateHPText(pokemon);

            var $hp = pokemon.sprite.$statbar.find('div.hp');
            var w = pokemon.hpWidth(150);
            var hpcolor = BattleScene.getHPColor(pokemon);
            var callback;
            if (hpcolor === 'y') {
                callback = function () {
                    $hp.addClass('hp-yellow');
                };
            }
            if (hpcolor === 'r') {
                callback = function () {
                    $hp.addClass('hp-yellow hp-red');
                };
            }

            if (damage === '100%' && pokemon.hp > 0) damage = '99%';
            this.resultAnim(pokemon, this.battle.hardcoreMode ? 'Damage' : '&minus;' + damage, 'bad');

            $hp.animate({
                width: w,
                'border-right-width': w ? 1 : 0
            },
                350, callback);
        };
    _proto.
        healAnim = function healAnim(pokemon, damage) {
            if (!this.animating) return;
            if (!pokemon.sprite.$statbar) return;
            pokemon.sprite.updateHPText(pokemon);

            var $hp = pokemon.sprite.$statbar.find('div.hp');
            var w = pokemon.hpWidth(150);
            var hpcolor = BattleScene.getHPColor(pokemon);
            var callback;
            if (hpcolor === 'g') {
                callback = function () {
                    $hp.removeClass('hp-yellow hp-red');
                };
            }
            if (hpcolor === 'y') {
                callback = function () {
                    $hp.removeClass('hp-red');
                };
            }

            this.resultAnim(pokemon, this.battle.hardcoreMode ? 'Heal' : '+' + damage, 'good');

            $hp.animate({
                width: w,
                'border-right-width': w ? 1 : 0
            },
                350, callback);
        };
    _proto.

        removeEffect = function removeEffect(pokemon, id, instant) {
            return pokemon.sprite.removeEffect(id, instant);
        };
    _proto.
        addEffect = function addEffect(pokemon, id, instant) {
            return pokemon.sprite.addEffect(id, instant);
        };
    _proto.
        animSummon = function animSummon(pokemon, slot, instant) {
            return pokemon.sprite.animSummon(pokemon, slot, instant);
        };
    _proto.
        animUnsummon = function animUnsummon(pokemon, instant) {
            return pokemon.sprite.animUnsummon(pokemon, instant);
        };
    _proto.
        animDragIn = function animDragIn(pokemon, slot) {
            return pokemon.sprite.animDragIn(pokemon, slot);
        };
    _proto.
        animDragOut = function animDragOut(pokemon) {
            return pokemon.sprite.animDragOut(pokemon);
        };
    _proto.
        updateStatbar = function updateStatbar(pokemon, updatePrevhp, updateHp) {
            return pokemon.sprite.updateStatbar(pokemon, updatePrevhp, updateHp);
        };
    _proto.
        updateStatbarIfExists = function updateStatbarIfExists(pokemon, updatePrevhp, updateHp) {
            return pokemon.sprite.updateStatbarIfExists(pokemon, updatePrevhp, updateHp);
        };
    _proto.
        animTransform = function animTransform(pokemon, isCustomAnim, isPermanent) {
            return pokemon.sprite.animTransform(pokemon, isCustomAnim, isPermanent);
        };
    _proto.
        clearEffects = function clearEffects(pokemon) {
            return pokemon.sprite.clearEffects();
        };
    _proto.
        removeTransform = function removeTransform(pokemon) {
            return pokemon.sprite.removeTransform();
        };
    _proto.
        animFaint = function animFaint(pokemon) {
            return pokemon.sprite.animFaint(pokemon);
        };
    _proto.
        animReset = function animReset(pokemon) {
            return pokemon.sprite.animReset();
        };
    _proto.
        anim = function anim(pokemon, end, transition) {
            return pokemon.sprite.anim(end, transition);
        };
    _proto.
        beforeMove = function beforeMove(pokemon) {
            return pokemon.sprite.beforeMove();
        };
    _proto.
        afterMove = function afterMove(pokemon) {
            return pokemon.sprite.afterMove();
        };
    _proto.

        setFrameHTML = function setFrameHTML(html) {
            this.customControls = true;
            this.$frame.html(html);
        };
    _proto.
        setControlsHTML = function setControlsHTML(html) {
            this.customControls = true;
            var $controls = this.$frame.parent().children('.battle-controls');
            $controls.html(html);
        };
    _proto.

        preloadImage = function preloadImage(url) {
            var _this4 = this;
            var token = url.replace(/\.(gif|png)$/, '').replace(/\//g, '-');
            if (this.preloadCache[token]) {
                return;
            }
            this.preloadNeeded++;
            this.preloadCache[token] = new Image();
            this.preloadCache[token].onload = function () {
                _this4.preloadDone++;
            };
            this.preloadCache[token].src = url;
        };
    _proto.
        preloadEffects = function preloadEffects() {
            for (var i in BattleEffects) {
                if (i === 'alpha' || i === 'omega') continue;
                var _url2 = BattleEffects[i].url;
                if (_url2) this.preloadImage(_url2);
            }
            this.preloadImage(Dex.resourcePrefix + 'sprites/ani/substitute.gif');
            this.preloadImage(Dex.resourcePrefix + 'sprites/ani-back/substitute.gif');
        };
    _proto.
        rollBgm = function rollBgm() {
            this.setBgm(1 + this.numericId % 6);
    };





































    _proto.
        setBgm = function setBgm(bgmNum) {
            if (this.bgmNum === bgmNum) return;
            this.bgmNum = bgmNum;

            switch (bgmNum) {
                case -1:
                    this.bgm = BattleSound.loadBgm('https://play.pokemonshowdown.com/audio/bw2-homika-dogars.mp3', 1661, 68131, this.bgm);
                    break;
                case -2:
                    this.bgm = BattleSound.loadBgm('https://play.pokemonshowdown.com/audio/xd-miror-b.mp3', 9000, 57815, this.bgm);
                    break;
                case -3:
                    this.bgm = BattleSound.loadBgm('https://play.pokemonshowdown.com/audio/colosseum-miror-b.mp3', 896, 47462, this.bgm);
                    break;
                case -101:
                    this.bgm = BattleSound.loadBgm('https://play.pokemonshowdown.com/audio/spl-elite4.mp3', 3962, 152509, this.bgm);
                    break;

                case 1:
                    this.bgm = BattleSound.loadBgm('https://github.com/ShadowKirby21/ssmm-showdown/raw/master/music/xy-elite4.mp3', 133673, 261675, this.bgm);
                    break;
                case 2:
                    this.bgm = BattleSound.loadBgm('https://github.com/ShadowKirby21/ssmm-showdown/raw/master/music/bw-n.mp3', 18075, 72758, this.bgm);
                    break;
                case 3:
                    this.bgm = BattleSound.loadBgm('https://github.com/ShadowKirby21/ssmm-showdown/raw/master/music/dpp-giratina.mp3', 60527, 164162, this.bgm);
                    break;
                case 4:
                    this.bgm = BattleSound.loadBgm('https://github.com/ShadowKirby21/ssmm-showdown/raw/master/music/hgss-ho-oh.mp3', 17632, 84852, this.bgm);
                    break;
                case 5:
                    this.bgm = BattleSound.loadBgm('https://github.com/ShadowKirby21/ssmm-showdown/raw/master/music/dpp-galactic-admin.mp3', 119450, 176991, this.bgm);
                    break;
                case 6:
                default:
                    this.bgm = BattleSound.loadBgm('https://github.com/ShadowKirby21/ssmm-showdown/raw/master/music/hgss-raikou.mp3', 12629, 104886, this.bgm);
                    break;
            }

            this.updateBgm();
    };
























    _proto.
        updateBgm = function updateBgm() {
            var nowPlaying =
                this.battle.turn >= 0 && !this.battle.ended && !this.battle.paused;

            if (nowPlaying) {
                if (!this.bgm) this.rollBgm();
                this.bgm.resume();
            } else if (this.bgm) {
                this.bgm.pause();
            }
        };
    _proto.
        resetBgm = function resetBgm() {
            if (this.bgm) this.bgm.stop();
        };
    _proto.
        destroy = function destroy() {
            this.log.destroy();
            if (this.$frame) this.$frame.empty();
            if (this.bgm) {
                this.bgm.destroy();
                this.bgm = null;
            }
            this.battle = null;
        };
    BattleScene.
        getHPColor = function getHPColor(pokemon) {
            var ratio = pokemon.hp / pokemon.maxhp;
            if (ratio > 0.5) return 'g';
            if (ratio > 0.2) return 'y';
            return 'r';
        };
    return BattleScene;
}();