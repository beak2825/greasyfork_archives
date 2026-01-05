// ==UserScript==
// @name         realt.by
// @namespace    realt
// @version      2.2.0
// @description  taking over the realt comments!
// @author       You
// @match        https://realt.by/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29073/realtby.user.js
// @updateURL https://update.greasyfork.org/scripts/29073/realtby.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var flooders = {
                        'glv': '161cd4abe2',
                        'пгмнутый':"a723022cd3f85d7c955aaa4899ce754d",
                        'гурыч':'c33aac9528230b455ed541771e68e548',
                        'uehsx':'4c13474fc39a765461fa2122fc4cfcb9',
                        'lehf':'fe12bbae56394cf5a243ba015465efa4',
                        'preved':'00d8551e21dc17f0d0dfad5f22a654fd',
                        'ленивый':'02ab8b054df49ba8eaf7784394d6c7a0',
                        '731231':'02f190838c5907b2cf6cf7bc4bb704b6',
                        'ktvjyxtu1':'53241d39cdbe59b32938f5bf26bf2a4c',
                        "буратина":"c17d593563379b4b2f71ed3dd7a5761e",
                        "кот-ясун":"fd5da7d58b424616c630a9988d8c5891",
                        'говорящая жопа':'0ae6fb5e1809f3d6668eb407317174c2',
                        'клон говорящей жопы':'84d64dded541c9a0efb6ed43e2f6c385',
                        'домкрат':'10eff6bfc505d2029fa3a41a2f77af82',
                        'домкрат1':'e51694c56e9e8e838bea7d487cc4ffde',
                        'кот в красный шапке':'8544ae3a5c4c2eb182e37620c7c172d2',
                        'балерина':'d683b06ae240a01a96a6d1c6380b6380',
                        'балерина_с_аватарой':'bc31a42e6cbd5edd9f84d16910834608',
                        'говорящаяЖопа':'77a9857c551f3833629d76eda9abbddf',
                        'говорящаяЖопа1':'64b9ca2620223b69a59d693e14ff9a6c',
                        'говорящаяЖопа2':'52a00d358caac10ed6a84cba4cca1ece',
                        'говорящаяЖопа3':'2e95cc470c34b15c34be6e3937dbeffd',
                        'ссзб':'070f9f24ae9cb278a6a0d40642baa578',
                        'горизонтало':'082884e2a2b4cf7589cf34a5ae8ba487',
                        'ссзб1':'6c098185791771768be9611e003db5a0',
                        'стас':'36d81b3e32faaf34948f614f79e55f42',
                        'пмснутая бабища':'d50fa15f9f72795f13ccfd737392124e',
                        'самозванец':'59e6e94cd561d9c6f22816f7fa107c8c',
                        'любитель пива':'a20c680ab6fd0b5be0eac5785c23ef2e'
                    };
    var assHoles = {
                        "кот-задрот":"9a306d3d1115732eed4b3f36f2439ba3",
                        'дартаньян':'12efd6dfc31121404b537eb3820abf78',
                        'ябатька':'b9b0e2efa788a33edf120e8b0d71c908',
                        'котомок-перевертыш':'332af44d6a034da310bba8330af82551',
                        'котомок-перевертыш':'95aa6ccd8be4f4bd64acf664750e185b',
                        'котомок':"84db4eb341dd4aa7e7fc9baa14b1d917"
                    };
    var rats = ['котомок-перевертыш', 'котомок'];
    var flooders_arr = $.map(flooders, function(el, o) {return {name: o, value: el};});
    var assHoles_arr = $.map(assHoles, function(el, o) {return {name: o, value: el};});
    var avatars = $('div.comment-user-left').find('img');
    $.each(avatars, function (i, e){
        var src = $(e).attr('src');
        var assHole_find = $.grep(assHoles_arr, function (k){ return src.indexOf(k.value)!=-1;});
        var comment_div = $(e).parents('.comment-user').find('.comment-user-right');
        var comment_div_top = comment_div.find('.comment-user-right-top');
        var a = comment_div_top.find('a');
        if (assHole_find.length > 0){
            comment_div.find('.comment-links').html('');
            comment_div.attr('data-show', false);
            var assHole_name = assHole_find[0].name;
            if (rats.indexOf(assHole_name) > -1) {
                $(e).attr('src', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAIAAAC1nk4lAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAG8SURBVGhD7ZbRkYQwCECty4Ksx2psxmI8IMSAIeZyM+HGGd7PESDk6bnuLtcHCWkvQtqLr0qf+7psR1oe27LuJ4WYZrAqlgS1PXoIGMFVhDr0KpH7MWWc/oqSFgPw6DqkhYzrHpyxAulwWAFcavY/ox5SWg8t1yynQUGERg9lD3Cl0rGt+85b7H7r9B4srf9lShMQx0HIhUZPaoAirtD55Eqj3zi9i7zTGNAgpan1klMO6x7xF+8x21KfPVMFpf6K/iDCXA5LJENayLjqgSCdjJmUu+db/fbpHbT0c0RCXj9kxdy6p9SLAkRcrvtbp78C0t8jpL0IaS9C2ovZ0uW93Y6HmX6nZ1jPfzwmWJM0fn0m8piSEZO7bWJJ0Hc1JmW/FQ8C0nDJeTf9lHxkcvjapgwgf8cALO9fGq14jMXYqzJZ55dtCBSkdOv2qgsdwpB+DOO6Ka3Jm/5DWmfy6E6bxEEaz8ib//xMKyAv07C8L64Vj9F4e6BPQsyt20oGuEW1dOvmyniQ776nZzLBebr0DGeHx2MCIe1FSHsR0l6EtBch7UVIexHSXoS0FyHtRUh7EdJehLQXIe3Ddf0AiDg853r55JcAAAAASUVORK5CYII=");
            }
            var alt_text = 'Здесь был высер мудака по имени ' + assHole_name;
            comment_div.attr('data-alt-text', alt_text);
            comment_div_top.text(alt_text);
            var comment_div_text = comment_div.find('.comment-text');
            comment_div.attr('data-old-text', comment_div_text.html());
            comment_div_text.html('');
            comment_div_top.on('dblclick', function(){
                var $parent = $(this).parent();
                var $comment = $(this).siblings('.comment-text');
                if ($parent.attr('data-show')==='false') {
                    $comment.html($(this).parent().attr('data-old-text'));
                    $parent.attr('data-show', true);
                }else {
                    $comment.html('');
                    $parent.attr('data-show', false);
                }
            });
        }
        var flooder_find = $.grep(flooders_arr, function (k){ return src.indexOf(k.value)!=-1;});
        if (flooder_find.length > 0){
            $(e).parents('.comment-user').css('display', 'none');
        }
    });
})();