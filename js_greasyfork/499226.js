// ==UserScript==
// @name         [Predict] Suffolk Punch
// @description  Prediction for Suffolk Punchs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.horsereality.com/horses/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=horsereality.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/499226/%5BPredict%5D%20Suffolk%20Punch.user.js
// @updateURL https://update.greasyfork.org/scripts/499226/%5BPredict%5D%20Suffolk%20Punch.meta.js
// ==/UserScript==

var totalTimeout = 0;

const layerRegex = /^https:\/\/www\.horsereality\.com\/upload\/[a-z]+\/[a-z]+\/([a-z]+)\/[a-z]+\/([a-z0-9]+)\.png/;
var foal_layer_keys = {
    sex: document.querySelector('img.icon16').alt.toLowerCase(),
    body_layer_key: null,
    body_layers_list: [],
    adult_body_layers: null,
    white_layer_key: null,
    white_layers_list: [],
    adult_white_layers: null
};

class Prediction {
    constructor(foal_body_key, adult_body_key, adult_mane_key, adult_tail_key, sex, breed, phenotype, genotype) {
        this.foal_body_key = foal_body_key;
        this.adult_body_key = adult_body_key;
        this.adult_mane_key = adult_mane_key;
        this.adult_tail_key = adult_tail_key;
        this.sex = sex;
        this.breed = breed;
        this.phenotype = phenotype;
        this.genotype = genotype;
    }

    getBody() {
        return 'https://www.horsereality.com/upload/colours/' + this.sex + 's/body/large/' + this.adult_body_key + '.png';
    }
    getMane() {
        return 'https://www.horsereality.com/upload/colours/' + this.sex + 's/mane/large/' + this.adult_mane_key + '.png';
    }
    getTail() {
        return 'https://www.horsereality.com/upload/colours/' + this.sex + 's/tail/large/' + this.adult_tail_key + '.png';
    }

    getWhiteBody() {
        return 'https://www.horsereality.com/upload/whites/' + this.sex + 's/body/large/' + this.adult_body_key + '.png';
    }
    getWhiteMane() {
        return 'https://www.horsereality.com/upload/whites/' + this.sex + 's/mane/large/' + this.adult_mane_key + '.png';
    }
    getWhiteTail() {
        return 'https://www.horsereality.com/upload/whites/' + this.sex + 's/tail/large/' + this.adult_tail_key + '.png';
    }
    toString() {
        return 'foal:' + this.foal_body_key + ' = {body: ' + this.adult_body_key + ', mane: ' + this.adult_mane_key + ', tail: ' + this.adult_tail_key + '}';
    }
}

var map_body_layers = new Map([
//PASTE BODY COLORS AFTER THIS LINE
['mare_3166e6c78', new Prediction('3166e6c78','90e075f29','90e075f28','90e075f20','mare','suffolk','Chestnut','e/e')],
['stallion_3166e6c78', new Prediction('3166e6c78','90e075f25','90e075f29','90e075f21','stallion','suffolk','Chestnut','e/e')],
['mare_0184a48a9', new Prediction('0184a48a9','0184a48a1','0184a48a0','0184a48a4','mare','suffolk','Chestnut','e/e')],
['stallion_0184a48a9', new Prediction('0184a48a9','0184a48a4','9bfd374b7','9bfd374b7','stallion','suffolk','Chestnut','e/e')],
['mare_fef549ea3', new Prediction('fef549ea3','fef549ea4','fef549ea2','fef549ea6','mare','suffolk','Chestnut','e/e')],
['stallion_fef549ea3', new Prediction('fef549ea3','fef549ea7','fc31bd475','fc31bd473','stallion','suffolk','Chestnut','e/e')],
['mare_3bf0ed9f2', new Prediction('3bf0ed9f2','bf3e17105','bf3e17102','bf3e17109','mare','suffolk','Chestnut','e/e')],
['stallion_3bf0ed9f2', new Prediction('3bf0ed9f2','bf3e17104','bf3e17102','bf3e17104','stallion','suffolk','Chestnut','e/e')],
['mare_50e95b219', new Prediction('50e95b219','50e95b217','8dd392bf8','8dd392bf6','mare','suffolk','Chestnut','e/e')],
['stallion_50e95b219', new Prediction('50e95b219','8dd392bf2','8dd392bf1','8dd392bf8','stallion','suffolk','Chestnut','e/e')],
['mare_211f75546', new Prediction('211f75546','211f75542','211f75543','211f75542','mare','suffolk','Chestnut','e/e')],
['stallion_211f75546', new Prediction('211f75546','211f75544','211f75542','211f75548','stallion','suffolk','Chestnut','e/e')],
['mare_c992cb0f6', new Prediction('c992cb0f6','a58f142f3','a58f142f5','a58f142f2','mare','suffolk','Flaxen Chestnut','e/e f/f')],
['stallion_c992cb0f6', new Prediction('c992cb0f6','a58f142f5','a58f142f9','a58f142f6','stallion','suffolk','Flaxen Chestnut','e/e f/f')],
['mare_8d0039c84', new Prediction('8d0039c84','8d0039c86','8d0039c86','8d0039c82','mare','suffolk','Flaxen Chestnut','e/e f/f')],
['stallion_8d0039c84', new Prediction('8d0039c84','8d0039c89','8d0039c80','8d0039c84','stallion','suffolk','Flaxen Chestnut','e/e f/f')],
['mare_fdbac4957', new Prediction('fdbac4957','fdbac4952','f16a8e6b3','f16a8e6b2','mare','suffolk','Flaxen Chestnut','e/e f/f')],
['stallion_fdbac4957', new Prediction('fdbac4957','f16a8e6b6','f16a8e6b2','f16a8e6b8','stallion','suffolk','Flaxen Chestnut','e/e f/f')],
['mare_cc8fc1592', new Prediction('cc8fc1592','cc8fc1597','cc8fc1591','cc8fc1591','mare','suffolk','Flaxen Chestnut','e/e f/f')],
['stallion_cc8fc1592', new Prediction('cc8fc1592','cc8fc1599','09ff018a6','09ff018a6','stallion','suffolk','Flaxen Chestnut','e/e f/f')],
['mare_9a63ec093', new Prediction('9a63ec093','deb3f8720','deb3f8722','deb3f8724','mare','suffolk','Flaxen Chestnut','e/e f/f')],
['stallion_9a63ec093', new Prediction('9a63ec093','deb3f8725','deb3f8722','56df4a5e1','stallion','suffolk','Flaxen Chestnut','e/e f/f')],
['mare_00f3bf2d0', new Prediction('00f3bf2d0','00f3bf2d5','00f3bf2d9','00f3bf2d0','mare','suffolk','Flaxen Chestnut','e/e f/f')],
['stallion_00f3bf2d0', new Prediction('00f3bf2d0','00f3bf2d4','0bc2ab4a6','0bc2ab4a8','stallion','suffolk','Flaxen Chestnut','e/e f/f')]
//PASTE BODY COLORS BEFORE THIS LINE
]);

var map_white_layers = new Map([
//PASTE WHITES AFTER THIS LINE
['mare_854954249', new Prediction('854954249','854954241','','','mare','suffolk','Tiny star','W/W')],
['stallion_854954249', new Prediction('854954249','854954249','','','stallion','suffolk','Tiny star','W/W')],
['mare_295c8dd48', new Prediction('295c8dd48','704fdb7a9','','','mare','suffolk','Small star','W/W')],
['stallion_295c8dd48', new Prediction('295c8dd48','704fdb7a5','','','stallion','suffolk','Small star','W/W')],
['mare_cc025d1c2', new Prediction('cc025d1c2','cc025d1c1','','','mare','suffolk','Star','W/W')],
['stallion_cc025d1c2', new Prediction('cc025d1c2','cc025d1c5','','','stallion','suffolk','Star','W/W')],
['mare_6d42dd462', new Prediction('6d42dd462','6d42dd465','','','mare','suffolk','Diamond','W/W')],
['stallion_6d42dd462', new Prediction('6d42dd462','6d42dd469','','','stallion','suffolk','Diamond','W/W')],
['mare_b7cb47e53', new Prediction('b7cb47e53','b7cb47e51','','','mare','suffolk','Small stripe','W/W')],
['stallion_b7cb47e53', new Prediction('b7cb47e53','b7cb47e51','','','stallion','suffolk','Small stripe','W/W')],
['mare_0dc206560', new Prediction('0dc206560','0dc206561','','','mare','suffolk','Big stripe','W/W')],
['stallion_0dc206560', new Prediction('0dc206560','0dc206568','','','stallion','suffolk','Big stripe','W/W')]
//PASTE WHITES BEFORE THIS LINE
]);

setTimeout(collect_info, timeout(100));

setTimeout(function() {
    foal_layer_keys.adult_body_layers = map_body_layers.get(foal_layer_keys.sex + '_' + foal_layer_keys.body_layer_key);
    foal_layer_keys.adult_white_layers = map_white_layers.get(foal_layer_keys.sex + '_' + foal_layer_keys.white_layer_key);

    if(!(foal_layer_keys.adult_body_layers === undefined)) {
        if (document.location.href.indexOf("predict=true") > 0 ) {
            predict_foal();
        }

        var infotext = document.getElementsByClassName('infotext')[0];

        let lastCell = document.querySelectorAll('.infotext .right')
        lastCell = lastCell[lastCell.length - 1]
        if (!lastCell.innerText) lastCell.innerText = '\u200b';

        if(document.getElementById("PP_left") == null) {
            var pp = document.createElement('div');
            pp.id = "PP_left";
            pp.className = "left";
            pp.textContent ='PP';
            infotext.appendChild(pp);

            var div = document.createElement('div');
            div.id = "PP_right";
            div.className = "right";
            let a = document.createElement('a');
            a.href="javascript:void(0)";
            a.text='Predict';
            a.onclick = predict_foal;
            div.appendChild(a);
            infotext.appendChild(div);
        } else {
            let a = document.createElement('a');
            a.href="javascript:void(0)";
            a.text='Predict';
            a.onclick = predict_foal;
            document.getElementById("PP_right").appendChild(document.createTextNode(", "));
            document.getElementById("PP_right").appendChild(a);
        }
    }
}, 200);

function collect_info() {
    const containers = document.getElementsByClassName('horse_photo');
    for (const container of containers) {
        for (const img of container.children) {
            const match = img.src.match(layerRegex);
            if (!match) continue

            const keyified = (
                img.src
                .replace('https://www.horsereality.com/upload/', '')
                .replace('.png', '')
            )
            
            if (img.className.indexOf('foal') != -1) {
                if(keyified.startsWith("whites")) {
                    foal_layer_keys.white_layers_list.push(keyified);
                    if(keyified.includes('body')){
                        foal_layer_keys.white_layer_key = keyified.replace("whites/foals/body/large/",'');
                    }
                } else {
                    foal_layer_keys.body_layers_list.push(keyified);
                    if(keyified.includes('body')){
                        foal_layer_keys.body_layer_key = keyified.replace("colours/foals/body/large/",'');
                    }
                }
            }
        }
    }
}

function predict_foal() {

    if (document.querySelector('.horse_photocon.foal')) {
        let url = document.querySelector('.horse_photocon.foal').parentNode.href;
        if (url !== undefined) {
            window.open(url + "predict=true","_self");
        }
        document.querySelector('.horse_photocon.foal').classList.remove('foal');
    }
    if (document.querySelector('.horse_photocon.mom')) document.querySelector('.horse_photocon.mom').remove();

    try {
        let innerHTML = '';
        if(foal_layer_keys.sex == "mare") {
            innerHTML += newImage(foal_layer_keys.adult_body_layers.getBody());
            if(foal_layer_keys.adult_white_layers !== undefined && foal_layer_keys.adult_white_layers.adult_body_key != '') {
                innerHTML += newImage(foal_layer_keys.adult_white_layers.getWhiteBody());
            }

            innerHTML += newImage(foal_layer_keys.adult_body_layers.getTail());
            if(foal_layer_keys.adult_white_layers !== undefined && foal_layer_keys.adult_white_layers.adult_tail_key != '') {
                innerHTML += newImage(foal_layer_keys.adult_white_layers.getWhiteTail());
            }

            innerHTML += newImage(foal_layer_keys.adult_body_layers.getMane());
            if(foal_layer_keys.adult_white_layers !== undefined && foal_layer_keys.adult_white_layers.adult_mane_key != '') {
                innerHTML += newImage(foal_layer_keys.adult_white_layers.getWhiteMane());
            }
        } else {
            innerHTML += newImage(foal_layer_keys.adult_body_layers.getBody());
            if(foal_layer_keys.adult_white_layers !== undefined && foal_layer_keys.adult_white_layers.adult_tail_key != '') {
                innerHTML += newImage(foal_layer_keys.adult_white_layers.getWhiteTail());
            }

            innerHTML += newImage(foal_layer_keys.adult_body_layers.getTail());
            if(foal_layer_keys.adult_white_layers !== undefined && foal_layer_keys.adult_white_layers.adult_body_key != '') {
                innerHTML += newImage(foal_layer_keys.adult_white_layers.getWhiteBody());
            }

            innerHTML += newImage(foal_layer_keys.adult_body_layers.getMane());
            if(foal_layer_keys.adult_white_layers !== undefined && foal_layer_keys.adult_white_layers.adult_mane_key != '') {
                innerHTML += newImage(foal_layer_keys.adult_white_layers.getWhiteMane());
            }
        }

        let hp = document.querySelector('.horse_photo');
        /*console.log(hp);
        for (let img of hp.children) {
            hp.removeChild(img);
        }*/
        hp.innerHTML = innerHTML;

    } catch (e) {console.log(e);}


    // replace the infobox
    const infotext = document.querySelector('.infotext');
    var genotype = foal_layer_keys.adult_body_layers.genotype + (foal_layer_keys.adult_white_layers == null ? '' : " " + foal_layer_keys.adult_white_layers.genotype);
    var phenotype = foal_layer_keys.adult_body_layers.phenotype + (foal_layer_keys.adult_white_layers == null ? '' : " " + foal_layer_keys.adult_white_layers.phenotype);

    const pairs = {
        Genotype: genotype,
        Phenotype: phenotype
    }

    while(infotext.children.length > 12) {
        infotext.children[12].remove();
    }
    for (const label of Object.keys(pairs)) {
        const [left, right] = createInfoPair(label, pairs[label])
        infotext.appendChild(left);
        infotext.appendChild(right)
    }

    predictedBy();

}

function newImage(src) {
    const img = document.createElement('img');
    img.src=src;
    return img.outerHTML;
}

function createInfoPair(label, value) {
    const left = document.createElement('div');
    left.className = 'left';
    left.innerText = label ?? '\u200b';

    const right = document.createElement('div');
    right.className = 'right';
    right.innerText = value ?? '\u200b';

    return [left, right];
}

function predictedBy() {
    const tabnav = document.querySelector('.grid_12.tabnav');
    const tab_a = document.createElement('a');
    tab_a.href = 'https://v2.horsereality.com/user/300907';
    tab_a.target = '_blank';
    const tab = document.createElement('div');
    tab.style = 'float: right;    margin-right: 1px;    padding: 5px 10px;    background-color: #c6d6db;    text-align: center;    border-top-left-radius: 8px;    border-top-right-radius: 8px; color: initial;';
    tab.appendChild(document.createTextNode('Predicted by Tirion'));
    tab_a.appendChild(tab);
    tabnav.appendChild(tab_a);
}

function timeout(value) {
    totalTimeout = totalTimeout + value;
    console.log(totalTimeout);
    return totalTimeout;
}