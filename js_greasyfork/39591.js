// ==UserScript==
// @name         Alegion script
// @namespace    https://greasyfork.org/users/144229
// @version      1.1
// @description  Makes Money
// @author       MasterNyborg and ZileWrath and Lefty
// @icon         https://i.ytimg.com/vi/XWBgcK2lR7s/maxresdefault.jpg
// @include      *alegion*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/39591/Alegion%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39591/Alegion%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('h1').toggle();
    $('b').toggle().eq(0);
    $('p').toggle().eq(0);
    $('textarea').toggle();
    $('div').eq(2).toggle();
    var b1 = '<button type="button" id="b1">food</button>';
    var b2 = '<button type="button" id="b2">nature</button>';
    var b3 = '<button type="button" id="b3">explore</button>';
    var b4 = '<button type="button" id="b4">happy</button>';
    var b5 = '<button type="button" id="b5">friend</button>';
    var b6 = '<button type="button" id="b6">sad</button>';
    var b7 = '<button type="button" id="b7">lust</button>';
    var b8 = '<button type="button" id="b8">move</button>';
    var b9 = '<button type="button" id="b9">male</button>';
    var b0 = '<button type="button" id="b0">female</button>';
    var b11 = '<button type="button" id="b11">community</button>';
    var b12 = '<button type="button" id="b12">city</button>';
    var b13 = '<button type="button" id="b13">room</button>';
    var b14 = '<button type="button" id="b14">vacay</button>';
    var b15 = '<button type="button" id="b15">art</button>';
  	var b16 = '<button type="button" id="b16">drink</button>';
  	var b17 = '<button type="button" id="b17">fashion</button>';
    var b18 = '<button type="button" id="b18">baby</button>';

    var food = ["tasty", "preparation", "nutrition", "sustenance",
                "yummy", "creation", "cooked", 'cuisine', 'fare', 'meal',
                'aliment', 'edible', 'home-made', 'prepared', 'appetizing', 'delectable',
                'enticing', 'fresh', 'tempting', 'gratifying', 'mouth-watering', 'palatable',
                'scrumptious', 'tasteful', 'delicious'];

  	var drink = ['drinkable', 'cool', 'potable', 'brew', 'mix', 'tasty',
                 'prepare', 'nutrition', 'yummy', 'refreshing', 'cooling',
                 'restoring', 'thirst-quenching', 'hydrating', 'delicious',
                 'sweet', 'tasty', 'gratifying', 'satisfying', 'fresh'];

    var nature = ['beauty', 'natural', 'nature', 'wonder', 'awe',
                  'discovery', 'adventure', 'knowledge', 'beautiful', 'scenic',
                  'breathtaking', 'pure', 'outdoor', 'refreshing', 'vibrant',
                  'organic', 'balance', 'fresh', 'majestic', 'mother nature', 'origins', 'perfection', 'tranquility'];

    var explore = ['exploration', 'knowledge', 'adventure', 'experience', 'endure',
                   'focus', 'awe', 'create', 'passionate', 'move', 'search', 'tour',
                   'travel', 'traverse', 'explore'];

    var happy = ['joy', 'laughter', 'happiness', 'well being', 'company',
                 'excitement', 'fun', 'good time', 'merry', 'playful',
                 'gleeful', 'blithe', 'elated', 'jubilant', 'glad'];

    var friend = ['friendship', 'togetherness', 'compatriots', 'best friends forever', 'company',
                  'gang', 'group', 'together', 'ally', 'partner', 'chums', 'cohorts', 'colleagues',
                  'pals', 'companions'];

    var sad = ['alone', 'empty', 'rejected', 'blank', 'outcast', 'bitter',
               'dismal', 'melancholy', 'somber', 'secluded', 'estranged',
               'lone', 'desolate', 'down', 'dejected', 'sad', 'blue',
               'down in the dumps', 'despair', 'upset' ];

    var lust = ['lustful', 'wanting', 'desire', 'beckoning', 'love', 'crave',
                'lust', 'grace', 'demanding', 'beauty', 'passion', 'ardor',
                'frenzy', 'urge', 'covet', 'need', 'demand', 'sexy',
                'longing', 'eroticism', 'craving', 'sensuality', 'sensual', 'scantily clad', 'exposed'];

    var move = ['move', 'health', 'fitness', 'enjoy', 'healthy',
                'lively', 'endure', 'focus', 'vigor', 'vitality',
                'agility', 'well-being', 'harmony', 'wellness', 'movement'];

    var male = ['loyal', 'wanting', 'desire', 'beckoning', 'independent',
                'strong', 'dapper', 'respect', 'admire', 'focus', 'classy',
                'well dressed', 'handsome', 'powerful', 'athletic', 'dashing',
                'genuine', 'determined', 'driven', 'respectable', 'influential',
                'able', 'ambitious', 'robust'];

    var female = ['beauty', 'grace', 'natural', 'free', 'cute', 'adorable','sweet','nice',
                  'independant','class','showing off', 'feminine',
                  'gentle', 'enjoy', 'attraction','elegance','charm', 'allure',
                  'elegance', 'refinement', 'attraction', 'lovely'];

	var fashion = ['fashion', 'style', 'image', 'presentation', 'couture',
                   'exposure', 'pose', 'model', 'glamour', 'chic',
                   'appearance', 'vogue', 'form', 'appearance', 'figure'];

    var com = ['community', 'culture', 'family', 'come together', 'whole',
               'cohesive', 'together', 'society', 'inclusive', 'integral',
               'gathering', 'association', 'company', 'public'];

    var city = ['build', 'expanse', 'structure', 'urban', 'conglomerate',
                'sprawl', 'public', 'dimension', 'dynamic', 'scale', 'contemporary',
                'aesthetic', 'exclusive'];

    var vacay = ['fun', 'adventure', 'time off', 'relax', 'have fun',
                 'rest', 'recharge', 'get away', 'free', 'respite',
                 'break', 'holiday', 'unwind', 'repose', 'refresh', 'renergize', 'rejuvenate'];

    var art = ['absorbing', 'gorgeous', 'provoking', 'personal',
               'remarkable', 'symbolic', 'daring', 'creative', 'art', 'artistic',
                'creativity', 'multicolored', 'dimensional', 'vibrant', 'beautiful',
               'ambiguous', 'aesthetic',  'evocative',  'dramatic', 'bold',
               'expressive',  'appealing', 'visual', 'original',  'dynamic', 'distinctive'];

    var room = ['clean', 'organized', 'presentable', 'home', 'room', 'space',
                'tidy', 'neat', 'spotless', 'orderly','ambiance', 'atmosphere',
                'area', 'place', 'setting', 'surroundings', 'ambiance', 'scene',
                'space', 'dwelling'];
    var baby = ['young', 'nourish', 'grow', 'awakening', 'pure', 'quiet', 'nice',
                'tranquil', 'natural', 'warmth', 'beginning', 'rest', 'bonding',
               'developing', 'adore', 'mother', 'caretake', 'adventure', 'exhausted',
               'joy', 'happiness', 'well being', 'playful',
                 'gleeful', 'jubilant', 'glad', 'Innocence', 'youth', 'purity', 'fragile', 'small', 'life'];

    var box = `<input type="text" style="width:25em;" id="box"}></input>`;

    $('input').eq(1).after(box).after(b18).after(b17).after(b16).after(b15).after(b14).after(b13).after(b12).after(b11).after(b0).after(b9).after(b8).after(b7).after(b6).after(b5).after(b4).after(b3).after(b2).after(b1);

    $('#b1').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = food[Math.floor(Math.random()*food.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = food[Math.floor(Math.random()*food.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
    $('#b2').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = nature[Math.floor(Math.random()*nature.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = nature[Math.floor(Math.random()*nature.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
    $('#b3').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = explore[Math.floor(Math.random()*explore.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = explore[Math.floor(Math.random()*explore.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
     $('#b4').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = happy[Math.floor(Math.random()*happy.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = happy[Math.floor(Math.random()*happy.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
     $('#b5').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = friend[Math.floor(Math.random()*friend.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = friend[Math.floor(Math.random()*friend.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
     $('#b6').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = sad[Math.floor(Math.random()*sad.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = sad[Math.floor(Math.random()*sad.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
     $('#b7').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = lust[Math.floor(Math.random()*lust.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = lust[Math.floor(Math.random()*lust.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
     $('#b8').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = move[Math.floor(Math.random()*move.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = move[Math.floor(Math.random()*move.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
     $('#b9').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = male[Math.floor(Math.random()*male.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = male[Math.floor(Math.random()*male.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
     $('#b0').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = female[Math.floor(Math.random()*female.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = female[Math.floor(Math.random()*female.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
    $('#b11').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = com[Math.floor(Math.random()*com.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = com[Math.floor(Math.random()*com.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
    $('#b12').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = city[Math.floor(Math.random()*city.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = city[Math.floor(Math.random()*city.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
    $('#b13').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = room[Math.floor(Math.random()*room.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = room[Math.floor(Math.random()*room.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
    $('#b14').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = vacay[Math.floor(Math.random()*vacay.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = vacay[Math.floor(Math.random()*vacay.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
    $('#b15').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = art[Math.floor(Math.random()*art.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = art[Math.floor(Math.random()*art.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
  $('#b16').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = drink[Math.floor(Math.random()*drink.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = drink[Math.floor(Math.random()*drink.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
    $('#b17').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = fashion[Math.floor(Math.random()*fashion.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = fashion[Math.floor(Math.random()*fashion.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
    $('#b18').click(function(){
        console.log('clicked');
        var list = ["","","",""];
        for(i=0;i<4;i++){
            var dis = baby[Math.floor(Math.random()*baby.length)];
            while (dis == list[0] || dis == list[1] || dis == list[2] || dis == list[3]){
                dis = baby[Math.floor(Math.random()*baby.length)];
            }
            list[i] = dis;
        }
        $('#box').val(list[0]+", "+list[1]+", "+list[2]+", "+list[3]);
        $('#box').select();
        var copy = document.execCommand('copy');
        $('input[type=text]').eq(0).select();
    });
});

document.addEventListener("paste", function (event) {
            $("#tasksubmit").click();
        }
    );