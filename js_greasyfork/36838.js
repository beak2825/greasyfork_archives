// ==UserScript==
// @name         Show weapon images on stat.ink
// @namespace    https://greasyfork.org/scripts/36838
// @version      0.51
// @description  show weapon images on stat.ink
// @author       IwYvI
// @match        https://stat.ink/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36838/Show%20weapon%20images%20on%20statink.user.js
// @updateURL https://update.greasyfork.org/scripts/36838/Show%20weapon%20images%20on%20statink.meta.js
// ==/UserScript==

(function() {
  "use strict";

  var imageBaseUrl = "https://app.splatoon2.nintendo.net/images/weapon/";
  var weaponMap = {
    ".52 Gal": "3e69eaa1b1463689ddbe4fe23661f007dc216b08.png",
    ".52 Gal Deco": "7c1f6652d03aeb89872cb48ec355205232926869.png",
    ".96 Gal": "a696c21270a22fdb9babb63512031f5283be7c31.png",
    ".96 Gal Deco": "5c61f04a1a2218fca2816e614a8aa0e6c02ca8d6.png",
    "Aerospray MG": "33b212a5ed9d0ab13bc06efa634ce52e8560b68b.png",
    "Aerospray PG": "06c772d8a308136b401ef996414b76b14c28bc3c.png",
    "Aerospray RG": "4b547e6e039b8a142db19618970a55fb441830d4.png",
    "Ballpoint Splatling": "dee7a86b925710935d1ac9d3039d4867bc9ea5db.png",
    "Ballpoint Splatling Nouveau": "0948019a40074c92affe00fd0d9d003101b6fd9d.png",
    "Bamboozler 14 Mk I": "bbabdf1a9ad9fc2217c21cc35993c04ee9bc58b5.png",
    "Bamboozler 14 Mk II": "067bd14e170d7a66e55a881d4ae37280e600baac.png",
    "Bamboozler 14 Mk III": "f4346e7a69af435ac7228a3eb84b7655baea3049.png",
    Blaster: "5e26f6a8217836c25ac0c75f05b13e6051bdc644.png",
    Bloblobber: "e8d17d8b73fc1eaa3e3672c54e8800163d909ede.png",
    "Bloblobber Deco": "c30fc877495c0403b13aa9ad4ae1a5639bce99bb.png",
    "Carbon Roller": "193d0700fdbd08d58c72b7ac0e282984e77a7ffc.png",
    "Carbon Roller Deco": "a4b83907f8a0050f293bf446a4ce693af3a12afd.png",
    "Cherry H-3 Nozzlenose": "420770410cdcb567575b9b28a4dc315e4fc94fb8.png",
    "Clash Blaster": "34f78531f33c2952f9522eeb550838070ecde432.png",
    "Clash Blaster Neo": "9176035499629be618544bb8313044f6bb3b1344.png",
    "Classic Squiffer": "a0730bdef035d247bcc5d2361abb561aa4a4d6ed.png",
    "Clear Dapple Dualies": "aa2c27ad9564d43c954c2c48d95e9256bce61062.png",
    "Custom Blaster": "19d6a4f48f26528131a890314c7b36cd0868eb79.png",
    "Custom Dualie Squelchers": "7ccb1233eb949e651d0c9e49971f1c0c6be59138.png",
    "Custom E-liter 4K": "de573343cfbc69465a6f270a8a46dffe4dcd40f6.png",
    "Custom E-liter 4K Scope": "c23d8f82d8cc9f2994ca7d08493b3bc9b64ad674.png",
    "Custom Explosher": "a3cb2eb16ca00c38eb0e8903ff03d8b01bddd1f6.png",
    "Custom Goo Tuber": "5a1bdae8e7787233508ff826dfdf597f801d62a9.png",
    "Custom Hydra Splatling": "ffea4ec56bfca91a023c6f8c8a79cb368e8df030.png",
    "Custom Jet Squelcher": "92adfb3ab76ed9479e765271992b3fd5378b1bc6.png",
    "Custom Range Blaster": "62a55f1f8fe10aac6fe04c2850d2e3a8d28bca58.png",
    "Custom Splattershot Jr.": "adb23cb4b136704f93bd3bf1d21bbfd596e8b62e.png",
    "Dapple Dualies": "377fede68e69d13c1790fc90c3cb8c912a2a89db.png",
    "Dapple Dualies Nouveau": "89788a61d447a2e2ffc4de5bb18be321271adc47.png",
    "Dark Tetra Dualies": "78f0df8c7b0f625d91f5b4ea953b10872109c77b.png",
    "Dualie Squelchers": "3abcd1e1152e6d819bee363311edcf4737d14a45.png",
    "Dynamo Roller": "b3ae201685123edb72b1fb2686eebd3b1b58437f.png",
    "E-liter 4K": "029c670a12106e979c7b775979f86e5759784e3c.png",
    "E-liter 4K Scope": "42e1e9d865f3c0f23d49d05a99783d25d023b89f.png",
    "Enperry Splat Dualies": "dd413cbc15fed38922b1d2a27b6b84571ef3d087.png",
    Explosher: "bf0d4b5ddc35a533fc5080d025707f386b2a5daa.png",
    "Firefin Splat Charger": "e1aee30e0e64c89286a82cd5bbbd77a764a06446.png",
    "Firefin Splatterscope": "f273f3c84188b69cb8e192003e5e7e0a527593b7.png",
    "Flingza Roller": "d0145bac97eabd1046263c8856f3e14c68547a90.png",
    "Foil Flingza Roller": "be04e073c9ff2584c5b68c61dd0c19e5b7d38f58.png",
    "Foil Squeezer": "f4701d24ced7d59622385fb0b8471c38c8869739.png",
    "Forge Splattershot Pro": "f296766203483ad4dc9c12604500fea5a4699b0f.png",
    "Fresh Squiffer": "516e43f1d29d11776cac369d4cf99be51b41b965.png",
    "Glooga Dualies": "7fa3c37a222e3acd2e41cd8c7554a94b27a9f46b.png",
    "Glooga Dualies Deco": "7bf3815d02c4d310ce69e083b612fbb45aba0865.png",
    "Gold Dynamo Roller": "3804a666bfaeb02c40808e7d60f7ffb364beb228.png",
    "Goo Tuber": "6abb5804369429bf96bb32c14d899c4b9da3e431.png",
    "Grim Range Blaster": "c844758e5b5be41de7324c8e16cd559a45234fc3.png",
    "H-3 Nozzlenose": "8f342949acc700b1603425071620dbae8536dbed.png",
    "H-3 Nozzlenose D": "b8fe14c22c7cf51526aaa252ba6250800e8fc44d.png",
    "Heavy Splatling": "c8d18b0264f1acd1e7d374a8b2c3b6fc526c790a.png",
    "Heavy Splatling Deco": "1db8bbfe2fd6ce2f64711d6a1b2acf27acf11882.png",
    "Heavy Splatling Remix": "58291b961224a69acae2050fbbd87bee6392bbaa.png",
    "Hero Blaster Replica": "a20cd4e509af52149456457fea2939e628ba83e5.png",
    "Hero Brella Replica": "8b62de420955b0f0d4cf9dd9accecb49fc37c448.png",
    "Herobrush Replica": "9d255e4abc48ac0b67f7a6b7c8e7199a741aced8.png",
    "Hero Charger Replica": "5a901e56b8f13eb20fee865d116199b490d1f7ae.png",
    "Hero Dualie Replicas": "544c6dd7fbaf14f2256e5b7007c9d99bcd964f59.png",
    "Hero Roller Replica": "d782fd218fe45d0f2b82a8a1f72fb3d824e7c759.png",
    "Hero Shot Replica": "9192b55c5189f75d4326db8f5d915bd684a4123f.png",
    "Hero Slosher Replica": "bfffe83ae6538217c44072a52b66cbcaa102d6c5.png",
    "Hero Splatling Replica": "671fa6a5866cfacdcb82119f141774cfb1ab88c3.png",
    "Hydra Splatling": "3a92a1fa8320222ca300d3c3ac25474c5077c304.png",
    Inkbrush: "e5be617760b68c9a1e3fc778275a6f4a1aedc1e6.png",
    "Inkbrush Nouveau": "1bb669aa8f0b5f314f8b50dede301058e124c879.png",
    "Jet Squelcher": "2ec8112dc3b29c82869810743473655f4427e65a.png",
    "Kensa .52 Gal": "7287d8c9884a52cd7a40088f1eb214ed0fdd4804.png",
    "Kensa Charger": "a275a69a05894dc555dae0d2ba926eee4d998b32.png",
    "Kensa Dynamo Roller": "9354e96a72e0396db6121d78d75e63bbd9bf69fc.png",
    "Kensa Glooga Dualies": "0e79367d6d571ca2622174c2753f1dfb49e9430e.png",
    "Kensa L-3 Nozzlenose": "00593ba2e0b7457dcaf3630167669e61911da284.png",
    "Kensa Luna Blaster": "64eddf25a944ce84dadf53f26ce45a9584d6ebbc.png",
    "Kensa Mini Splatling": "a07c8b4be43017c069f3424a913cfae15ecbb9db.png",
    "Kensa Octobrush": "c32a200ce6485096839626fb3c88ae0374e55f95.png",
    "Kensa Rapid Blaster": "42f6471ad13905ec61336ad28635b0a4bf4768e7.png",
    "Kensa Sloshing Machine": "b904c97a2de61072e6f33cf4f8c53236ce052809.png",
    "Kensa Splat Dualies": "cae61852be10e21edb75d99b4ccfdd58c25b6242.png",
    "Kensa Splat Roller": "e8248f9fe8360700b93b60617f3613be018e049f.png",
    "Kensa Splatterscope": "2ea9e602522c002b982d36720f548f7e383716f1.png",
    "Kensa Splattershot": "fe42a0e502228e086d6cb7c90d74592e1f1c2d36.png",
    "Kensa Splattershot Jr.": "2f5cbbe7943526e219b78fea09c44db0226bf38d.png",
    "Kensa Splattershot Pro": "54ce83bf80f87263854d3c96ebdb54f427aa0a09.png",
    "Kensa Undercover Brella": "13b4449a704ffe38c640fc0dd4144fef28e9e80d.png",
    "Krak-On Splat Roller": "40ac15e0a6e28784fe270aabda044c1d77a3e49d.png",
    "Light Tetra Dualies": "2034c1d1a59d730c91ea23f879befa7259b9f947.png",
    "L-3 Nozzlenose": "41001d5ba8ce0f05aaa00f9a0d6368b1fa109c73.png",
    "L-3 Nozzlenose D": "f35e387803b7ad60b415fcb9c6a67e96cec22208.png",
    "Luna Blaster": "2764365e99414ebb3f8b62548beb4dd5f65b70b2.png",
    "Luna Blaster Neo": "5011acd7fc35c6ce405ffd3c3446011cafe5aab9.png",
    "Mini Splatling": "585e0e72053689bbab848d97ec07bac4ea769e68.png",
    "Nautilus 47": "695cedb1ff72589173c85ce61ad4dbc9e025249a.png",
    "Nautilus 79": "d278baf341686f935c7516e6a6e1616833f18e4b.png",
    "Neo Splash-o-matic": "b4fd108db45846a5f006dbdcbe09c4c50b8be4b7.png",
    "Neo Sploosh-o-matic": "c5831ecfe6c46fa457afd4263754114c9c1922d1.png",
    "New Squiffer": "87383dc43ce9df6554d0731821badcb69cdbb79f.png",
    "N-ZAP '83": "8665571e5b2e3f0eacf39c47643d9b2e2d21db6b.png",
    "N-ZAP '85": "fdcd7cbe806eb84df374ea8f7e074ac9637d4762.png",
    "N-ZAP '89": "762846bf92742185c5507347aec26014afc7a43a.png",
    Octobrush: "5f565ede7ae220d5b1d453b3ef55b8d20d7b9a2a.png",
    "Octobrush Nouveau": "65d7449a3ba5f558b60d352a75038f2e003db5e1.png",
    "Octo Shot Replica": "c83b40e0bc5c913354bfd8b60c72904eab45d7e6.png",
    "Permanent Inkbrush": "8ef629f5ace0c5237e0256e247e556525a9d5192.png",
    "Range Blaster": "01b9c027ce23361582f6fd4c5ade502e5e5211b2.png",
    "Random": "https://app.splatoon2.nintendo.net/images/coop_weapons/746f7e90bc151334f0bf0d2a1f0987e311b03736.png",
    "Rapid Blaster": "0a362970b38864f80cca68fed6deb43354333703.png",
    "Rapid Blaster Deco": "9b5ece6105fd7077f6b22015d57e3a26aee93d39.png",
    "Rapid Blaster Pro": "91208c6fe9fc4e62e81412d6e772fc696b1a7317.png",
    "Rapid Blaster Pro Deco": "3b6c19b6dceaf4ad369f42864f8276be4f96e88a.png",
    "Soda Slosher": "b5b4131e9758b804af21c2411ca36f0b569d0547.png",
    Slosher: "739b0f54bae840643b470c054808a3740c230a74.png",
    "Slosher Deco": "97e0132b1f1a4d27d8d7831b429a21985bf088c3.png",
    "Sloshing Machine": "e3a38f4e457c8d8d7e5629d7f8508487c6c12746.png",
    "Sloshing Machine Neo": "49509dd4dae88c644eb88ebbc407dde3fb5ce88f.png",
    "Sorella Brella": "21835942cc2b4b083b6a7351501fdc78c40b3b6f.png",
    "Splash-o-matic": "be61eacdea2c695d28ec5d60e1a04fafbc384736.png",
    "Splat Brella": "9a1adf1c38c1a017bad0be0cac13255ae0f8d25b.png",
    "Splat Charger": "d359c8312037a0c98db73cb0a4122cf2c5665f77.png",
    "Splat Dualies": "c60760efc43e3a509187a1b714be477f7fb6c514.png",
    "Splat Roller": "626210255f99cb22bee1eded39457c51aa9622aa.png",
    Splatterscope: "928d52eca6c3f907f7c6f9132236cbf92e658466.png",
    Splattershot: "98282e995fc07e2f2ba6157bcfdc997c5161f309.png",
    "Splattershot Jr.": "f1419d88f30dfacdb94a8122ccdd8c14bbadc7c4.png",
    "Splattershot Pro": "05d735502f00fe9cbcaca8714f7102653da888fd.png",
    "Sploosh-o-matic": "60cff5009fde2559f7a4106aafcfd1a3c724971f.png",
    "Sploosh-o-matic 7": "0856db0af087de81ffa3207f96d6e100f9de63d5.png",
    Squeezer: "38fd7f743bd9db2e2dfb2b8cd81576028ee7ab89.png",
    "Tenta Camo Brella": "fd7e54f28e13a3c87bf67c4d377ed0378d276e8b.png",
    "Tenta Brella": "331b77152310658a25ab934b91cf44e0c4912968.png",
    "Tenta Sorella Brella": "710cd6f02a2956f401082f0db1d5b47a967ec5c7.png",
    "Tentatek Splattershot": "5f519a8b3f436c854dc81ee14bfc3a26aef09ebc.png",
    "Tri-Slosher": "c1befd17d09a527b66f9d2c8a70849a4969642e4.png",
    "Tri-Slosher Nouveau": "149f183355354c83153f1a03ac610c23aba20a2d.png",
    "Undercover Brella": "2385e4a32df2857b67e1b9b4f622089e9da36bbc.png",
    "Undercover Sorella Brella": "907517e291eb3c1d5e8b1e40a73ffa67eae104b4.png",
    "Zink Mini Splatling": "398f5fe8cc39470b89f76bd6384edc9ec720512a.png"
  };
  var weaponList = [];

  function getWeaponImage(weaponName) {
    for (var i = 0; i < weaponList.length; i++) {
      var w = weaponList[i];
      if (w.name) {
        for (var lang in w.name) {
          if (w.name[lang] === weaponName) {
            return weaponMap[w.name.en_US];
          }
        }
      }
    }
    return weaponMap[weaponName];
  }

  function changeToImage($el) {
    var weaponName = $el.text();
    if (!weaponName) {
      return;
    }
    weaponName = weaponName.trim();
    var weaponImage = getWeaponImage(weaponName);
    if (weaponImage) {
      if(weaponImage.indexOf('https') === -1) {
        weaponImage = imageBaseUrl + weaponImage;
      }
      $el.prepend(
        "<img src='" +
          weaponImage +
          "' style='height:30px;width:30px;padding-right: 10px;box-sizing:content-box;'></img>"
      );
    }
  }

  function getWeaponList(callback) {
    $.get("/api/v2/weapon", function(data, status) {
      weaponList = data || [];
      callback();
    });
  }

  function main() {
    // Splat Log
    var cellMainWeapon = $(".cell-main-weapon");
    cellMainWeapon.each(function() {
      changeToImage($(this));
    });

    // Battle Result
    var colWeapon = $(".col-weapon");
    colWeapon.each(function() {
      changeToImage($(this));
    });

    // Battle Stats (by Weapon)
    if (location.pathname.indexOf("/spl2/stat/by-weapon") !== -1) {
      var battleStatsByWeapon = $("#w1 table tbody tr").find("td:first-child");
      battleStatsByWeapon.each(function() {
        changeToImage($(this));
      });
    }

    // Entire Weapon Stat
    if (location.pathname.indexOf("/entire/weapons2") !== -1) {
      var entireWeapon = $("#w1 table tbody tr").find("td:first-child");
      entireWeapon.each(function() {
        changeToImage($(this));
      });
    }

    // Daily report
    if (location.pathname.indexOf("/spl2/stat/report" !== -1)) {
      var battleReport = $(".table-responsive table tbody tr").find(
        "td:nth-child(6)"
      );
      battleReport.each(function() {
        changeToImage($(this));
      });
    }

    var scheduleSalmon = $(
      "#schedule-salmon .salmon-schedule .thumbnail-salmon"
    ).find(".col-xs-6:nth-child(2)");
    scheduleSalmon.each(function() {
      var result = "";
      var content = $(this).html() || [];
      if (content) {
        content = content.trim().split("<br>");
        content = content.map(function(value) {
          return value.replace("*", "").trim();
        });
      }
      result = "<div>" + content.join("</div><div>") + "</div>";
      console.log(result);
      $(this).html(result);
      var weaponArr = $(this).find("div");
      weaponArr.each(function() {
        changeToImage($(this));
      });
    });
  }

  $(document).ready(function() {
    getWeaponList(function() {
      main();
    });
  });
})();
