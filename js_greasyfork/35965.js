// ==UserScript==
// @name Post songs on epicmafia.com
// @version			1.00
// @description		Post songs on epicmafia.com hello
// @namespace Violentmonkey Scripts
// @match        https://epicmafia.com/game/*
// @exclude      https://epicmafia.com/game/new
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/35965/Post%20songs%20on%20epicmafiacom.user.js
// @updateURL https://update.greasyfork.org/scripts/35965/Post%20songs%20on%20epicmafiacom.meta.js
// ==/UserScript==

_oVersionOfVision = [[], []];
_oCurrentVersionOfVision = 0;
//$('#alive').children().eq(0).append('<button id="_oFlipVersionOfVision">Flip</button>');
$('#alive > li').eq(0).click((e) => {
  $players = $('#alive > .user_li > div.roleimg');
	saveCurrentRoleVision($players);
  _oCurrentVersionOfVision = _oCurrentVersionOfVision === 0 ? 1 :0;
	loadSelectedRoleVision($players);
});

function saveCurrentRoleVision() {
  _oVersionOfVision[_oCurrentVersionOfVision] = $players.map((_, e) => e.getAttribute('class'));
}

function loadSelectedRoleVision() {
  let id = _oVersionOfVision[_oCurrentVersionOfVision].length ?
      _oCurrentVersionOfVision :
      _oCurrentVersionOfVision === 0 ? 1 :0;
  $players.each((i, e) => e.setAttribute('class', _oVersionOfVision[id][i]));
}
//$('#_oFlipVersionOfVision')[0].click();
/*function cloneAndAddAfter($elements) {
  let $cloned = $elements.clone();
  $elements.each((i, e) => $(e).after($cloned.eq(i)));
}
cloneAndAddAfter($('.user_li > div.roleimg'));
*/

generalObject = {
  __intervalId: undefined,
  __isPause: false,
  __intervalTime: 2001,
  __stop: function () {
    clearInterval(this.__intervalId);
  },
  __pause: function () {
    this.__isPause = true;
  },
  __resume: function () {
    this.__isPause = false;
  },
};

repeateGeneral = Object.create(generalObject);
repeateGeneral.s = function () {
  this.__stop();
};
repeateGeneral.p = function () {
  this.__pause();
};
repeateGeneral.r = function () {
  this.__resume();
};
repeateGeneral.setIntervalTime = function (newIntervalTime) {
  this.__intervalTime = newIntervalTime;
};
repeateGeneral.e = function () {
  this.__repeate('@everyone')
};
repeateGeneral.__repeate = function (text) {
  clearInterval(this.__intervalId);
  this.__intervalId = setInterval(() => {
    if (this.__isPause) {
      return;
    }
    if ($('#typebox').val() !== '') {
      return;
    }
    $('#typebox').val(text);
    $('#speak_button')[0].click();
  }, this.__intervalTime);
};

songCommands = Object.create(generalObject);
songCommands.s = function () {
  this.__stop();
};
songCommands.p = function () {
  this.__pause();
};
songCommands.r = function () {
  this.__resume();
};
songCommands.setIntervalTime = function (newIntervalTime) {
  this.__intervalTime = newIntervalTime;
};
songCommands.__singIt = function (text) {
  text = text.replace(/^\[.*\]$\n/gm, '').replace(/\n\n\n/g, '\n').split('\n');
  //.replace(/\n\n/g, '\n')
  text.unshift('/me #');
  text.push('/me #');
  var curr = 0, textLen = text.length + 2;
  this.__intervalId = setInterval(() => {
    if (this.__isPause) return;
    if ($('#typebox').val() !== '') {
      return;
    }
    let currLine = text[curr] === '' ? '/me .' : text[curr];
    $('#typebox').val(currLine);
    $('#speak_button')[0].click();
    curr++;
    if (curr === textLen) clearInterval(this.__intervalId);
  }, this.__intervalTime);
};

songs = {};

//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
//songs. = function () { songCommands.__singIt(``); };
songs.atteroDominatus = function () { songCommands.__singIt(`Attero!
Dominatus!
Berlin is burning
Denique!
Interimo!
The reich has fallen

We stand at the gates of Berlin
With two and a half million men
With six thousand tanks in our ranks
Use them as battering rams

Artillery leading our way
A million grenades has been launched
The nazis must pay for their crimes
The wings of the eagle has been broken

Marshall Zhukov's orders:
Serve me Berlin on a plate!
Disregard the losses
The city is ours to take

Attero!
Dominatus!
Berlin is burning
Denique!
Interimo!
The reich has fallen

The price of a war must be payed
Millions of lives has been lost
The price must be paid by the men
That started the war in the 30's

The spring of the year 45'
The year when the nazis will fall
We're inside the gates of Berlin
The beak of the eagle is broken

Comrade Stalins orders:
Serve me it's head on a plate
Disregard the losses
The eagle's land is ours to take

Attero!
Dominatus!
Berlin is burning
Denique!
Interimo!
The reich has fallen

March!
Fight!
Die!
In Berlin!
March!
Fight!
Conquer!
Berlin!`); };
songs.mamaWeAllGoToHell = function () { songCommands.__singIt(`Mama, we all go to hell
Mama, we all go to hell
I'm writing this letter and wishing you well
Mama, we all go to hell
Oh, well, now
Mama, we're all gonna die
Mama, we're all gonna die
Stop asking me questions, I'd hate to see you cry
Mama, we're all gonna die
And when we go don't blame us, yeah
We'll let the fires just bathe us, yeah
You made us oh, so famous
We'll never let you go
And when you go, don't return to me, my love
Mama, we're all full of lies
Mama, we're meant for the flies
And right now they're building a coffin your size
Mama, we're all full of lies
Well, mother, what the war did to my legs and to my tongue
You should've raised a baby girl
I should've been a better son
If you could coddle the infection
They can amputate it once
You should've been
I could have been a better son
And when we go don't blame us, yeah
We'll let the fires just bathe us, yeah
You made us oh, so famous
We'll never let you go
She said: "You ain't no son of mine
For what you've done they're gonna find
A place for you
And just you mind your manners when you go
And when you go, don't return to me, my love"
That's right
Mama, we all go to hell
Mama, we all go to hell
It's really quite pleasant
Except for the smell
Mama, we all go to hell
Two - Three - Four
Mama! Mama! Mama! Oh!
Mama! Mama! Mama! Ma...
And if you would call me a sweetheart
I'd maybe then sing you a song
But there's shit that I've done with this fuck of a gun
You would cry out your eyes all along
We're damned after all
Through fortune and fame we fall
And if you can stay, then I'll show you the way
To return from the ashes you call
We all carry on
When our brothers in arms are gone
So raise your glass high
For tomorrow we die
And return from the ashes you call`); };
songs.мояОборона = function () { songCommands.__singIt(`Пластмассовый мир победил
Макет оказался сильней
Последний кораблик остыл
Последний фонарик устал,
         а в горле сопят комья воспоминаний

         Оо- моя оборона
         Солнечный зайчик стеклянного глаза
         Оо- моя оборона
         Траурный мячик нелепого мира
         Траурный мячик дешёвого мира

Пластмассовый мир победил.
Ликует картонный набат-
          кому нужен ломтик июльского неба?

          Оо- моя оборона
          Солнечный зайчик незрячего мира
          Оо- моя оборона
          Траурный мячик стеклянного глаза
          Траурный зайчик нелепого мира...

Пластмассовый мир победил
Макет оказался сильней
Последний кораблик остыл
Последний фонарик устал,
          а в горле сопят комья воспоминаний.

          Оо- моя оборона
          Траурный мячик незрячего мира
          Оо- моя оборона
          Солнечный зайчик стеклянного глаза.

          Оо- моя оборона!`); };
songs.харакири = function () { songCommands.__singIt(`Сид Вишес умер у тебя на глазах
Джон Леннон умер у тебя на глазах
Джим Моррисон умер у тебя на глазах
А ты остался таким же как был...

Всего два выхода для честных ребят
Схватить автомат и убивать всех подряд
Или покончить с собой,собой,собой,собой
Если всерьёз воспринимать этот мир...

Цель оправдывает средства — давай
Убивай,насилуй,клевещи,предавай
Ради светлого,светлого,светлого,светлого
Светлого здания идей Чучхе...

Всё то,что не доделал Мамай
Октябрь доделал,довёл до конца
Октябрь довёл до последней черты
И всем нам нечего делать здесь...

Мой друг повесился у вас на глазах
Он сделал харакири у вас на крыльце
Он истёк надеждой и всем, чем мог
А все вы остались такими же!..`); };
songs.inTheNameOfGod = function () { songCommands.__singIt(`Hide from the public eye, choose to appear when it suits you
Claim you're just, killing women and children
Fight, when you choose to fight, hide in a cave when you're hunted
Like a beast spawned from hell, utilizing fear

Chosen by god or a coward insane?
Stand up and show me your face!

Suicidal, in a trance
A religious army
Fight without a uniform and hide in the crowd
Call it holy, call it just
Authorized by heaven
Leave your wounded as they die, and call it gods will

Run when its time to pay, fear consequence of your action
Reappear, when you're almost forgotten
Dream of a world in peace, yet you cause pain and destruction
Kill your own, a response of your actions

Captured in all you lies, fear is in your eyes
Creature who's gone insane, your war is in vain
Trapped in a cage of stone, we'll destroy your home
Consequence of your action`); };
songs.theFinalSolution = function () { songCommands.__singIt(`Country in depression
Nation in despair
One man seeking reasons everywhere
Growing hate and anger
The Fuhrer's orders were precise
Who was to be blamed and pay the price!

Wicked propaganda
Turning neighbors into foes
Soldiers of the third Reich searching homes
And then the former friends are watching
As they are rounded up one by one
Times of prosecutions has begun

Ever since it started
On Crystal night of 38
When liberty died
And truth was denied
Sent away on train sent on a one way trip to hell
Enter the gates Auschwitz awaits!

When freedom burns
The final solution
Dreams fade away and all hope turns to dust
When millions burn
The curtain has fallen
Lost to the world as they perish in flames

There was a country in depression
There was a nation in despair
One man finding reasons everywhere
Then there was raising hate and anger
The Fuhrer's orders still apply
Who was to be blamed and send to die!`); };
songs.inTheNameOfGodDeusVult = function () { songCommands.__singIt(`In the Name of God
In the Name of God
In the Name of God we go to heaven

In the Name of God
In the Name of God
In the Name of God we go to heaven

Mater sin - the name of god
We are knights in war and fire
Raise your sword for holy blood
We burn them on the pyre

To defend, to commend to the holy war
Mater Maria
To the end we will stand, we are fighting for
Deus in regnium!

In the Name of God
In the Name of God
In the Name of God we go to heaven

In the Name of God
In the Name of God
In the Name of God we go to heaven

Brother sin, believe in sword
To nights of blood and thunder
Strike for glory and reward
We came to kill and plunder

To your faith, your crusade to the holy war
Mater Maria
To the end we will stand, we are fighting for
Deus in regnium!

In the Name of God
In the Name of God
In the Name of God we go to heaven

In the Name of God
In the Name of God
In the Name of God we follow
In the Name of God we follow

In the Name of Mater Maria, in the Name of God!
In the Name of Mater Maria: Deus in regnium!

Sanctus Christus deus vult
In the Name of God!
Sanctus Iesus Deus Vult
In the Name of God!
Sanctus Christus Deus Vult
In the Name of God!

Cantus Lupus: In the Name of God!
Agnus Christus: In the Name of God!
Sanctus Lupus: In the Name of God!`); };
songs.ghostDivision = function () { songCommands.__singIt(`Fast as the wind, the invasion has begun
Shaking the ground with the force of thousand guns
First in the line of fire, first into hostile land
Tanks leading the way, leading the way

Charging the lines with the force of a furious storm
Fast as the lighting phantoms swarm
200 miles at nightfall, taken within a day
Thus earning their name, earning the fame

[Chorus:]
They are the panzer elite, born to compete, never retreat (ghost division)
Leaving our dead, always ahead, fed by your dread

Always ahead, as the blitzkrieg rages on
Breaking morale with the sound of blazing guns
First in the line of fire, first into hostile land
Tanks leading the way, leading the way

Leaving a trail of destruction to a foreign land
(Waging war with conviction)
Massive assault made to serve the Nazi plan
(Wehrmacht's pride, ghost division)
Communication's broken, phantoms are far away
Thus earning their name, earning the fame

[Chorus]

Pushing the frontline forth with a tremendous force
(Far ahead, breaks resistance)
Making the way for panzer corps
(Shows no fear, self-subsistent)
First in the line of fire, first into hostile land
Tanks leading the way, claiming the fame

[Chorus]

Panzer elite, born to compete, never retreat (ghost division)
Leaving our dead, always ahead, fed by your dread`); };
songs.перемен = function () { songCommands.__singIt(`Вместо тепла - зелень стекла,
Вместо огня - дым,
Из сетки календаря выхвачен день.
Красное солнце сгорает дотла,
День догорает с ним,
На пылающий город падает тень.

Перемен! - требуют наши сердца.
Перемен! - требуют наши глаза.
В нашем смехе и в наших слезах,
И в пульсации вен:
"Перемен!
Мы ждем перемен!"

Электрический свет продолжает наш день,
И коробка от спичек пуста,
Но на кухне синим цветком горит газ.
Сигареты в руках, чай на столе - эта схема проста,
И больше нет ничего, все находится в нас.

Перемен! - требуют наши сердца.
Перемен! - требуют наши глаза.
В нашем смехе и в наших слезах,
И в пульсации вен:
"Перемен!
Мы ждем перемен!"

Мы не можем похвастаться мудростью глаз
И умелыми жестами рук,
Нам не нужно все это, чтобы друг друга понять.
Сигареты в руках, чай на столе - так замыкается круг,
И вдруг нам становится страшно что-то менять.

Перемен! - требуют наши сердца.
Перемен! - требуют наши глаза.
В нашем смехе и в наших слезах,
И в пульсации вен:
"Перемен!
Мы ждем перемен!"`); };
songs.бошентумай = function () { songCommands.__singIt(`Тот, кто в пятнадцать лет убежал из дома,
Вряд ли поймет того, кто учился в спецшколе.
Тот, у кого есть хороший жизненный план,
Вряд ли будет думать о чем-то другом.

Мы пьем чай в старых квартирах,
Ждем лета в старых квартирах,
В старых квартирах, где есть свет,
Газ, телефон, горячая вода,

Радиоточка, пол - паркет,

Санузел раздельный, дом кирпичный,
Одна семья, две семьи, три семьи...
Много подсобных помещений,
Первый и последний - не предлагать,
Рядом с метро, центр...

Все говорят, что мы в-месте...
Все говорят, но немногие знают, в каком.
А из наших труб идет необычный дым.
Стой! Опасная зона! Работа мозга!..
М-м-м, Бошентумай...`); };
songs.deamons = function () {
    songCommands.__singIt(`When the days are cold
And the cards all fold
And the saints we see
Are all made of gold

When your dreams all fail
And the ones we hail
Are the worst of all
And the blood's run stale

I wanna hide the truth
I wanna shelter you
But with the beast inside
There's nowhere we can hide

No matter what we breed
We still are made of greed
This is my kingdom come
This is my kingdom come

When you feel my heat
Look into my eyes
It's where my demons hide
It's where my demons hide
Don't get too close
It's dark inside
It's where my demons hide
It's where my demons hide

At the curtain's call
It's the last of all
When the lights fade out
All the sinners crawl

So they dug your grave
And the masquerade
Will come calling out
At the mess you made

Don't wanna let you down
But I am hell bound
Though this is all for you
Don't wanna hide the truth

No matter what we breed
We still are made of greed
This is my kingdom come
This is my kingdom come

When you feel my heat
Look into my eyes
It's where my demons hide
It's where my demons hide
Don't get too close
It's dark inside
It's where my demons hide
It's where my demons hide

They say it's what you make
I say it's up to fate
It's woven in my soul
I need to let you go

Your eyes, they shine so bright
I wanna save that light
I can't escape this now
Unless you show me how

When you feel my heat
Look into my eyes
It's where my demons hide
It's where my demons hide
Don't get too close
It's dark inside
It's where my demons hide
It's where my demons hide`);
};
songs.believer = function () {
    songCommands.__singIt(`First things first
I'mma say all the words inside my head
I'm fired up and tired of the way that things have been, oh ooh
The way that things have been, oh ooh

Second things second
Don't you tell me what you think that I could be
I'm the one at the sail, I'm the master of my sea, oh ooh
The master of my sea, oh ooh

I was broken from a young age
Taking my sulking to the masses
Writing my poems for the few
That look at me, took to me, shook to me, feeling me
Singing from heartache from the pain
Taking my message from the veins
Speaking my lesson from the brain
Seeing the beauty through the...

Pain!
You made me a, you made me a believer, believer
Pain!
You break me down, you build me up, believer, believer
Pain!
Oh let the bullets fly, oh let them rain
My life, my love, my drive, it came from...
Pain!
You made me a, you made me a believer, believer

Third things third
Send a prayer to the ones up above
All the hate that you've heard has turned your spirit to a dove, oh ooh
Your spirit up above, oh ooh

I was choking in the crowd
Building my rain up in the cloud
Falling like ashes to the ground
Hoping my feelings, they would drown
But they never did, ever lived, ebbing and flowing
Inhibited, limited
Till it broke open and rained down
And rained down, like...

Pain!
You made me a, you made me a believer, believer
Pain!
You break me down, you build me up, believer, believer
Pain!
Oh let the bullets fly, oh let them rain
My life, my love, my drive, it came from...
Pain!
You made me a, you made me a believer, believer

Last things last
By the grace of the fire and the flames
You're the face of the future, the blood in my veins, oh ooh
The blood in my veins, oh ooh
But they never did, ever lived, ebbing and flowing
Inhibited, limited
Till it broke open and rained down
And rained down, like...

Pain!
You made me a, you made me a believer, believer
Pain!
You break me down, you build me up, believer, believer
Pain!
Oh let the bullets fly, oh let them rain
My life, my love, my drive, it came from...
Pain!
You made me a, you made me a believer, believer`);
};
songs.somebodyToDieFor = function () {
    songCommands.__singIt(`I could drag you from the ocean
I could pull you from the fire
And when you're standing in the shadows
I could open up the sky
And I could give you my devotion
Until the end of time
And you will never be forgotten
With me by your side

And I don't need this life
I just need…

I've got nothing left to live for
Got no reason yet to die
But when I'm standing in the gallows
I'll be staring at the sky
Because no matter where they take me
Death I will survive
And I will never be forgotten
With you by my side

Cause I don't need this life
I just need…

Somebody to die for
Somebody to cry for
When I'm lonely

When I'm standing in the fire
I will look him in the eye
And I will let the devil know that
I was brave enough to die
And there's no hell that he can show me
That's deeper than my pride
Cause I will never be forgotten
Forever I'll fight

And I don't need this life
I just need…

Somebody to die for
Somebody to cry for
When I'm lonely

And I don't need this life
I just need…

Somebody to die for
Somebody to cry for
When I'm lonely

Don't go gentle into that good night
Rage on against the dying light`);
};
songs.сонце = function () {
    songCommands.__singIt(`Белый снег, серый лед
На растрескавшейся земле
Одеялом лоскутным на ней
Город в дорожной петле

А над городом плывут облака
Закрывая небесный свет
А над городом желтый дым
Городу две тысячи лет
Прожитых под светом звезды по имени Солнце

И две тысячи лет война -
Война без особых причин
Война - дело молодых
Лекарство против морщин

Красная-красная кровь
Через час уже просто земля

Через два на ней цветы и трава
Через три она снова жива
И согрета лучами звезды по имени Солнце

И мы знаем, что так было всегда
Что судьбою был больше любим, -
Кто живет по законам другим
И кому умирать молодым

Он не помнит слова "Да" и слова "Нет"
Он не помнит ни чинов ни имен
И способен дотянуться до звезд
Не считая что это сон
И упасть опаленный звездой по имени Солнце`);
};
songs.группаКрови = function () {
    songCommands.__singIt(`Теплое место,
На улице ждут отпечатков наших ног.
Звездная пыль, на сапогах.

Мягкое кресло, клетчатый плед,
Не нажатый вовремя курок.
Солнечный день, в ослепительных снах.

Группа крови на рукаве, - 
Мой порядковый номер, - на рукаве.
Пожелай мне удачи в бою,
Пожелай мне...
Не остаться в этой траве,
Не остаться в этой траве,
Пожелай мне удачи,
Пожелай мне удачи...

И есть чем платить,
Но я не хочу, победы любой ценой.
Я никому не хочу ставить ногу на грудь.

Я хотел бы остаться с тобой, -
Просто остаться с тобой,
Но высокая в небе звезда, зовет меня в путь.

Группа крови на рукаве, - 
Мой порядковый номер, - на рукаве.
Пожелай мне удачи в бою,
Пожелай мне...
Не остаться в этой траве,
Не остаться в этой траве,
Пожелай мне удачи,
Пожелай мне удачи...`);
};
songs.пачкаСигарет = function () {
    songCommands.__singIt(`Я сижу и смотрю в чужое небо из чужого окна
И не вижу ни одной знакомой звезды.
Я ходил по всем дорогам и туда, и сюда,
Обернулся - и не смог разглядеть следы.

Но если есть в кармане пачка сигарет,
Значит все не так уж плохо на сегодняшний день.
И билет на самолет с серебристым крылом,
Что, взлетая, оставляет земле лишь тень.

И никто не хотел быть виноватым без вина,
И никто не хотел руками жар загребать,

А без музыки на миру смерть не красна,
А без музыки не хочеться пропадать.

Но если есть в кармане пачка сигарет,
Значит все не так уж плохо на сегодняшний день.
И билет на самолет с серебристым крылом,
Что, взлетая, оставляет земле лишь тень.

Но если есть в кармане пачка сигарет,
Значит все не так уж плохо на сегодняшний день.
И билет на самолет с серебристым крылом,
Что, взлетая, оставляет земле лишь тень.`);
};
songs.виделиНочь = function () {
    songCommands.__singIt(`Мы вышли из дома,
Когда во всех окнах
Погасли огни,
Один за одним.
Мы видели, как уезжает
Последний трамвай.
Ездят такси,
Но нам нечем платить,
И нам незачем ехать.
Мы гуляем одни,
На нашем кассетнике
Кончилась пленка,
Смотай...

Видели ночь,
Гуляли всю ночь до утра.
Видели ночь,
Гуляли всю ночь до утра.

Зайди в телефонную будку,
Скажи, чтоб закрыли дверь
В квартире твоей,
Сними свою обувь -
Мы будем ходить босиком.
Есть сигареты и спички,
И бутылка вина, и она
Поможет нам ждать,
Поможет поверить,
Что все спят,
И мы здесь вдвоем.

Видели ночь,
Гуляли всю ночь до утра.
Видели ночь,
Гуляли всю ночь до утра.`);
};
songs.yesterday = function () {
    songCommands.__singIt(`Yesterday all my troubles seemed so far away.
Now it looks as though they're here to stay.
Oh, I believe in yesterday.

Suddenly, I'm not half the man I used to be.
There's a shadow hanging over me.
Oh, yesterday came suddenly.

Why she had to go?
I don't know, she wouldn't say.
I said something wrong.
Now I long for yesterday.

Yesterday love was such an easy game to play.
Now I need a place to hide away.
Oh, I believe in yesterday.

Why she had to go?
I don't know, she wouldn't say.
I said something wrong.
Now I long for yesterday.

Yesterday love was such an easy game to play.
Now I need a place to hide away.
Oh, I believe in yesterday.`);
};
songs.imagine = function () {
    songCommands.__singIt(`Imagine there's no heaven
It's easy if you try
No hell below us
Above us only sky
Imagine all the people
Living for today... Aha-ah...

Imagine there's no countries
It isn't hard to do
Nothing to kill or die for
And no religion, too
Imagine all the people
Living life in peace... You...

You may say I'm a dreamer
But I'm not the only one
I hope someday you'll join us
And the world will be as one

Imagine no possessions
I wonder if you can
No need for greed or hunger
A brotherhood of man
Imagine all the people
Sharing all the world... You...

You may say I'm a dreamer
But I'm not the only one
I hope someday you'll join us
And the world will live as one`);
};
songs.heathens = function () {
    songCommands.__singIt(`All my friends are heathens, take it slow
Wait for them to ask you who you know
Please don't make any sudden moves
You don't know the half of the abuse
All my friends are heathens, take it slow
Wait for them to ask you who you know
Please don't make any sudden moves
You don't know the half of the abuse

Welcome to the room of people
Who have rooms of people that they loved one day
Docked away
Just because we check the guns at the door
Doesn't mean our brains will change from hand grenades
You're loving on the psychopath sitting next to you
You're loving on the murderer sitting next to you
You'll think, "How'd I get here, sitting next to you?"
But after all I've said, please don't forget

All my friends are heathens, take it slow
Wait for them to ask you who you know
Please don't make any sudden moves
You don't know the half of the abuse

We don't deal with outsiders very well
They say newcomers have a certain smell
You have trust issues, not to mention
They say they can smell your intentions
You're loving on the freakshow sitting next to you
You'll have some weird people sitting next to you
You'll think "How did I get here, sitting next to you?"
But after all I've said, please don't forget
(Watch it, watch it)

All my friends are heathens, take it slow
Wait for them to ask you who you know
Please don't make any sudden moves
You don't know the half of the abuse

All my friends are heathens, take it slow
(Watch it)
Wait for them to ask you who you know
(Watch it)
Please all my friends are heathens, take it slow
(Watch it)
Wait for them to ask you who you know

Why'd you come? You knew you should have stayed
(It's blasphemy)
I tried to warn you just to stay away
(Away)
And now they're outside ready to bust
(To bust)
It looks like you might be one of us`);
};
songs.stressedOut = function () {
    songCommands.__singIt(`I wish I found some better sounds no one's ever heard
I wish I had a better voice that sang some better words
I wish I found some chords in an order that is new
I wish I didn't have to rhyme every time I sang

I was told when I get older all my fears would shrink
But now I'm insecure and I care what people think

My name's 'Blurryface' and I care what you think
My name's 'Blurryface' and I care what you think

Wish we could turn back time, to the good old days
When our momma sang us to sleep but now we're stressed out (oh)
Wish we could turn back time (oh), to the good old days (oh)
When our momma sang us to sleep but now we're stressed out

We're stressed out

Sometimes a certain smell will take me back to when I was young
How come I'm never able to identify where it's coming from
I'd make a candle out of it if I ever found it
Try to sell it, never sell out of it, I'd probably only sell one

It'd be to my brother, 'cause we have the same nose
Same clothes homegrown a stone's throw from a creek we used to roam
But it would remind us of when nothing really mattered
Out of student loans and tree-house homes we all would take the latter

My name's 'Blurryface' and I care what you think
My name's 'Blurryface' and I care what you think

Wish we could turn back time, to the good old days
When our momma sang us to sleep but now we're stressed out (oh)
Wish we could turn back time (oh), to the good old days (oh)
When our momma sang us to sleep but now we're stressed out

We used to play pretend, give each other different names
We would build a rocket ship and then we'd fly it far away
Used to dream of outer space but now they're laughing at our face
Saying, "Wake up, you need to make money."
Yeah

We used to play pretend, give each other different names
We would build a rocket ship and then we'd fly it far away
Used to dream of outer space but now they're laughing at our face
Saying, "Wake up, you need to make money."
Yeah

Wish we could turn back time, to the good old days
When our momma sang us to sleep but now we're stressed out (oh)
Wish we could turn back time (oh), to the good old days (oh)
When our momma sang us to sleep but now we're stressed out

Used to play pretend, used to play pretend, bunny
We used to play pretend, wake up, you need the money
Used to play pretend, used to play pretend, bunny
We used to play pretend, wake up, you need the money
We used to play pretend, give each other different names
We would build a rocket ship and then we'd fly it far away
Used to dream of outer space but now they're laughing at our face
Saying, "Wake up, you need to make money."
Yeah`);
};
songs.itsMyLife = function () {
    songCommands.__singIt(`This ain't a song for the broken-hearted 
No silent prayer for the faith-departed 
I ain't gonna be just a face in the crowd 
You're gonna hear my voice 
When I shout it out loud 

[Chorus:]
It's my life 
It's now or never 
I ain't gonna live forever 
I just want to live while I'm alive 
(It's my life) 
My heart is like an open highway 
Like Frankie said 
I did it my way 
I just wanna live while I'm alive 
It's my life 

This is for the ones who stood their ground 
For Tommy and Gina who never backed down 
Tomorrow's getting harder make no mistake 
Luck ain't even lucky 
Got to make your own breaks 

[Chorus:]
It's my life 
And it's now or never 
I ain't gonna live forever 
I just want to live while I'm alive 
(It's my life) 
My heart is like an open highway 
Like Frankie said 
I did it my way 
I just want to live while I'm alive 
'Cause it's my life 

Better stand tall when they're calling you out 
Don't bend, don't break, baby, don't back down 

[Chorus:]
It's my life 
And it's now or never 
'Cause I ain't gonna live forever 
I just want to live while I'm alive 
(It's my life) 
My heart is like an open highway 
Like Frankie said 
I did it my way 
I just want to live while I'm alive 

[Chorus:]
It's my life 
And it's now or never 
'Cause I ain't gonna live forever 
I just want to live while I'm alive 
(It's my life) 
My heart is like an open highway 
Like Frankie said 
I did it my way 
I just want to live while I'm alive
'Cause it's my life!`);
};
songs.wonderfullLife = function () {
    songCommands.__singIt(`On a bridge across the Severn on a Saturday night,
Susie meets the man of her dreams.
He says that he'd got in trouble and if she doesn't mind
He doesn't want the company.

But there's something in the air
They share a look in silence
And everything is understood.
Susie grabs her man and puts a grip on his hand
As the rain puts a tear in his eye.

She says:
Don't let go
Never give up, it's such a wonderful life.
Don't let go
Never give up, it's such a wonderful life.

Driving through the city to the Temple station,
Cries into the leather seat
And Susie knows her baby was a family man,
But the world has got him down on his knees.

So she throws him at the wall and kisses burn like fire,
And suddenly he starts to believe
He takes her in his arms and he doesn't know why,
But he thinks that he begins to see.

She says:
Don't let go
Never give up, it's such a wonderful life.
Don't let go
Never give up, it's such a wonderful life.
Don't let go
Never give up, it's such a wonderful life.
Don't let go
Never give up, it's such a wonderful life.

She says:
Don't let go
Never give up.
Don't let go
Never give up, it's such a wonderful life.

Wonderful life, wonderful life,
wonderful, wonderful, wonderful life.
wonderful, wonderful, wonderful life.

Don't let go.
Don't let go.`);
};
songs.sweetDreams = function () {
    songCommands.__singIt(`Sweet dreams are made of this
Who am I to disagree?
Travel the world and the seven seas
Everybody's looking for something

Some of them want to use you
Some of them want to get used by you
Some of them want to abuse you
Some of them want to be abused

Sweet dreams are made of this
Who had a mind to disagree?
Travel the world and the seven seas
Everybody's looking for something

Some of them want to use you
Some of them want to get used by you
Some of them want to abuse you
Some of them want to be abused

I wanna use you and abuse you
I wanna know what's inside you
Moving on, moving on
Moving on, moving on
Moving on, moving on
Moving on

Sweet dreams are made of this
Who am I to disagree?
Travel the world and the seven seas
Everybody's looking for something

Some of them want to use you
Some of them want to get used by you
Some of them want to abuse you
Some of them want to be abused

I'm gonna use you and abuse you
I'm gonna know what's inside
Gonna use you and abuse you
I'm gonna know what's inside you`);
};
songs.dogfucker = function () {
    songCommands.__singIt(`У меня болезнь зоофилия. 
Меня очень тянет на собак. 
Бросила меня девчонка Лия 
И сказала то, что я мудак. 

Я ебу собак, всегда готов 
Сразу трахнуть несколько котов. 
Да, я зоофил, не говори. 
Лучше мне собачку подари! 

Я ебу собак, всегда готов 
Сразу трахнуть несколько котов. 
Да, я зоофил, не говори. 
Лучше мне собачку подари! 

Мне собачку трахнуть утром мало. 
Надо утром вечером и днём. 
У меня вчера змея сосала, 
А сегодня я ебусь с ежом! 

Я ебу собак, всегда готов 
Сразу трахнуть несколько котов. 
Да, я зоофил, не . 
Лучше мне собачку подари! 

Я ебу собак, всегда готов 
Сразу трахнуть несколько котов. 
Да, я зоофил, не говори. 
Лучше мне собачку подари! 

Мама принесла вчера котёнка. 
На ночь я его к себе забрал. 
Положил котёнка на пелёнку, 
Сразу во все дыры отъебал! 

Я ебу собак, всегда готов 
Сразу трахнуть несколько котов. 
Да, я зоофил, не говори. 
Лучше мне собачку подари! 

Я ебу собак, всегда готов 
Сразу трахнуть несколько котов. 
Да, я зоофил, не говори. 
Лучше мне собачку подари! 

Лучше мне собачку подари! 
Лучше мне собачку подари! 
Лучше мне собачку подари! 
Лучше мне собачку подари!`);
};
songs.creep = function () {
    songCommands.__singIt(`When you were here before
Couldn't look you in the eye
You're just like an angel
Your skin makes me cry
You float like a feather
In a beautiful world
I wish I was special
You're so fucking special

But I'm a creep
I'm a weirdo
What the hell am I doing here?
I don't belong here

I don't care if it hurts
I want to have control
I want a perfect body
I want a perfect soul
I want you to notice
When I'm not around
You're so fucking special
I wish I was special

But I'm a creep
I'm a weirdo
What the hell am I doing here?
I don't belong here

Oh, oh

She's running out again
She's running out
She run run run run
Run

Whatever makes you happy
Whatever you want
You're so fucking special
I wish I was special

But I'm a creep
I'm a weirdo
What the hell am I doing here?
I don't belong here
I don't belong here`);
};
songs.ifIHadAHeart = function () {
    songCommands.__singIt(`This will never end 'cause I want more
More, give me more, give me more

This will never end 'cause I want more
More, give me more, give me more

If I had a heart I could love you
If I had a voice I would sing
After the night when I wake up
I'll see what tomorrow brings

If I had a voice I would sing

Dangling feet from window frame
Will They ever ever reach the floor?
More, give me more, give me more

Crushed and filled with all I found
Underneath and inside 
Just to come around
More, give me more, give me more

If I had a voice I would sing`);
};
songs.nothingElseMatters = function () {
    songCommands.__singIt(`So close no matter how far
Couldn't be much more from the heart
Forever trusting who we are
And nothing else matters

Never opened myself this way
Life is ours, we live it our way
All these words I don't just say
And nothing else matters

Trust I seek and I find in you
Every day for us something new
Open mind for a different view
And nothing else matters

Never cared for what they do
Never cared for what they know
But I know

So close no matter how far
Couldn't be much more from the heart
Forever trusting who we are
And nothing else matters

Never cared for what they do
Never cared for what they know
But I know

I never opened myself this way
Life is ours, we live it our way
All these words I don't just say
And nothing else matters

Trust I seek and I find in you
Every day for us something new
Open mind for a different view
And nothing else matters

Never cared for what they say
Never cared for games they play
Never cared for what they do
Never cared for what they know
And I know

So close no matter how far
Couldn't be much more from the heart
Forever trusting who we are
No nothing else matters`);
};
songs.myBodyIsACage = function () {
    songCommands.__singIt(`My body is a cage
That keeps me from dancing with the one I love
But my mind holds the key

My body is a cage
That keeps me from dancing with the one I love
But my mind holds the key

I'm standing on a stage
Of fear and self doubt
It's a hollow play
But they'll clap anyway

My body is a cage
That keeps me from dancing with the one I love
But my mind holds the key

You're standing next to me
My mind holds the key

I'm living in an age
That calls darkness light
Though my language is dead
Still the shapes fill my head

I'm living in an age
Whose name I don't know
Though the fear keeps me moving
Still my heart beats so slow

My body is a cage
That keeps me from dancing with the one I love
But my mind holds the key

You're standing next to me
My mind holds the key
My body is a...

My body is a cage
We take what we're given
Just because you've forgotten
That don't mean you're forgiven

I'm living in an age
That screams my name at night
But when I get to the doorway
There's no one in sight

I'm living in an age
They laugh when I'm dancing with the one I love
But my mind holds the key

You're standing next to me
My mind holds the key

Set my spirit free
Set my spirit free
Set my body free
Set my body free

Set my spirit free
Set my body free`);
};
songs.primoVictoria = function () {
    songCommands.__singIt(`Through the gates of hell
As we make our way to heaven
Through the Nazi lines
Primo victoria

We've been training for years
Now we're ready to strike
As the great operation begins
We're the first wave on the shore
We're the first ones to fall
Yet soldiers have fallen before

In the dawn they will pay
With their lives as the price
History's written today
In this burning inferno
Know that nothing remains
As our forces advance on the beach

Aiming for heaven though serving in hell
Victory is ours their forces will fall

Through the gates of hell
As we make our way to heaven
Through the Nazi lines
Primo victoria

On the 6th of June
On the shores of western Europe 1944
D-day upon us

We've been here before
Used to this kind of war
Crossfire grind through the sand
Our orders were easy
It's kill or be killed
Blood on both sides will be spilled

In the dawn they will pay
With their lives as the price
History's written today
Now that we are at war
With the axis again
This time we know what will come

6th of June 1944
Allies are turning the war
Normandy state of anarchy
Overlord`);
};
songs.smellsLikeTeenSpirit = function () {
    songCommands.__singIt(`Load up on guns, bring your friends
It's fun to lose and to pretend
She's over bored and self assured
Oh no, I know a dirty word

Hello, hello, hello, how low?
Hello, hello, hello, how low?
Hello, hello, hello, how low?
Hello, hello, hello!

With the lights out, it's less dangerous
Here we are now, entertain us
I feel stupid and contagious
Here we are now, entertain us
A mulatto
An albino
A mosquito
My libido
Yeah, hey, yay

I'm worse at what I do best
And for this gift I feel blessed
Our little group has always been
And always will until the end

Hello, hello, hello, how low?
Hello, hello, hello, how low?
Hello, hello, hello, how low?
Hello, hello, hello!

With the lights out, it's less dangerous
Here we are now, entertain us
I feel stupid and contagious
Here we are now, entertain us
A mulatto
An albino
A mosquito
My libido
Yeah, hey, yay

And I forget just why I taste
Oh yeah, I guess it makes me smile
I found it hard, it's hard to find
Oh well, whatever, never mind

Hello, hello, hello, how low?
Hello, hello, hello, how low?
Hello, hello, hello, how low?
Hello, hello, hello!

With the lights out, it's less dangerous
Here we are now, entertain us
I feel stupid and contagious
Here we are now, entertain us
A mulatto
An albino
A mosquito
My libido

A denial!`);
};
songs.kisNecromant = function () {
    songCommands.__singIt(`Ты говоришь я демон? Так и есть!
Со мною не видать тебе удачи.
Навеки мое дело - зло и месть
Для демона не может быть иначе!

Чем я заслужил судьбу несчастного изгоя?
Постоянно доставать себя вопросом Кто я?
Мысли, что я демон, часто выжить помогали.
Люди же повсюду так меня и называли.

Ты, зловещая луна
В мои муки влюблена
Отобрав души покой,
Что ты делаешь со мной?
Может ты мне дашь ответ
Почему весь белый свет
Обозлился на меня,
Для чего родился я?

Помню, как толпа крестьян убить меня хотела
После инквизиторы калечили мне тело
Все восстало против молодого некроманта
Сделав меня мучеником моего таланта

Ты, зловещая луна
В мои муки влюблена
Отобрав души покой,
Что ты делаешь со мной?
Может ты мне дашь ответ
Почему весь белый свет

Обозлился на меня,
Для чего родился я?

Наполовину человек,
Наполовину я мертвец.
Таким останусь я навек -
Я будто волк среди овец.
Полна страданий жизнь моя,
Но выбор сделанный судьбой
Нет, изменить не в силах я:
Война с самим собой!

Можешь ты мне дать ответ,
Почему весь белый свет
Обозлился на меня?

Люди мне враги, а ведь когда-то были братья.
Я на всю округу наложил свое проклятье
Гибнут урожаи, а вокруг чума и голод
И ветра залетные приносят жуткий холод

Ты, зловещая луна
В мои муки влюблена
Отобрав души покой,
Что ты делаешь со мной?
Может ты мне дашь ответ
Почему весь белый свет
Обозлился на меня,
Для чего родился я?`);
};
songs.vladimirskiyCentral = function () {
    songCommands.__singIt(`Весна опять пришла и лучики тепла,
Доверчиво глядят в моё окно 
Опять защемит грудь и в душу влезет грусть
По памяти пойдёт со мной.

Пойдёт разворошит и вместе согрешит
С той девочкой что так давно любил.
С той девочкой ушла, с той девочкой пришла
Забыть её не хватит сил

Владимирский централ (Ветер северный)
Этапом из Твери (Зла немерено )
Лежит на сердце тяжкий груз
Владимирский централ (Ветер северный )
Когда я банковал (Жизнь разменяна)
Но не очко обычно губит.

А к одиннадцати туз.

Там под окном зэка, проталина тонка,
И всё ж то не долга моя весна.
Я радуюсь что здесь, хоть это-то но есть,
Как мне твоя любовь нужна.
Пр-в тот -же ( Хотя я банковал )

Владимирский централ (Ветер северный)
Этапом из Твери (Зла немерено )
Лежит на сердце тяжкий груз
Владимирский централ (Ветер северный )
Когда я банковал (Жизнь разменяна)
Но не очко обычно губит.
А к одиннадцати туз.`);
};
songs.duality = function () {
    songCommands.__singIt(`I push my fingers into my eyes.
It's the only thing that slowly stops the ache.
But it's made of all the things I have to take.
Jesus, it never ends, it works its way inside.
If the pain goes on... ah!

I have screamed until my veins collapsed
I've waited as my time's elapsed
Now all I do is live with so much fate
I've wished for this, I've bitched at that
I've left behind this little fact:
You cannot kill what you did not create

I've gotta say what I've gotta say
And then I swear I'll go away
But I can't promise you'll enjoy the noise
I guess I'll save the best for last
My future seems like one big past
You're left with me 'cause you left me no choice

I push my fingers into my eyes
It's the only thing that slowly stops the ache
If the pain goes on,
I'm not gonna make it!

Put me back together
Or separate the skin from bone
Leave me all the pieces
Then you can leave me alone
Tell me the reality is better than the dream
But I found out the hard way,
Nothing is what it seems!

I push my fingers into my eyes
It's the only thing that slowly stops the ache
But it's made of all the things I have to take
Jesus, it never ends, it works its way inside
If the pain goes on,
I'm not gonna make it!

All I've got... all I've got is insane. [6x]

I push my fingers into my eyes
It's the only thing that slowly stops the ache
But it's made of all the things I have to take
Jesus, it never ends, it works its way inside
If the pain goes on,
I'm not gonna make it!

All I've got... all I've got is insane. [4x]`);
};
songs.psychosocial = function () {
    songCommands.__singIt(`Ooh, yeah!

I did my time and I want out
So effusive - fade - it doesn't cut
The soul is not so vibrant
The reckoning, the sickening
Packaging subversion
Pseudo sacrosanct perversion
Go drill your deserts, go dig your graves
Then fill your mouth with all the money you will save
Sinking in, getting smaller again
I'm done! It has begun! I'm not the only one!

[Chorus:]
And the rain will kill us all...
We throw ourselves against the wall
But no one else can see
The preservation of the martyr in me

Psychosocial! [x6]

There are cracks in the road we laid
But where the temple fell
The secrets have gone mad
This is nothing new, but when we killed it all
The hate was all we had
Who needs another mess?
We could start over
Just look me in the eyes and say I'm wrong
Now there's only emptiness
Venomous, insipid
I think we're done. I'm not the only one!

[Chorus]

Psychosocial! [x6]

The limits of the dead! [x4]

Fake anti-fascist lie - (psychosocial!)
I tried to tell you but - (psychosocial!)
Your purple hearts are giving out - (psychosocial!)
Can't stop a killing idea - (psychosocial!)
If it's hunting season - (psychosocial!)
Is this what you want? - (psychosocial!)
I'm not the only one!

[Chorus x2]

The limits of the dead... [2x]`);
};
songs.houseOfTheRisingSun = function () {
    songCommands.__singIt(`There is a house in New Orleans
They call the Rising Sun
And it's been the ruin of many a poor boy
And God, I know I'm one

My mother was a tailor
She sewed my new blue jeans
My father was a gamblin' man
Down in New Orleans

Now the only thing a gambler needs
Is a suitcase and trunk
And the only time he's satisfied
Is when he's on a drunk

[Organ Solo]

Oh mother, tell your children
Not to do what I have done
Spend your lives in sin and misery
In the House of the Rising Sun

Well, I got one foot on the platform
The other foot on the train
I'm goin' back to New Orleans
To wear that ball and chain

Well, there is a house in New Orleans
They call the Rising Sun
And it's been the ruin of many a poor boy
And God, I know I'm one`);
};
songs.peopleAreStrange = function () {
    songCommands.__singIt(`People are strange when you're a stranger 
Faces look ugly when you're alone 
Women seem wicked when you're unwanted 
Streets are uneven when you're down 

When you're strange 
Faces come out of the rain 
When you're strange 
No one remembers your name 
When you're strange 
When you're strange 
When you're strange 

People are strange when you're a stranger 
Faces look ugly when you're alone 
Women seem wicked when you're unwanted 
Streets are uneven when you're down 

When you're strange 
Faces come out of the rain 
When you're strange 
No one remembers your name 
When you're strange 
When you're strange 
When you're strange 

When you're strange 
Faces come out of the rain 
When you're strange 
No one remembers your name 
When you're strange 
When you're strange 
When you're strange`);
};
songs.singRockYou = function () {
    songCommands.__singIt(`Buddy you're a boy make a big noise
Playin' in the street gonna be a big man some day
You got mud on yo' face
You big disgrace
Kickin' your can all over the place
Singin'

We will we will rock you
We will we will rock you

Buddy you're a young man hard man
Shoutin' in the street gonna take on the world some day
You got blood on yo' face
You big disgrace
Wavin' your banner all over the place

We will we will rock you
(Sing it!)
We will we will rock you

Buddy you're an old man poor man
Pleadin' with your eyes gonna make you some peace some day
You got mud on your face
Big disgrace
Somebody better put you back into your place

We will we will rock you
(Sing it!)
We will we will rock you

(Everybody)

We will we will rock you
We will we will rock you

(Alright)
`);
};
songs.rollingInTheDeep = function () {
    songCommands.__singIt(`There's a fire starting in my heart
Reaching a fever pitch, it's bringing me out the dark
Finally I can see you crystal clear
Go 'head and sell me out and I'll lay your shit bare
See how I leave with every piece of you
Don't underestimate the things that I will do

There's a fire starting in my heart
Reaching a fever pitch
And it's bringing me out the dark

The scars of your love remind me of us
They keep me thinking that we almost had it all
The scars of your love, they leave me breathless
I can't help feeling
We could have had it all
(You're gonna wish you never had met me)
Rolling in the deep
(Tears are gonna fall, rolling in the deep)
You had my heart inside of your hand
(You're gonna wish you never had met me)
And you played it, to the beat
(Tears are gonna fall, rolling in the deep)

Baby, I have no story to be told
But I've heard one on you
And I'm gonna make your head burn
Think of me in the depths of your despair
Make a home down there
As mine sure won't be shared

(You're gonna wish you never had met me)
The scars of your love remind me of us
(Tears are gonna fall, rolling in the deep)
They keep me thinking that we almost had it all
(You're gonna wish you never had met me)
The scars of your love, they leave me breathless
(Tears are gonna fall, rolling in the deep)
I can't help feeling
We could have had it all
(You're gonna wish you never had met me)
Rolling in the deep
(Tears are gonna fall, rolling in the deep)
You had my heart inside of your hand
(You're gonna wish you never had met me)
And you played it, to the beat
(Tears are gonna fall, rolling in the deep)
We could have had it all
Rolling in the deep
You had my heart inside of your hand
But you played it, with a beating

Throw your soul through every open door (woah)
Count your blessings to find what you look for (woah)
Turn my sorrow into treasured gold (woah)
You'll pay me back in kind and reap just what you sow (woah)
(You're gonna wish you never had met me)
We could have had it all
(Tears are gonna fall, rolling in the deep)
We could have had it all
(You're gonna wish you never had met me)
It all, it all, it all
(Tears are gonna fall, rolling in the deep)

We could have had it all
(You're gonna wish you never had met me)
Rolling in the deep
(Tears are gonna fall, rolling in the deep)
You had my heart inside of your hand
(You're gonna wish you never had met me)
And you played it to the beat
(Tears are gonna fall, rolling in the deep)

We could have had it all
(You're gonna wish you never had met me)
Rolling in the deep
(Tears are gonna fall, rolling in the deep)
You had my heart inside of your hand
(You're gonna wish you never had met me)

But you played it
You played it
You played it
You played it to the beat.
`);
};
songs.numb = function () {
    songCommands.__singIt(`I'm tired of being what you want me to be
Feeling so faithless, lost under the surface
Don't know what you're expecting of me
Put under the pressure of walking in your shoes
(Caught in the undertow, just caught in the undertow)
Every step that I take is another mistake to you
(Caught in the undertow, just caught in the undertow)

[Chester Bennington:]
I've become so numb, I can't feel you there
Become so tired, so much more aware
I'm becoming this, all I want to do
Is be more like me and be less like you

[Chester Bennington (Mike Shinoda):]
Can't you see that you're smothering me,
Holding too tightly, afraid to lose control?
'Cause everything that you thought I would be
Has fallen apart right in front of you.
(Caught in the undertow, just caught in the undertow)
Every step that I take is another mistake to you.
(Caught in the undertow, just caught in the undertow)
And every second I waste is more than I can take.

[Chester Bennington:]
I've become so numb, I can't feel you there,
Become so tired, so much more aware
I'm becoming this, all I want to do
Is be more like me and be less like you.

And I know
I may end up failing too.
But I know
You were just like me with someone disappointed in you.

I've become so numb, I can't feel you there,
Become so tired, so much more aware.
I'm becoming this, all I want to do
Is be more like me and be less like you.

[Chester Bennington (Mike Shinoda):]
I've become so numb, I can't feel you there.
(I'm tired of being what you want me to be)
I've become so numb, I can't feel you there.
(I'm tired of being what you want me to be)`);
};