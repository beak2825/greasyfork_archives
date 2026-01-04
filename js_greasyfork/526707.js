// ==UserScript==
// @name         MooMoo.io Continuous Mill Placement
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Continuously place mills in MooMoo.io when near friendly mills.
// @author       You
// @match        https://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526707/MooMooio%20Continuous%20Mill%20Placement.user.js
// @updateURL https://update.greasyfork.org/scripts/526707/MooMooio%20Continuous%20Mill%20Placement.meta.js
// ==/UserScript==

function renderTextureSkin(index, ctxt, parentSkin, owner) {
    var tmpSkin = skinSprites[index + (txt ? "lol" : 0)];
    if (!tmpSkin) {
        var tmpImage = new Image();
        tmpImage.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        tmpImage.src = setSkinTextureImage(index, "hat", index);
        skinSprites[index + (txt ? "lol" : 0)] = tmpImage;
        tmpSkin = tmpImage;
    }
    var tmpObj = parentSkin || skinPointers[index];
    if (!tmpObj) {
        for (var i = 0; i < hats.length; ++i) {
            if (hats[i].id == index) {
                tmpObj = hats[i];
                break;
            }
        }
        skinPointers[index] = tmpObj;
    }
    if (tmpSkin.isLoaded) {
        ctxt.drawImage(tmpSkin, -tmpObj.scale / 2, -tmpObj.scale / 2, tmpObj.scale, tmpObj.scale);
    }
    if (!parentSkin && tmpObj.topSprite) {
        ctxt.save();
        ctxt.rotate(owner.skinRot);
        renderSkin(index + "_top", ctxt, tmpObj, owner);
        ctxt.restore();
    }
}

var newHatImgs = {
    7: "https://i.imgur.com/vAOzlyY.png",
    15: "https://i.imgur.com/YRQ8Ybq.png",
    11: "https://i.imgur.com/yfqME8H.png",
    12: "https://i.imgur.com/VSUId2s.png",
    40: "https://i.imgur.com/Xzmg27N.png",
    26: "https://i.imgur.com/I0xGtyZ.png",
    6: "https://i.imgur.com/vM9Ri8g.png",
};

var newWeaponImgs = {
    "samurai_1": "https://i.imgur.com/mbDE77n.png",
    "samurai_1_g": "https://cdn.discordapp.com/attachments/967213871267971072/1030852038948552724/image.png",
    "great_hammer_1": "https://cdn.discordapp.com/attachments/748171769155944448/1048806049924259860/image.png",
    "great_hammer_1_g": "https://cdn.discordapp.com/attachments/748171769155944448/1048806467995713607/image_1.png",
    "great_hammer_1_d": "https://cdn.discordapp.com/attachments/748171769155944448/1048806745910292571/image_2.png",
    "dagger_1": "https://cdn.discordapp.com/attachments/748171769155944448/1048808212129927288/image.png",
    "dagger_1_g": "https://cdn.discordapp.com/attachments/748171769155944448/1048808419932504074/image_1.png",
    "hammer_1": "https://cdn.discordapp.com/attachments/748171769155944448/1048809420806692894/image.png",
    "hammer_1_g": "https://cdn.discordapp.com/attachments/748171769155944448/1048809420437602394/image_1.png",
    "spear_1": "https://cdn.discordapp.com/attachments/748171769155944448/1048810908564066324/image_2.png",
    "spear_1_g": "https://cdn.discordapp.com/attachments/748171769155944448/1048810908207558787/image_3.png",
};

function setSkinTextureImage(id, type, id2) {
    if (true) {
        if (newHatImgs[id] && type === "hat") {
            return newHatImgs[id];
        } else if (newAccImgs[id] && type === "acc") {
            return newAccImgs[id];
        } else if (newWeaponImgs[id] && type === "weapons") {
            return newWeaponImgs[id];
        }
    } else {
        if (type == "acc") {
            return ".././img/accessories/access_" + id + ".png";
        } else if (type == "hat") {
            return ".././img/hats/hat_" + id + ".png";
        } else {
            return ".././img/weapons/" + id + ".png";
        }
    }
}
