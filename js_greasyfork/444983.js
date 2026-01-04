// ==UserScript==
// @name            TagPro Flair Trails and Spin
// @version         1.0.0
// @description     Have sick trails for all your flairs just like the arc reactor. (Without having to level up) But wait there's more. You can also have your flairs spin like the level 4 donor flair absolutely free.
// @include         *://*.koalabeast.com/*
// @author          Pindelta
// @supportURL      https://www.reddit.com/message/compose/?to=Pindelta
// @namespace       https://github.com/Pindelta/TagPro-Flair-Trails-and-Spin

// @downloadURL https://update.greasyfork.org/scripts/444983/TagPro%20Flair%20Trails%20and%20Spin.user.js
// @updateURL https://update.greasyfork.org/scripts/444983/TagPro%20Flair%20Trails%20and%20Spin.meta.js
// ==/UserScript==

// - v1.0.0: removed spin option for all players, fixed script for current version of tagpro flair emitter, made spin and trail options exclusive or
// - v0.3.1: code refactoring and cleanup
// - v0.3.0: added settings menu in the in-game settings
// - v0.2.2: fixed arc reactor flair not showing it's original trail, you don't need to put your display name anymore
// - v0.2.1: changed included domains to *://*.koalabeast.com/*, which should encompass all koalabeast url variations
// - v0.2.0: added https://koalabeast.com* to list of domains, added option to apply spin effect to all balls

// ========= SETTINGS =========
// All settings can be configured from the settings in TagPro!

// ========= END OF SETTINGS =========

var PageLoc = WhichPageAreWeOn();

const customTrailDefinition = {
  acceleration: { x: 0, y: 0 },
  addAtBack: false,
  alpha: { start: 1, end: 0 },
  blendMode: "normal",
  color: { start: "#ffffff", end: "#ffffff" },
  emitterLifetime: -1,
  frequency: 0.001,
  lifetime: { min: 0.25, max: 0.25 },
  maxParticles: 500,
  maxSpeed: 0,
  noRotation: true,
  pos: { x: 0, y: 0 },
  rotationSpeed: { min: 0, max: 0 },
  scale: { start: 1, end: 0.25, minimumScaleMultiplier: 1 },
  spawnType: "point",
  speed: { start: 0, end: 0, minimumSpeedMultiplier: 1 },
  startRotation: { min: 0, max: 0 },
};

/* global tagpro, tagproConfig, $, tpul */

tagpro.ready(function () {
  if (PageLoc === "profile") {
    $("#settings, .card:first").before(
      `<div id=flair-trail-and-spin-select class="profile-settings block">
        <h3 class=header-title>Flair Trail and Spin</h3>
        <form class=form-horizontal>
        <div class=form-group></div>
      </div>
      <hr>
      <div id=save-group class=form-group></div>`
    );

    $("#flair-trail-and-spin-select .form-group:first").append(
      `<label class="col-sm-4 control-label">Effects</label>
      <div class="col-sm-8">
        <div class="checkbox">
          <label for="spin">
            <input id="flair-spin-checkbox" name="spin" type="checkbox" checked="">
            Enable Flair Spin
          </label>
        </div>
        <div class="checkbox">
          <label for="trail">
            <input id="flair-trail-checkbox" name="trail" type="checkbox" checked="">
            Enable Flair Trail
          </label>
        </div>
      </div>`
    );

    $("#flair-trail-and-spin-select")
      .find("input")
      .each(function () {
        var name = $(this).prop("name");
        $(this).prop("checked", $.cookie(name) == "true");
      })
      .prop("disabled", false);

    $("#save-group").append(
      '<div class="col-sm-12 text-right"><div id=script-status style="display: none;">Script settings saved!</div><button id="saveScriptSettings" class="btn btn-primary" type="button">Save Script Settings'
    );
    $("#script-status").css("margin-bottom", "20px");

    $("#flair-spin-checkbox").on("click", function () {
      $("#flair-trail-checkbox").prop("checked", false);
    });

    $("#flair-trail-checkbox").on("click", function () {
      $("#flair-spin-checkbox").prop("checked", false);
    });

    $("#saveScriptSettings").on("click", function () {
      // Save settings to site cookies
      $("#flair-trail-and-spin-select")
        .find("input")
        .each(function () {
          var name = $(this).prop("name"),
            checked = $(this).prop("checked");
          $.cookie(name, checked, {
            expires: 36500,
            path: "/",
            domain: tagproConfig.cookieHost,
          });
        });

      // Show text to indicate settings were saved
      $("#script-status").slideDown();
      setTimeout(function () {
        $("#script-status").slideUp();
      }, 3e3);
    });
  }

  if (PageLoc === "ingame") {
    const spinFlair = $.cookie("spin") ? $.cookie("spin") : false;
    const useTrail = $.cookie("trail") ? $.cookie("trail") : false;

    tagpro.renderer.updatePlayer = function (t) {
      const isYourBall = t.id === tagpro.playerId; // check if this is your ball
      t.sprites ||
        (tagpro.renderer.setupPlayerSprites(t),
        tagpro.renderer.createPlayerSprite(t),
        tagpro.renderer.createPlayerEmitter(t),
        (tagpro.renderer.forceZoomUpdate = !0)),
        (t.sprite.visible = t.draw && !t.dead),
        (t.flair?.key.startsWith("special") ||
          "degree.arcreactor" === t.flair?.key ||
          (isYourBall && (spinFlair || useTrail))) &&
          tagpro.renderer.updateSpecialFlair(t),
        tagpro.renderer.options.disableParticles ||
          tagpro.renderer.updatePlayerEmitter(t);
    };

    tagpro.renderer.drawFlair = function (t) {
      const isYourBall = t.id === tagpro.playerId; // check if this is your ball
      if ((t.sprites.flair?.destroy(), tagpro.settings.ui.flairs && t.flair)) {
        var i = "flair-" + t.flair.x + "," + t.flair.y,
          r = tagpro.renderer.getFlairTexture(i, t.flair);
        if (
          ((t.sprites.flair = new PIXI.Sprite(r)),
          (t.sprites.flair.pivot.x = 8),
          (t.sprites.flair.pivot.y = 8),
          (t.sprites.flair.x = 20),
          (t.sprites.flair.y = -9),
          t.sprites.info.addChild(t.sprites.flair),
          (t.sprites.flair.rotation = 0),
          (t.rotateFlairSpeed = 0),
          ("degree.arcreactor" === t.flair.key || (isYourBall && useTrail)) &&
            !tagpro.renderer.options.disableParticles)
        ) {
          var n = tagpro.renderer.makeParticleEmitter(
            tagpro.renderer.layers.midground,
            [
              "degree.arcreactor" === t.flair.key
                ? tagpro.renderer.particleTexture
                : r,
            ],
            "degree.arcreactor" === t.flair.key
              ? tagpro.particleDefinitions.arcReactor
              : customTrailDefinition
          );
          tagpro.renderer.emitters.push(n),
            (t.flairEmitter = n),
            (t.flairEmitter.keep = !0),
            (t.flairEmitter.always = !0),
            (t.flairEmitter.emit = !0);
        }
        t.lastFrame ||
          (t.lastFrame = {
            "s-tags": t["s-tags"],
            "s-powerups": t["s-powerups"],
            "s-captures": t["s-captures"],
          }),
          (tagpro.renderer.forceZoomUpdate = !0);
      }
    };

    tagpro.renderer.updateSpecialFlair = function (t) {
      const isYourBall = t.id === tagpro.playerId; // check if this is your ball
      if (t.flair && t.sprites.flair) {
        if (
          (([
            "special.supporter4",
            "special.supporter5",
            "special.supporter6",
          ].includes(t.flair.key) ||
            (isYourBall && spinFlair)) &&
            ((t.lastFrame["s-captures"] === t["s-captures"] &&
              t.lastFrame["s-tags"] === t["s-tags"]) ||
              ((t.tween = new Tween(0.4, -0.38, 4e3, "quadOut")),
              (t.rotateFlairSpeed = t.tween.getValue())),
            t.rotateFlairSpeed > 0.02 &&
              (t.rotateFlairSpeed = t.tween.getValue()),
            (t.rotateFlairSpeed = Math.max(0.02, t.rotateFlairSpeed)),
            (t.sprites.flair.rotation += t.rotateFlairSpeed),
            (t.lastFrame["s-tags"] = t["s-tags"])),
          "special.supporter5" === t.flair.key &&
            (t.scaleTween ||
              (t.scaleTween = new Tween(0, -0.4, 2500, "sineInOut", !0)),
            (t.sprites.flair.scale.x = t.sprites.flair.scale.y =
              1 + t.scaleTween.getValue())),
          "special.supporter6" === t.flair.key &&
            (t.rainbow || (t.rainbow = 0),
            (t.sprites.flair.tint = tagpro.renderer.interpolateSinebow(
              t.rainbow
            )),
            (t.rainbow += 0.002)),
          !tagpro.renderer.options.disableCapAnimations &&
            t.lastFrame["s-captures"] !== t["s-captures"])
        )
          for (const i in tagpro.players) {
            if (!Object.prototype.hasOwnProperty.call(tagpro.players, i))
              continue;
            let r = tagpro.players[i];
            r.team === t.team &&
              ("special.supporter7" === r.flair?.key
                ? tagpro.renderer.options.disableParticles
                  ? tagpro.renderer.clearConfetti(r)
                  : tagpro.renderer.emitConfetti(r, !0)
                : [
                    "special.eventmaster",
                    "special.flairz1",
                    "special.flairz2",
                  ].includes(r.flair?.key) &&
                  (tagpro.renderer.options.disableParticles ||
                    tagpro.renderer.emitEventMaster(r, !0)));
          }
        if ("special.supporter7" === t.flair.key) {
          if (
            t.lastFrame["s-tags"] !== t["s-tags"] ||
            t.lastFrame["s-powerups"] !== t["s-powerups"]
          )
            for (var i = Math.floor(5 * Math.random()) + 1, r = 0; r < i; r++)
              tagpro.renderer.addConfetti(t);
          (t.lastFrame["s-tags"] = t["s-tags"]),
            (t.lastFrame["s-powerups"] = t["s-powerups"]);
        }
        if (((t.lastFrame["s-captures"] = t["s-captures"]), t.flairEmitter)) {
          var n =
            (t.flairEmitter.emit || t.flairEmitter.always) &&
            t.sprite.visible &&
            t.sprites.flair.visible &&
            !t.dead;
          (t.flairEmitter.emit = n),
            t.flairEmitter.updateOwnerPos(t.x + 20, t.y - 9),
            n && t.flairEmitter.resetPositionTracking();
        }
      }
    };
  }
});

function WhichPageAreWeOn() {
  if (location.port || location.pathname === "/game") {
    //In a real game
    return "ingame";
  } else if (location.pathname === "/games/find") {
    //Joining page
    return "joining";
  } else if (location.pathname === "/") {
    //Chosen server homepage
    return "server";
  } else if (location.pathname.indexOf("/profile/") >= 0) {
    if ($("#saveSettings").length) {
      return "profile"; //Our profile page and logged in
    } else {
      return "profileNotOurs"; //Profile page, but not our one (or we're logged out)
    }
  } else if (location.pathname === "/groups") {
    return "groups";
  } else if (location.pathname === "/boards") {
    return "boards";
  } else if (location.pathname === "/maps") {
    return "maps";
  } else if (location.pathname === "/textures") {
    return "textures";
  }
}
