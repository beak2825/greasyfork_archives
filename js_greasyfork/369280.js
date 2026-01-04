// ==UserScript==
// @name         Wanikani Example Sentence Scrambler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Grammar Practice with Vocabulary Sentences
// @author       BxBerto
// @match        https://www.wanikani.com/dashboard
// @match        https://www.wanikani.com/
// @grant        none
// @resource
// @resource
// @require http://code.jquery.com/jquery-latest.js
// @require
// @downloadURL https://update.greasyfork.org/scripts/369280/Wanikani%20Example%20Sentence%20Scrambler.user.js
// @updateURL https://update.greasyfork.org/scripts/369280/Wanikani%20Example%20Sentence%20Scrambler.meta.js
// ==/UserScript==

var sentences = [
[["彼の鼻の穴は","怒気を","含んで","膨らんでいる"],["His nostrils swelled with anger."]],
[["この宗派には、","会議で","議長を","務めるための規則があります"],["There are some rules for acting as chairman of meetings in this religious sect."]],
[["これは","大人の料金です"],["This is the adult price."]],
[["大人たちは","居酒屋に","行った"],["The adults went to an Izakaya."]],
[["2chの野球板に","書き込みを","した","んですが、","板違いだ","と言われてしまいました"],["I posted some comments on a forum about baseball on 2chan but I was told it was the wrong board."]],
[["恐ろしい","と思うかもしれないが、","自然の法則には","逆らえない","んだよ"],["You may feel scared, but you can’t defy the laws of nature."]],
[["肺癌の治療に","最も","良く","効く薬を","探しています"],["I’m looking for the most effective medicine for treating lung cancer."]],
[["眼鏡屋さんで、","とても頑丈な眼鏡を","作ってもらいました"],["I had a really sturdy pair of glasses made by my optician."]],
[["この部屋は","冷蔵庫、洗濯機付きです"],["This room is furnished with a refrigerator and a washing machine."]],
[["この風習は","日韓両国で","よく見られます"],["This custom is frequently seen in both Japan and Korea."]],
[["さっき","飲んだ睡眠薬のせいで、","手足が","思うように","動かない","んだけど"],["I’m so uncoordinated right now because of the sleeping pill I took."]],
[["三時になったら","おやつ休憩にしましょう"],["When it’s three o’clock let’s have our afternoon snack break."]],
[["学校の帰りに、","図書館に","寄るつもりです"],["When I come home from school I plan on dropping by the library."]],
[["迷惑メールが","次から次へと","送られてくる"],["The spam mail was sent out one after the other."]],
[["奇数とは","2で","割り切れない数字のことです"],["Odd numbers are numbers that cannot be divided by two."]],
[["あなたにとっては","ただの規模の小さな会社かもしれませんが、","私は","両親の会社に","誇りを","もっています"],["It may be just a small scale firm to you, but I’m proud of my parents’ company."]],
[["私の猫は","おそらく","夕飯時頃に","現れるでしょう"],["My cat will probably appear around mealtime."]],
[["もし","ここに","コウイチがいたら、","こんな数学の問題","五秒で","解けちゃうよ"],["If Koichi were here, he would be able to solve this math problem in five seconds."]],
[["父さんに","ガレージの体積を","測る","ように言われた","んだけど、","理由は","知らないよ"],["My dad told me to measure the volume of our garage, but I don’t know why."]],
[["黒板が","使えないので、","ホワイトボードを","持参しています"],["We can’t use the blackboard so I’ll bring in a whiteboard."]],
[["電車に","乗り遅れて、","会社の創立記念のイベントに","遅れそうだ"],["I’ve missed my train and I’m running late for my company’s anniversary event."]],
[["警察は","捜索活動を","続けています"],["The police are continuing to work on the investigation."]],
[["理屈ばっかり","こねて、","本当に","嫌味な人ね"],["The only reason you argue is because you’re really a disagreeable person."]],
[["請求書の金額が","間違っている","ように思うので","私は","その請求を","取り消す"],["I’m going to cancel that bill because I think we were invoiced for the wrong amount."]],
[["先生は,","診察の予定が","みっちり","詰まっています"],["The doctor has a jam-packed medical exam schedule."]],
[["サラ金から、","借金の返済を","求める催告状が","何度も何度も","届いています"],["A consumer credit company has been sending me notification letters over and over, demanding that I pay back my debt."]],
[["ひさびさに","タバコ吸ったら、","強烈なヤニ","くらくらっちまったよ"],["If I smoke for the first time in a while, I get an intense tobacco high."]],
[["もし","あのラーメン工場に","訪れたいのであれば、","できるだけ","早くに","予約を","入れる方がいいですよ"],["If you want to visit the ramen factory you should make your reservations as far in advance as possible."]],
[["昨日","病気で","欠席したため、","今日は","授業の遅れを","取り戻すために","忙しい"],["Yesterday I was absent because I was sick, so today I’m busy trying to catch up with the lesson I missed."]],
[["どうすれば","顧客に","未払分の支払手続きを","丁寧かつ強く","催促することができるのでしょうか。"],["How can I press a customer to take action on his overdue payment politely but also strongly?"]],
[["今から","２５年後には、","就業者２人につき","退職者１人の割合","になるだろう"],["Twenty-five years from now there will be one retired person for each two working."]],
[["染毛剤は","髪の毛を","傷める"],["Hair dye damages your hair."]],
[["私は","甘党で、","ケーキには","目がないの"],["I have a sweet tooth and I’m extremely fond of cake."]],
[["もし","娘さんとの結婚を","許可してくださるのなら、","あなたに","我が","社の登録商標の使用を","許諾します"],["If you allow me to marry your daughter, I’ll give you my consent to use our company’s trademark."]],
[["Tofugu思想を","普及するための","歌を","作曲しました"],["I made a song to spread Tofugu-ism."]],
[["父の遺産を","巡る家族間の","争いが","起きてる","んです"],["We’re going through a family conflict over my father’s inheritance."]],
[["歌舞伎の","チケットが","見当たらない","んだけど"],["My kabuki ticket is missing."]],
[["鹿児島県で、","今までで","運転した中で","一番デッコボコの","道路を","ドライブしました"],["I drove on the most bumpy road I’ve ever driven on in Kagoshima prefecture."]],
[["口紅を","ポケットに","入れっぱなしにしてた","みたいで、","乾燥機の中で","溶けちゃった","のよね"],["I left my lipstick in my pocket and it melted in the dryer."]],
[["ようやく","誤りに","気がついた"],["I finally noticed my mistakes."]],
[["ビールで","いい気分になった","んだけど、","その後","吐き気が","ひどくてさ"],["The beer made me feel great, but after I got awful nausea."]],
[["彼女が","あの盟約書に","サインをした","なんて","信じられないよ"],["I can’t believe that she signed that treaty."]],
[["放射能に","関する会議を","招集する前に、","出席者を","決める方がいい","だろう"],["Before calling the meeting about the radioactivity, we should decide who should attend."]],
[["彼は","信頼できるような気がするし、","早合点は","したくないね"],["I don’t wanna jump to conclusions because he seems to be pretty trustworthy."]],
[["依頼は","断られちゃう","かもしれないけど、","聞くだけ","聞いてみたら"],["Your request may be turned down, but it never hurts to ask."]],
[["依然","父の","消息は","不明です"],["I still have no news about my father."]],
[["彼の","奥さんだ","と思っていた女性が","実は","スパイでね、","電車から","飛び降りた","んだよ"],["The woman I thought was his wife was actually a spy and jumped off the train."]],
[["シャツを","入れないと、","お客さんに","甘く見られるかもしれないよ"],["Tuck in your shirt or your client may not take you seriously."]],
[["どうして","彼女の","英語力が","グングン","伸びてるのか","知ってる"],["Do you know why her English skills are rapidly improving?"]],
[["父は、","私達の","結婚を","二つ返事で","承諾した"],["My father agreed to our marriage without hesitation."]],
[["自分が","携帯依存症だ","ってことは","認めます"],["I admit that I’ve become dependent on my cell phone."]],
[["どちらの","主将も","そんなに","強くはなかった"],["Both of the team captains weren’t very strong."]],
[["意外にも、","彼は","集会に","現れた"],["Surprisingly, he showed up to the assembly."]],
[["日本では、","遺伝子組み換え食品には","パッケージへの","表示が","義務づけられています"],["In Japan you are obligated to display whether foods are genetically modified on the package."]],
[["コウイチは","アメリカ合衆国の","大統領になることを","渋々","受諾した"],["Koichi reluctantly agreed to become the president of the United States."]],
[["彼は","学生並から","言えば","勤勉です"],["For a student, he is dillegent."]],
[["彼は","政治家並から","言うと、","演説がうまい"],["For a politician, he is a good speaker."]],
[["ビエトが","ヤクザだ","という嫌疑が","ぬぐえません"],["Our suspicion that Viet is a yakuza cannot be wiped away."]],
[["トーフグは","ユニークさにおいて、","他の日本語学習教材より","優れています"],["Tofugu surpasses the other Japanese learning materials in terms of uniqueness."]],
[["屈むと","腰が","痛い","んです"],["I get a pain in my lower back when I bend down."]],
[["彼女は、","バイク事故で","投げ飛ばされる飛距離の","世界記録を","樹立した"],["She set the world record for the person thrown farthest by a motorcycle accident."]],
[["彼は、","上司が","顧客の","クレーム処理を","しないことについて","ぶつぶつ","文句を言っている"],["He complains that his boss doesn’t deal with clients’ complaints."]],
[["俺にも","お前みたいな潔い心が","あればいい","んだがな"],["Wish I had a pure heart like yours."]],
[["俺は","その宴で、","ドイツ語訛りの","英語を","話すとても美しい女性に","出会った","んだ"],["I met a beautiful woman who speaks English with a German accent at the dinner party."]],
[["この薬で","船酔いを","克服しました"],["I got over my seasickness with this medicine."]],
[["このクーポンの","使用の","仕方が","分かりません"],["Can you tell me how to use this coupon?"]],
[["これは","ただの","静止画像なのに、","びみょうに","動いて","見える不思ぎな絵です"],["This is just a still frame, but it looks like it's moving a little. What an interesting picture."]],
[["ワニカニに","新しい単語が","続々と","登場する日が","待ち遠しい"],["I can’t wait for the day when new words pop up one after another on WaniKani."]],
[["パソコンの","動作を","速く","するのに","役立つアプリケーションを","無料で","差し上げます"],["I’ll give you this application that helps make your computer run faster for free."]],
[["酒を","絶つことが","約束できますか"],["Can you promise me you’ll abstain from alcohol?"]],
[["後で","ネットで","検索してみるよ"],["I’ll look it up on the internet later."]],
[["まずは","事件の","大略を","説明して","くれない","か"],["Can you explain the outline of the incident first?"]],
[["TofuguTVの","撮影現場を","観覧しました"],["I watched the TofuguTV shooting."]],
];

var num = "";
var questionArray = [];
var answerArray = [];

(function() {

//adds my own area
$('#search').after('<div id="myDiv"></div>');

//this section is for changing the page's CSS.

    function shuffle(array)
    {
        var temp = "";
        var newArray = [];

        for(var j = 0; j < array.length; j++)
        {
            array[j] = (j+1)+array[j];
            newArray[j] = array[j];

        }

        for (var i = array.length-1; i >= 0; i--)
        {
            var ran = Math.floor(Math.random() * (i+1));

            temp = newArray[ran];
            newArray[ran] = newArray[i];
            newArray[i] = temp;
        }

        return newArray;
    }

    function addGlobalStyle(css)
    {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(
        '#myDiv { background-color: lightgrey !important;}'
    );

    addGlobalStyle(
        '#answer { visibility: hidden;}'
    );

    addGlobalStyle(
        '#message_area { background-color: yellow !important; text-align: center !important; font-size: 30px !important; padding: 10px !important;}'
    );

    addGlobalStyle(
        '#table_area { background-color: yellow !important; text-align: center !important; font-size: 30px !important; padding: 10px !important;}'
    );

    addGlobalStyle(
        '#puzzle_table { padding: 5px !important; border-collapse: separate !important; border-spacing: 3px !important;}'
    );

    addGlobalStyle(
        '#puzzle_table td { font-size: 25px !important; width: 60px !important; height: 60px !important;}'
    );

    addGlobalStyle(
        '.kanji_box { background-color: yellow !important; border: 3px solid black !important; text-align: center !important;}'
    );

    addGlobalStyle(
        '.answer_box { background-color: yellow !important; border: 3px solid black !important; text-align: center !important;}'
    );

    addGlobalStyle(
        '#button_area { background-color: yellow !important; text-align: center !important; font-size: 30px !important; padding: 10px !important;}'
    );

    addGlobalStyle(
        '[draggable] { -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; user-select: none; -khtml-user-drag: element; -webkit-user-drag: element; }'
    );

    addGlobalStyle( '.column { height: 60px; float: left; border: 2px solid #666666; background-color: #ccc; -webkit-border-radius: 10px; -ms-border-radius: 10px; -moz-border-radius: 10px; border-radius: 10px; -webkit-box-shadow: inset 0 0 3px #000; -ms-box-shadow: inset 0 0 3px #000; box-shadow: inset 0 0 3px #000; text-align: center; cursor: move; font-size: 20px; color: red; margin: 10px; }'
    );

    addGlobalStyle( '.column.over { border: 2px dashed #000; }'
    );

    addGlobalStyle( '.column header { text-shadow: #000 0 1px;v box-shadow: 5px; padding: 5px; background: -moz-linear-gradient(left center, rgb(0,0,0), rgb(79,79,79), rgb(21,21,21)); background: -webkit-gradient(linear, left top, right top, color-stop(0, rgb(0,0,0)), color-stop(0.50, rgb(79,79,79)), color-stop(1, rgb(21,21,21))); background: -webkit-linear-gradient(left center, rgb(0,0,0), rgb(79,79,79), rgb(21,21,21)); background: -ms-linear-gradient(left center, rgb(0,0,0), rgb(79,79,79), rgb(21,21,21)); border-bottom: 1px solid #ddd; -webkit-border-top-left-radius: 10px; -moz-border-radius-topleft: 10px; -ms-border-radius-topleft: 10px; border-top-left-radius: 10px; -webkit-border-top-right-radius: 10px; -ms-border-top-right-radius: 10px; -moz-border-radius-topright: 10px; border-top-right-radius: 10px; font-size: 15px; }'
    );

    addGlobalStyle( 'span.num { visibility: hidden; color: white; }'
    );

    //JQuery functions

    //adds 3 necessary div sections
    $('#myDiv').append('<div id="button_area"></div><div id="message_area" align="center"></div><div id="table_area"></div>');

    //adds the 2 buttons
    $('#button_area').append('<button id="add">Load Sentence</button><br><br><button id="answer">Check Answer</button>');

    //click functions
    $('#add').click(function()
    {
        document.getElementById("message_area").innerHTML = "";
        document.getElementById("table_area").innerHTML = "";
        document.getElementById("answer").style.visibility = "visible";
        var length = sentences.length;
        var ran = Math.floor(Math.random() * length);

        var table = "";
        var shuffledArray = shuffle(sentences[ran][0]);
        document.getElementById("message_area").innerHTML += sentences[ran][1];

        var area = "";
        area += '<table id="table1" align="center"><tr><td>';

        for(var j = 0; j < sentences[ran][0].length; j++)
        {
            area += '<div class="column" draggable="true"><header><span class="num">';
            area += shuffledArray[j].charAt(0);
            area += '</span></header>';
            area += shuffledArray[j].slice(1);
            area += '</div>';
        }
        area += '</td></tr></table>';
        document.getElementById("table_area").innerHTML += area;

        var cols = document.querySelectorAll('.column');

            [].forEach.call(cols, function(col)
            {
                col.addEventListener('dragstart', handleDragStart, false);
                col.addEventListener('dragenter', handleDragEnter, false);
                col.addEventListener('dragover', handleDragOver, false);
                col.addEventListener('dragleave', handleDragLeave, false);
                col.addEventListener('drop', handleDrop, false);
                col.addEventListener('dragend', handleDragEnd, false);
            });

        function handleDragOver(e)
            {
                if (e.preventDefault)
                {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

                return false;
            }

        function handleDragEnter(e)
            {
                // this / e.target is the current hover target.
                this.classList.add('over');
            }

            function handleDragLeave(e)
            {
                this.classList.remove('over');  // this / e.target is previous target element.
            }

            function handleDragEnd(e) {
                // this/e.target is the source node.

                [].forEach.call(cols, function (col)
                {
                    col.classList.remove('over');
                });

                this.style.opacity = 1;
            }

            var dragSrcEl = null;

            function handleDragStart(e)
            {
                // Target (this) element is the source node.
                this.style.opacity = '0.4';

                dragSrcEl = this;

                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', this.innerHTML);
            }

            function handleDrop(e)
            {
                // this/e.target is current target element.

                if (e.stopPropagation)
                {
                    e.stopPropagation(); // Stops some browsers from redirecting.
                }

                // Don't do anything if dropping the same column we're dragging.
                if (dragSrcEl != this)
                {
                    // Set the source column's HTML to the HTML of the column we dropped on.
                    dragSrcEl.innerHTML = this.innerHTML;
                    this.innerHTML = e.dataTransfer.getData('text/html');
                }

                return false;
            }

    });

    $('#answer').click(function()
    {
        $(this).css('visibility','hidden');
        var boxes = document.getElementsByClassName("num");

            [].forEach.call(boxes, function(san)
            {
                san.style.visibility = "visible";
            });
    });
})();