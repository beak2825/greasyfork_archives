// ==UserScript==
// @name         百合会添加麻将脸表情
// @version      1.0
// @icon         https://bbs.yamibo.com/favicon.ico
// @description  为百合会表情栏添加s1麻将脸表情选项卡
// @author       koitoyuu19
// @match        *://bbs.yamibo.com/*
// @grant        none
// @namespace https://greasyfork.org/users/816027
// @downloadURL https://update.greasyfork.org/scripts/530895/%E7%99%BE%E5%90%88%E4%BC%9A%E6%B7%BB%E5%8A%A0%E9%BA%BB%E5%B0%86%E8%84%B8%E8%A1%A8%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/530895/%E7%99%BE%E5%90%88%E4%BC%9A%E6%B7%BB%E5%8A%A0%E9%BA%BB%E5%B0%86%E8%84%B8%E8%A1%A8%E6%83%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        customSmilies: [
            {
                id: 'custom_1',
                code: '[img]https://p.sda1.dev/22/15313feb29cd197c8b466cfcfb790fc0/001.png[/img]',
                src: 'https://p.sda1.dev/22/15313feb29cd197c8b466cfcfb790fc0/001.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_2',
                code: '[img]https://p.sda1.dev/22/f6939189d3b95f8f84fe9962a2b80403/003.png[/img]',
                src: 'https://p.sda1.dev/22/f6939189d3b95f8f84fe9962a2b80403/003.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_3',
                code: '[img]https://p.sda1.dev/22/af51f0a8c7120a7268433841732f455e/009.gif[/img]',
                src: 'https://p.sda1.dev/22/af51f0a8c7120a7268433841732f455e/009.gif',
                width: 32,
                height: 32
            },
            {
                id: 'custom_4',
                code: '[img]https://p.sda1.dev/22/0d7b4798b48fc955d01742a1b058de2b/012.png[/img]',
                src: 'https://p.sda1.dev/22/0d7b4798b48fc955d01742a1b058de2b/012.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_5',
                code: '[img]https://p.sda1.dev/22/b13cf1dab7549e204d7b9b6556a52ad0/019.png[/img]',
                src: 'https://p.sda1.dev/22/b13cf1dab7549e204d7b9b6556a52ad0/019.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_6',
                code: '[img]https://p.sda1.dev/22/668525cdd28919788b961727e1ba8d9f/020.png[/img]',
                src: 'https://p.sda1.dev/22/668525cdd28919788b961727e1ba8d9f/020.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_7',
                code: '[img]https://p.sda1.dev/22/58bf12f50e2c4d9aedadc34d52d5619e/021.png[/img]',
                src: 'https://p.sda1.dev/22/58bf12f50e2c4d9aedadc34d52d5619e/021.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_8',
                code: '[img]https://p.sda1.dev/22/1353d971d10c080271f83524bc1ae17c/022.png[/img]',
                src: 'https://p.sda1.dev/22/1353d971d10c080271f83524bc1ae17c/022.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_9',
                code: '[img]https://p.sda1.dev/22/a11a243f268dd2ce35b059e8bdc215d1/023.png[/img]',
                src: 'https://p.sda1.dev/22/a11a243f268dd2ce35b059e8bdc215d1/023.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_10',
                code: '[img]https://p.sda1.dev/22/c0577c2bd21c7a76cddbda5399fa043d/026.png[/img]',
                src: 'https://p.sda1.dev/22/c0577c2bd21c7a76cddbda5399fa043d/026.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_11',
                code: '[img]https://p.sda1.dev/22/bb5253e3218ca449ac5ca43ec56e818a/033.png[/img]',
                src: 'https://p.sda1.dev/22/bb5253e3218ca449ac5ca43ec56e818a/033.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_12',
                code: '[img]https://p.sda1.dev/22/bd6ba983e0e2b2a82860acb0f09a5870/034.png[/img]',
                src: 'https://p.sda1.dev/22/bd6ba983e0e2b2a82860acb0f09a5870/034.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_13',
                code: '[img]https://p.sda1.dev/22/27449600cb66931421edac0a75e34e9e/037.png[/img]',
                src: 'https://p.sda1.dev/22/27449600cb66931421edac0a75e34e9e/037.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_14',
                code: '[img]https://p.sda1.dev/22/60f0755293d2f7a35a400aaf97e9cfb8/040.png[/img]',
                src: 'https://p.sda1.dev/22/60f0755293d2f7a35a400aaf97e9cfb8/040.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_15',
                code: '[img]https://p.sda1.dev/22/2680cd5af750772e47ce7e9bc4fbc4f5/046.png[/img]',
                src: 'https://p.sda1.dev/22/2680cd5af750772e47ce7e9bc4fbc4f5/046.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_16',
                code: '[img]https://p.sda1.dev/22/b04181021edb2d9d86ff709a3ff20e0e/047.png[/img]',
                src: 'https://p.sda1.dev/22/b04181021edb2d9d86ff709a3ff20e0e/047.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_17',
                code: '[img]https://p.sda1.dev/22/fc000de3333f6d34bffa94912f5bca2c/048.png[/img]',
                src: 'https://p.sda1.dev/22/fc000de3333f6d34bffa94912f5bca2c/048.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_18',
                code: '[img]https://p.sda1.dev/22/16a6b3f527fa5186d90107c4aa77ff9e/049.png[/img]',
                src: 'https://p.sda1.dev/22/16a6b3f527fa5186d90107c4aa77ff9e/049.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_19',
                code: '[img]https://p.sda1.dev/22/889317d59a54b833781b1355739bcaad/051.png[/img]',
                src: 'https://p.sda1.dev/22/889317d59a54b833781b1355739bcaad/051.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_20',
                code: '[img]https://p.sda1.dev/22/77a636dd637e36ba986faf322b8f59ed/053.png[/img]',
                src: 'https://p.sda1.dev/22/77a636dd637e36ba986faf322b8f59ed/053.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_21',
                code: '[img]https://p.sda1.dev/22/a5928db488e38eacb04ca1c21bb8120b/062.gif[/img]',
                src: 'https://p.sda1.dev/22/a5928db488e38eacb04ca1c21bb8120b/062.gif',
                width: 32,
                height: 32
            },
            {
                id: 'custom_22',
                code: '[img]https://p.sda1.dev/22/0d40e6021895956d4a8b66a3118b458c/065.png[/img]',
                src: 'https://p.sda1.dev/22/0d40e6021895956d4a8b66a3118b458c/065.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_23',
                code: '[img]https://p.sda1.dev/22/8d05f549628c76b3ba2661f001b5b577/066.png[/img]',
                src: 'https://p.sda1.dev/22/8d05f549628c76b3ba2661f001b5b577/066.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_24',
                code: '[img]https://p.sda1.dev/22/9dbccb62cac536bafb2196566882e793/067.png[/img]',
                src: 'https://p.sda1.dev/22/9dbccb62cac536bafb2196566882e793/067.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_25',
                code: '[img]https://p.sda1.dev/22/1c60aa520f3399fbd8e1b40bd4a8229f/068.png[/img]',
                src: 'https://p.sda1.dev/22/1c60aa520f3399fbd8e1b40bd4a8229f/068.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_26',
                code: '[img]https://p.sda1.dev/22/83af6652249baf3d701339f3b7854783/071.png[/img]',
                src: 'https://p.sda1.dev/22/83af6652249baf3d701339f3b7854783/071.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_27',
                code: '[img]https://p.sda1.dev/22/2c8611a918448a71284d4e7c466fd5b8/072.png[/img]',
                src: 'https://p.sda1.dev/22/2c8611a918448a71284d4e7c466fd5b8/072.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_28',
                code: '[img]https://p.sda1.dev/22/78ff5c3bffed19d1d42d007aed21d7b8/074.png[/img]',
                src: 'https://p.sda1.dev/22/78ff5c3bffed19d1d42d007aed21d7b8/074.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_29',
                code: '[img]https://p.sda1.dev/22/51a2b6db9b8375dfd7d00cd3b8143132/075.png[/img]',
                src: 'https://p.sda1.dev/22/51a2b6db9b8375dfd7d00cd3b8143132/075.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_30',
                code: '[img]https://p.sda1.dev/22/05769301484259917040296362416c13/076.png[/img]',
                src: 'https://p.sda1.dev/22/05769301484259917040296362416c13/076.png',
                width: 32,
                height: 37
            },
            {
                id: 'custom_31',
                code: '[img]https://p.sda1.dev/22/8d73c3edd48ff4d50f9dd6cb341cae37/077.png[/img]',
                src: 'https://p.sda1.dev/22/8d73c3edd48ff4d50f9dd6cb341cae37/077.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_32',
                code: '[img]https://p.sda1.dev/22/1586e0db337440ec0416e43ef156a43a/078.png[/img]',
                src: 'https://p.sda1.dev/22/1586e0db337440ec0416e43ef156a43a/078.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_33',
                code: '[img]https://p.sda1.dev/22/7bc3df3369a9de5b9f43c8e54bd7ac2d/079.png[/img]',
                src: 'https://p.sda1.dev/22/7bc3df3369a9de5b9f43c8e54bd7ac2d/079.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_34',
                code: '[img]https://p.sda1.dev/22/f0a769f5775e0093244b59a2ea465ce5/081.png[/img]',
                src: 'https://p.sda1.dev/22/f0a769f5775e0093244b59a2ea465ce5/081.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_35',
                code: '[img]https://p.sda1.dev/22/88ac133b117bb9d653e487ad3ed0cbea/082.png[/img]',
                src: 'https://p.sda1.dev/22/88ac133b117bb9d653e487ad3ed0cbea/082.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_36',
                code: '[img]https://p.sda1.dev/22/7b43b3c894bcd6cf54f83a9be8f15525/085.png[/img]',
                src: 'https://p.sda1.dev/22/7b43b3c894bcd6cf54f83a9be8f15525/085.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_37',
                code: '[img]https://p.sda1.dev/22/0f08c889e1862b13471ba1099be5cfaa/086.png[/img]',
                src: 'https://p.sda1.dev/22/0f08c889e1862b13471ba1099be5cfaa/086.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_38',
                code: '[img]https://p.sda1.dev/22/3002daeefe6176db0ddb1bf9b8e71ef8/097.png[/img]',
                src: 'https://p.sda1.dev/22/3002daeefe6176db0ddb1bf9b8e71ef8/097.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_39',
                code: '[img]https://p.sda1.dev/22/0ceaa6e09f1f3f70e7ae2af1f635975f/107.png[/img]',
                src: 'https://p.sda1.dev/22/0ceaa6e09f1f3f70e7ae2af1f635975f/107.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_40',
                code: '[img]https://p.sda1.dev/22/ff5952f1d9028111e8372ef1b625395f/112.png[/img]',
                src: 'https://p.sda1.dev/22/ff5952f1d9028111e8372ef1b625395f/112.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_41',
                code: '[img]https://p.sda1.dev/22/534772ec542479339945b61d6e47147f/118.png[/img]',
                src: 'https://p.sda1.dev/22/534772ec542479339945b61d6e47147f/118.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_42',
                code: '[img]https://p.sda1.dev/22/ef633e6fc3acbb7ec46e947dfbe8312a/119.png[/img]',
                src: 'https://p.sda1.dev/22/ef633e6fc3acbb7ec46e947dfbe8312a/119.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_43',
                code: '[img]https://p.sda1.dev/22/8784e2a89e385dc623ab2e62b0fa5d55/125.png[/img]',
                src: 'https://p.sda1.dev/22/8784e2a89e385dc623ab2e62b0fa5d55/125.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_44',
                code: '[img]https://p.sda1.dev/22/a16ceca876ffe9484a5886cf2b09e21a/134.png[/img]',
                src: 'https://p.sda1.dev/22/a16ceca876ffe9484a5886cf2b09e21a/134.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_45',
                code: '[img]https://p.sda1.dev/22/e232da57ecf4e594fea12f4eb5e83333/136.png[/img]',
                src: 'https://p.sda1.dev/22/e232da57ecf4e594fea12f4eb5e83333/136.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_46',
                code: '[img]https://p.sda1.dev/22/825cb736c90f567758286021aad5655d/139.png[/img]',
                src: 'https://p.sda1.dev/22/825cb736c90f567758286021aad5655d/139.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_47',
                code: '[img]https://p.sda1.dev/22/be8a86ce0c1ba53351ca65f510fddfa2/162.png[/img]',
                src: 'https://p.sda1.dev/22/be8a86ce0c1ba53351ca65f510fddfa2/162.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_48',
                code: '[img]https://p.sda1.dev/22/8ee08c0d597e8d23f0bdd1fd0c4f1151/163.png[/img]',
                src: 'https://p.sda1.dev/22/8ee08c0d597e8d23f0bdd1fd0c4f1151/163.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_49',
                code: '[img]https://p.sda1.dev/22/d4516daf76b46b35aba0cd165b8d2d63/165.png[/img]',
                src: 'https://p.sda1.dev/22/d4516daf76b46b35aba0cd165b8d2d63/165.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_50',
                code: '[img]https://p.sda1.dev/22/f8438ca792a7bfe427725e111b8e1852/166.png[/img]',
                src: 'https://p.sda1.dev/22/f8438ca792a7bfe427725e111b8e1852/166.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_51',
                code: '[img]https://p.sda1.dev/22/068a38b6fdc5bc180d4311c041bdb3c7/168.gif[/img]',
                src: 'https://p.sda1.dev/22/068a38b6fdc5bc180d4311c041bdb3c7/168.gif',
                width: 32,
                height: 32
            },
            {
                id: 'custom_52',
                code: '[img]https://p.sda1.dev/22/99d3f265336e327660d72b612a9ff552/169.gif[/img]',
                src: 'https://p.sda1.dev/22/99d3f265336e327660d72b612a9ff552/169.gif',
                width: 32,
                height: 32
            },
            {
                id: 'custom_53',
                code: '[img]https://p.sda1.dev/22/0c320e627219ce453e93a36dfc1afc7b/174.png[/img]',
                src: 'https://p.sda1.dev/22/0c320e627219ce453e93a36dfc1afc7b/174.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_54',
                code: '[img]https://p.sda1.dev/22/4cd183382d84068e9296fa7ef5949c2e/179.png[/img]',
                src: 'https://p.sda1.dev/22/4cd183382d84068e9296fa7ef5949c2e/179.png',
                width: 36,
                height: 43
            },
            {
                id: 'custom_55',
                code: '[img]https://p.sda1.dev/22/21bdcf2685ea61575cc6933f01025136/183.png[/img]',
                src: 'https://p.sda1.dev/22/21bdcf2685ea61575cc6933f01025136/183.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_56',
                code: '[img]https://p.sda1.dev/22/7651124532814a15db0689820c0fade6/187.png[/img]',
                src: 'https://p.sda1.dev/22/7651124532814a15db0689820c0fade6/187.png',
                width: 48,
                height: 36
            },
            {
                id: 'custom_57',
                code: '[img]https://p.sda1.dev/22/79e3bb0f28a10507b4475e77fd9fe7e4/209.gif[/img]',
                src: 'https://p.sda1.dev/22/79e3bb0f28a10507b4475e77fd9fe7e4/209.gif',
                width: 32,
                height: 32
            },
            {
                id: 'custom_58',
                code: '[img]https://p.sda1.dev/22/c32447e03e0557ec4ff99d33755183bc/211.gif[/img]',
                src: 'https://p.sda1.dev/22/c32447e03e0557ec4ff99d33755183bc/211.gif',
                width: 51,
                height: 47
            },
            {
                id: 'custom_59',
                code: '[img]https://p.sda1.dev/22/3e05855a886cf5f8932cad9b80403588/214.gif[/img]',
                src: 'https://p.sda1.dev/22/3e05855a886cf5f8932cad9b80403588/214.gif',
                width: 55,
                height: 38
            },
            {
                id: 'custom_60',
                code: '[img]https://p.sda1.dev/22/242cfdd9885fb3d8a5b36995e37be5ed/217.gif[/img]',
                src: 'https://p.sda1.dev/22/242cfdd9885fb3d8a5b36995e37be5ed/217.gif',
                width: 42,
                height: 30
            },
            {
                id: 'custom_61',
                code: '[img]https://p.sda1.dev/22/19c4b8d4b552586376b3a1dc80bca174/244.gif[/img]',
                src: 'https://p.sda1.dev/22/19c4b8d4b552586376b3a1dc80bca174/244.gif',
                width: 32,
                height: 32
            },
            {
                id: 'custom_62',
                code: '[img]https://p.sda1.dev/22/efd54667d8d8dddfd15ed179f6716d23/245.png[/img]',
                src: 'https://p.sda1.dev/22/efd54667d8d8dddfd15ed179f6716d23/245.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_63',
                code: '[img]https://p.sda1.dev/22/34ae9d321511c0883ac30544f168eec0/252.png[/img]',
                src: 'https://p.sda1.dev/22/34ae9d321511c0883ac30544f168eec0/252.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_64',
                code: '[img]https://p.sda1.dev/22/19a25c8a63d8a7a9a07002778e95de03/257.png[/img]',
                src: 'https://p.sda1.dev/22/19a25c8a63d8a7a9a07002778e95de03/257.png',
                width: 32,
                height: 32
            },
            {
                id: 'custom_65',
                code: '[img]https://p.sda1.dev/22/75dc11369c52943bc41d4bfb47c7fca0/265.gif[/img]',
                src: 'https://p.sda1.dev/22/75dc11369c52943bc41d4bfb47c7fca0/265.gif',
                width: 32,
                height: 50
            },
            {
                id: 'custom_66',
                code: '[img]https://p.sda1.dev/22/037a55d496177b53d8620fb4ba6a268c/275.png[/img]',
                src: 'https://p.sda1.dev/22/037a55d496177b53d8620fb4ba6a268c/275.png',
                width: 32,
                height: 32
            }
        ],
        perRow: 12
    };

    function waitForMenu() {
        return new Promise(function(resolve) {
            const checkInterval = setInterval(function() {
                const menu1 = document.getElementById('fastpostsml_menu');
                const menu2 = document.getElementById('e_sml_menu');
                const menu = menu1 || menu2;

                if (menu && menu.getAttribute('initialized') === 'true') {
                    clearInterval(checkInterval);
                    resolve({
                        menu: menu,
                        type: menu1 ? 'fastpost' : 'e'
                    });
                }
            }, 500);
        });
    }

    function addCustomTab(menuInfo) {
        const menu = menuInfo.menu;
        const menuType = menuInfo.type;
        const tabList = menu.querySelector(menuType === 'fastpost' ?
            '#fastpostsmiliesdiv_tb ul' : '#smiliesdiv_tb ul');

        const customTabId = menuType + 'stype_custom';
        if (document.getElementById(customTabId)) return;

        const customTab = document.createElement('li');
        customTab.id = customTabId;
        customTab.innerHTML = '<a href="javascript:;" hidefocus="true">S1麻将脸</a>';

        customTab.onclick = function() {
            if (window.CURRENTSTYPE) {
                const prevTab = document.getElementById(menuType + 'stype_' + window.CURRENTSTYPE);
                if (prevTab) prevTab.className = '';
            }
            this.className = 'current';
            window.CURRENTSTYPE = 'custom';
            showCustomSmilies(menuType);
            if (window.doane) window.doane(event);
        };

        tabList.appendChild(customTab);
    }

    function insertSmileyCode(code, menuType) {
        if (menuType === 'fastpost') {
            if (window.seditor_insertunit) {
                seditor_insertunit('fastpost', code);
            } else if (window.$('fastpostmessage')) {
                const textarea = window.$('fastpostmessage');
                textarea.value += code;
            }
        } else {
            const textarea = document.getElementById('e_textarea');
            const iframe = document.getElementById('e_iframe');

            if (window.editorinsertunit) {
                window.editorinsertunit(code);
            }
            else if (textarea && textarea.style.display !== 'none') {
                textarea.value += code;
                const event = new Event('input', { bubbles: true });
                textarea.dispatchEvent(event);
            }
            else if (iframe && iframe.style.display !== 'none') {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    iframeDoc.execCommand('insertText', false, code);
                } catch (e) {
                    console.error('插入表情到富文本编辑器失败:', e);
                    if (textarea) {
                        textarea.value += code;
                        const event = new Event('input', { bubbles: true });
                        textarea.dispatchEvent(event);
                    }
                }
            }
            else if (window.insertSmiley) {
                const fakeEvent = { target: { alt: code } };
                window.insertSmiley(fakeEvent);
            }
        }
    }

    function showCustomSmilies(menuType) {
        const containerId = menuType === 'fastpost' ?
            'fastpostsmiliesdiv_data' : 'smiliesdiv_data';
        const container = document.getElementById(containerId);
        if (!container) return;

        const table = document.createElement('table');
        table.id = menuType === 'fastpost' ?
            'fastpostsmiliesdiv_table' : 'smiliesdiv_table';
        table.cellPadding = '0';
        table.cellSpacing = '0';

        const tbody = document.createElement('tbody');
        let tr = document.createElement('tr');

        CONFIG.customSmilies.forEach(function(smiley, index) {
            if (index % CONFIG.perRow === 0 && index !== 0) {
                tbody.appendChild(tr);
                tr = document.createElement('tr');
            }

            const td = document.createElement('td');
            td.id = menuType + '_smilie_' + smiley.id + '_td';

            const img = document.createElement('img');
            img.src = smiley.src;
            img.alt = smiley.alt;
            img.width = smiley.width;
            img.height = smiley.height;
            img.style.cursor = 'pointer';

            // 将事件绑定到图片而不是td
            img.onmouseover = function() {
                if (window.smilies_preview) {
                    window.smilies_preview(
                        menuType === 'fastpost' ? 'fastpost' : 'e_',
                        menuType === 'fastpost' ? 'fastpostsmiliesdiv' : 'smiliesdiv',
                        td, // 仍然传递td元素作为参数
                        50
                    );
                }
            };

            img.onmouseout = function() {
                if (window.smilies_preview) {
                    window.smilies_preview(
                        menuType === 'fastpost' ? 'fastpost' : 'e_',
                        menuType === 'fastpost' ? 'fastpostsmiliesdiv' : 'smiliesdiv',
                        null,
                        0
                    );
                }
            };

            img.onclick = function() {
                insertSmileyCode(smiley.code, menuType);
                const menu = document.getElementById(menuType === 'fastpost' ?
                    'fastpostsml_menu' : 'e_sml_menu');
                if (menu) menu.style.display = 'none';
            };

            td.appendChild(img);
            tr.appendChild(td);
        });

        if (tr.children.length > 0) tbody.appendChild(tr);
        table.appendChild(tbody);
        container.innerHTML = '';
        container.appendChild(table);

        const pageDiv = document.getElementById(menuType === 'fastpost' ?
            'fastpostsmiliesdiv_page' : 'smiliesdiv_page');
        if (pageDiv) pageDiv.innerHTML = '';
    }

    async function main() {
        try {
            const menuInfo = await waitForMenu();
            addCustomTab(menuInfo);

            document.addEventListener('click', function(e) {
                if (e.target.closest('.smilies_btn')) {
                    setTimeout(function() {
                        const customTab = document.querySelector('#fastpoststype_custom, #e_stype_custom');
                        if (customTab && customTab.classList.contains('current')) {
                            showCustomSmilies(customTab.id.includes('fastpost') ? 'fastpost' : 'e');
                        }
                    }, 100);
                }
            });
        } catch (error) {
            console.error('自定义表情脚本出错:', error);
        }
    }

    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }
})();