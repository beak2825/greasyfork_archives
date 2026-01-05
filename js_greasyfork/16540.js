// ==UserScript==
// @name           Pokeheroes Korean Translation
// @namespace      
// @description    Korean translation for Pokeheroes. Pokeheroes 한글번역.
// @include        http://pokeheroes.com/*
// @include        https://pokeheroes.com/*
// @exclude        http://userscripts.org/scripts/review/*
// @exclude        http://userscripts.org/scripts/edit/*
// @exclude        http://userscripts.org/scripts/edit_src/*
// @exclude        https://userscripts.org/scripts/review/*
// @exclude        https://userscripts.org/scripts/edit/*
// @exclude        https://userscripts.org/scripts/edit_src/*
// @copyright      Cliff_Armor
// @version        (Unfinished) 1.0.0
// @license        
// @downloadURL https://update.greasyfork.org/scripts/16540/Pokeheroes%20Korean%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/16540/Pokeheroes%20Korean%20Translation.meta.js
// ==/UserScript==
//For text I can't replace with simple text replacement
document.body.innerHTML= document.body.innerHTML.replace(/See here for newest posts about updates, bugfixes or upcoming event announcements! Post your opinions on different news from the <a href=\"index\">News-Page<\/a>/g,"여기에서 업데이트, 버그 패치 혹은 이벤트에 대한 정보를 읽으세요! <a href=\"index\">뉴스 페이지<\/a>의 다양한 뉴스에 자신의 생각을 써보세요");
//document.body.innerHTML= document.body.innerHTML.replace(//g,"");
//^Template
document.body.innerHTML= document.body.innerHTML.replace(/Take part in exciting official contests to  have the chance to win a prize!/g,"흥미진진한 컨테스트에 참가해서 상품을 따보세요!");
document.body.innerHTML= document.body.innerHTML.replace(/<h2 class=\"background\" style=\"font-size: 80px\">Your Party<\/h2>/g,"<h2 class=\"background\" style=\"font-size: 80px\">나의 파티<\/h2>");
document.body.innerHTML= document.body.innerHTML.replace(/<textarea id=\"feed_share\" name=\"feed\" placeholder=\"Share some news...\"/g,"<textarea id=\"feed_share\" name=\"feed\" placeholder=\"정보를 공유해보세요\"");
document.body.innerHTML= document.body.innerHTML.replace(/class=\"tabselect\">Daily Offer<\/div>/g,"class=\"tabselect\">특가 상품<\/div>");
document.body.innerHTML= document.body.innerHTML.replace(/class=\"tabselect\">Evo. Stones<\/div>/g,"class=\"tabselect\">진화 아이템<\/div>");
document.body.innerHTML= document.body.innerHTML.replace(/class=\"tabselect\">Berries<\/div>/g,"class=\"tabselect\">베리<\/div>");
document.body.innerHTML= document.body.innerHTML.replace(/class=\"tabselect\">Misc. Items<\/div>/g,"class=\"tabselect\">잡화<\/div>");
document.body.innerHTML= document.body.innerHTML.replace(/#9d870f\">Special<\/div>/g,"#9d870f\">특별<\/div>");
document.body.innerHTML= document.body.innerHTML.replace(/#9d870f\">Nuggets<\/div>/g,"#9d870f\">너겟<\/div>");
document.body.innerHTML= document.body.innerHTML.replace(/There are different categories in which you can win Medals in this Rally./g,"메달을 얻을 수 있는 랠리의 종목은 여러가지 입니다.");
document.body.innerHTML= document.body.innerHTML.replace(/A new Rally starts at the 1st and the 15th of every month./g,"매달 1일과 15일에 새 랠리가 시작합니다.");
document.body.innerHTML= document.body.innerHTML.replace(/All Pokémon\/Items have to be obtained during the current rally round./g,"모든 참가 포켓몬\/아이템은 랠리 시작 후에 얻어야 됩니다.");
document.body.innerHTML= document.body.innerHTML.replace(/All medals won are placed on your userpage./g,"딴 모든 메달은 프로필에 올라갑니다.");
document.body.innerHTML= document.body.innerHTML.replace(/180px\">How it works<\/h3>/g,"180px\">메달 랠리의 기본<\/h3>");
document.body.innerHTML= document.body.innerHTML.replace(/clear: both\">Current Rally<\/h3>/g,"clear: both\">진행중인 랠리<\/h3>");
document.body.innerHTML= document.body.innerHTML.replace(/Strongest Pokémon/g,"최강 포켓몬");
document.body.innerHTML= document.body.innerHTML.replace(/Most Eggs hatched/g,"최다수의 알 부화");
document.body.innerHTML= document.body.innerHTML.replace(/Most Berries fed/g,"최다 베리 사용");
document.body.innerHTML= document.body.innerHTML.replace(/Most Coinflip played\*/g,"최다 동전 던지기 사용\*");
document.body.innerHTML= document.body.innerHTML.replace(/\* Minimum bid: 100 Game Chips/g,"최소 사용 게임 칩: 100");
document.body.innerHTML= document.body.innerHTML.replace(/<b>Navigation:<\/b>/g,"<b>네비게이션:<\/b>");
document.body.innerHTML= document.body.innerHTML.replace(/Eggs hatched<\/i>/g,"개의 알 부화<\/i>");
document.body.innerHTML= document.body.innerHTML.replace(/Berries fed<\/i>/g,"개의 베리 먹임<\/i>");
document.body.innerHTML= document.body.innerHTML.replace(/<a href=\"forum_subscriptions\">View your forum subscriptions<\/a>/g,"<a href=\"forum_subscriptions\">구독한 토픽 관리<\/a>");
document.body.innerHTML= document.body.innerHTML.replace(/>Logout<\/a>/g,">로그아웃<\/a>");
//Rowan text
document.body.innerHTML= document.body.innerHTML.replace(/Prof. Rowans Lab/g,"마박사의 연구소");
document.body.innerHTML= document.body.innerHTML.replace(/Look at all this science stuff!/g,"과학용품이 수두룩하다");
document.body.innerHTML= document.body.innerHTML.replace(/<b>Hey/g,"<b>어이");
document.body.innerHTML= document.body.innerHTML.replace(/Prof. Rowan's analysis of your/g,"마박사의 소감");
document.body.innerHTML= document.body.innerHTML.replace(/Look, I've recently got some new eggs! But be sure to have an empty space in your party before adopting one./g,"내가 최근에 새로 알을 얻게 됬네! 입양하기 전에 꼭 파티에 자리가 있는지 확인하게.");
document.body.innerHTML= document.body.innerHTML.replace(/You know, life can be very difficult and complicated sometimes. I'm not only talking about your life as a Pokémon Trainer./g,"그거 알아? 삶은 매우 복잡하고 어려울 때가 있단다. 트레이너로서의 삶에 대해서만 얘기하는 건 아니야.");
document.body.innerHTML= document.body.innerHTML.replace(/Love is unpredictable; it can be very hurtful from time to time, but it can also be the most beautiful thing on earth. When I was a young man, travelling through the world,/g,"사랑은 예측불가란다; 어쩔떈 매우 아플때도 있지만, 세상에서 제일 대단한 것이 될 수도 있어. 내가 청년일때 세상을 여행하면서");
document.body.innerHTML= document.body.innerHTML.replace(/I once met a lovely lady, her name was Lara./g,"\'라라\'라는 아름다운 여자를 만났다네.");
document.body.innerHTML= document.body.innerHTML.replace(/I immediately fell in love with her, life was so exciting like never before. She had beautiful brown hair/g,"난 그녀와 바로 사랑에 빠졌다네. 그 후로부턴 삶이 훨씬 더 흥미로웠지. 그녀는 아름다운 갈색 머릿결을 가지고 있었고");
document.body.innerHTML= document.body.innerHTML.replace(/and I clearly remember her marvellous fragrance./g, "아직도 그녀 주변의 향기는 기억에 남아있어.");
document.body.innerHTML= document.body.innerHTML.replace(/You wonder what happened then?/g,"그 후에는 어떻게 됬냐고?");
document.body.innerHTML= document.body.innerHTML.replace(/Well \*sigh\* life is unpredictable. And hurtful, from time to time./g,"뭐, \*한숨\* 사랑은 예측불가란다. 그리고 어쩔땐 매우 고통스럽지.");
//Auction House stuff
document.body.innerHTML= document.body.innerHTML.replace(/Wanted - found./g,"뭘 찾는다면 이곳에 있습니다");
document.body.innerHTML= document.body.innerHTML.replace(/Welcome to the Auction House! Here you have the possibility to bid on other users\' Pokémon or to set up one of your own Pokémon for auction./g,"경매장에 오신 걸 환영합니다! 여기에선 다른 유저의 포켓몬에 입찰하거나 자신의 포켓몬을 내놓을 수 있습니다.");
document.body.innerHTML= document.body.innerHTML.replace(/Every Pokémon here is sold with/g,"여기에 있는 모든 포켓몬은");
document.body.innerHTML= document.body.innerHTML.replace(/<b>Pokédollar<\/b>/g,"<b>Pokédollar<\/b>로 살 수 있습니다");
document.body.innerHTML= document.body.innerHTML.replace(/We keep 5% of total revenue for each auction./g,"모든 경매 수익의 5%는 우리가 갖게 됩니다.");
document.body.innerHTML= document.body.innerHTML.replace(/Search for a Pokémon/g,"포켓몬 검색");
document.body.innerHTML= document.body.innerHTML.replace(/<input type=\"submit\" value=\"Search\" style=\"margin-top: 4px\">/g,"<input type=\"submit\" value=\"검색\" style=\"margin-top: 4px\">");
document.body.innerHTML= document.body.innerHTML.replace(/<th>PKMN<\/th>/g,"<th>포켓몬<\/th>");
document.body.innerHTML= document.body.innerHTML.replace(/<th>Level<\/th>/g,"<th>레벨<\/th>");
document.body.innerHTML= document.body.innerHTML.replace(/<th>Item<\/th>/g,"<th>아이템<\/th>");
document.body.innerHTML= document.body.innerHTML.replace(/<th>Creator<\/th>/g,"<th>판매자<\/th>");
document.body.innerHTML= document.body.innerHTML.replace(/<th>Winning Bid<\/th>/g,"<th>최고 입찰가<\/th>");
document.body.innerHTML= document.body.innerHTML.replace(/<th>Highest Bidder<\/th>/g,"<th>최고 입찰자<\/th>");
document.body.innerHTML= document.body.innerHTML.replace(/<th>Expiring<\/th>/g,"<th>남은 시간<\/th>");
document.body.innerHTML= document.body.innerHTML.replace(/title=\"This Pokémon appears to have a special power.\">/g,"title=\"이 포켓몬은 특별한 능력을 가지고 있는 것 같습니다.\">");
document.body.innerHTML= document.body.innerHTML.replace(/Promoted auctions/g,"홍보된 경매");
document.body.innerHTML= document.body.innerHTML.replace(/Currently expiring auctions/g,"기간이 끝나가는 경매");
document.body.innerHTML= document.body.innerHTML.replace(/Your auctions/g,"나의 경매");
document.body.innerHTML= document.body.innerHTML.replace(/<b>You haven\'t set up any auctions.<\/b>/g,"<b>만든 경매가 없습니다.<\/b>");
document.body.innerHTML= document.body.innerHTML.replace(/<a href=\"auction_setup\" style=\"font-size: 14px\">Set up an auction<\/a>/g,"<a href=\"auction_setup\" style=\"font-size: 14px\">경매 만들기<\/a>");
document.body.innerHTML= document.body.innerHTML.replace(/Auctions you're bidding on/g,"내가 입찰한 경매");
document.body.innerHTML= document.body.innerHTML.replace(/<b>You aren\'t bidding on any auction at the moment.<\/b>/g,"<b>지금 입찰하고 있는 경매가 없습니다.<\/b>");
(function () {
    'use strict';


    /*
        NOTE: 
            You can use \\* to match actual asterisks instead of using it as a wildcard!
    */

    var words = {
        ///////////////////////////////////////////////////////


        // Syntax: 'Search word' : 'Replace word',



        ///////////////////////////////////////////////////////
        //Tutorial stuff
        'Tutorial' : '튜토리얼',
        'Welcome,' : '환영합니다,',
        'Introduction checklist' : '튜토리얼 진행',
        'Get started on PokéHeroes!' : 'PokéHeroes에서의 생활을 시작하세요!',
        //End Tutorial
        'Support Center' : '지원 센터',
        'HeroChat' : '히어로챗',
        'Medal Rally' : '메달랠리',
        'Fanmade' : '팬메이드',
        'Country Clan' : '나라 그룹',
        'Hour ago' : '시간 전',
        'Hours ago' : '시간 전',
        'Country' : '나라',
        'Game Center' : '게임코너',
        'Royal Tunnel' : '로얄 터널',
        'Rumble Areas' : '럼블 구역',
        'Daycare' : '포켓몬 키우미집',
        'Emera Mall' : '에메라 몰',
        'Berrygarden' : '베리 정원',
        'Premium Settings' : '프리미엄 설정',
        'Tall Grass' : '알 레이더',
        'Battle Team' : '배틀 팀',
        'Storage Boxes' : 'PC',
        
        'Item Bag' : '아이템 가방',
        'VS. Seeker' : '배틀서처',
        'Poll Manager' : '투표 관리',
        'Style Settings' : '스타일 설정',
        'Gotta win \'em all!' : '다 이겨보자!',
        'Misc. Settings' : '그 외 설정',
        'Your Party' : '나의 파티',
        'Forum-Index' : '포럼 메인',
        'Community' : '커뮤니티',
        'Introduction' : '자기소개',
        'Commented by me' : '내가 답장한 피드',
        'Most Discussed' : '답장 최다 피드',
        'Newest Feeds' : '최신 피드',
        'Trending Hashtags' : '유행 해시태그',
        'Gym' : '체육관',
        'Game Records' : '게임 기록',
        'Bug/Compl.' : '버그/불편사항',
        '[Game]' : '[게임]',
        'Newest posts' : '최신 답글',
        'RP' : '롤플레이',
        'Arts' : '미술',
        'Help' : '질문',
        'Diary' : '일기',
        'Topics' : '토픽',
        'Posts' : '답글',
        'Today' : '오늘',
        'Yesterday' : '어제',
        'Notification Wall' : '알림 벽',
        'GTS' : '트레이드',
        'Contests' : '컨테스트',
        'Most active topics:' : '최고 답글 토픽:',
        'Contest' : '컨테스트',
        'Take part in exciting official contests to have the chance to win a prize!' : '흥미진진한 컨테스트에 참가하여 상품을 따보세요!',
        'User-made contests' : '유저들의 컨테스트',
        'The meeting place for all users' : '모든 유저들이 만나는 곳',
        //Delibird stuff
        'Delibird Item Delivery' : '델리버드 아이템 배달',
        'Send items to other trainers' : '다른 트레이너에게 아이템을 보내세요',
        'Welcome, welcome!' : '환영합니다, 환영합니다!',
        'Welcome trainer! Are you here to send some items to another trainer?' : '환녕합니다, 트레이너! 다른 트레이너에게 아이템을 보내려고 오셨습니까?',
        'Here at the Item Delivery Station we have over twohundred employees -' : '여기 아이템 배달소에는 직원이 200명보다도 많답니다 -',
        'only hard working Delibird, obviously! For a very small Pokédollar fee, you' : '물론 모두 다 열심히 일하는 델리버드죠! 소량의 Pokédollar를 내면',
        'can send multiple items in packages to your friends.' : '친구들에게 여러개의 아이템을 보낼 수 있습니다.',
        'The shipment is secure and fast.' : '운송은 안전하고 빠릅니다.',
        'Your packages' : '당신의 소포',
        'There are no packages waiting for you! You will receive a notification as soon as a package arrives.' : '지금은 당신에게 배달된 소포가 없습니다! 소포가 오면 바로 알림을 받게 됩니다.',
        'Send items' : '아이템 보내기',
        //End Delibird stuff
        'Last PM' : '마지막 메시지',
        //Rowan stuff
        'Prof. Rowan\'s Lab' : '마박사의 연구소',
        'You know, life can be very difficult and complicated sometimes. I\'m not only talking about your life as a Pokémon Trainer.' : '그거 알아? 삶은 매우 복잡하고 어려울 떄도 있단다. 지금 너의 포켓몬 트레이너로서의 생활만을 얘기하는건 아니야.',
        'Love is unpredictable; it can be very hurtful from time to time, but it can also be the most beautiful thing on earth.' : '사랑은 예측불가야; 어쩔땐 매우 아프기도 하지만, 이 세상에서 제일 아름다운 것이 될 때도 있어.',
        'When I was a young man, travelling through the world, I once met a lovely lady, her name was Lara.' : '내가 청년일때 세계를 여행하다 \'라라\'라는 아름다운 여인을 만났지.',
        'I immediately fell in love with her, life was so exciting like never before.' : '난 그녀와 바로 사랑에 빠졌단다. 그 후로부터는 삶이 훨씬 더 흥미로웠지.',
        'She had beautiful brown hair and I clearly remember her marvellous fragrance.' : '그녀는 어여쁜 갈색 머릿결을 가지고 있었고 그녀 주변의 향기는 아직도 기억나네.',
        'You wonder what happened then? ... Well *sigh* life is unpredictable. And hurtful, from time to time.' : '그 후에는 뭐가 일어났냐고? ... 뭐 \*한숨\* 삶은 예측불가란다. 그리고 어쩔땐 고통스럽지.',
        'Your Pokédex analysis' : '너의 포켓몬 도감 분석',
        'Prof. Rowan\'s analysis of your' : '마박사의 한마디',
        'Normal Pokédex:' : '(보통 도감):',
        'Pokédex entries:' : '도감 기록:',
        '"You have already collected a lot of data, thanks! But you still have a long way to go."' : '"많은 데이터를 모아줘서 고맙네. 하지만 끝낼려면 아직 많이 남았어."',
        'Adopt an egg' : '알 입양',
        'Look, I\'ve recently got some new eggs! But be sure to have an empty space in your party before adopting one.' : '내가 최근에 새로운 알을 받게 됬네. 데려가지 전에 파티에 빈자리가 있는지 확인해.',
        'Analyzing rarity...' : '희귀도 분석중...',
        //End Rowan stuff
        'Rarity' : '희귀도',
        'Route 53' : '53번 길',
        'Pokédex' : '포켓몬 도감',
        'About Me' : '자기소개',
        'Suggestion' : '제의',
        'Trainerpoints' : '트레이너 포인트',
        'Party' : '파티',
        'Pkmn' : '포켓몬',
        'Name' : '이름',
        'FC' : '팬클럽',
        'Plushies' : '인형',
        'Last Visitors' : '마지막 방문자',
        'Visitors' : '방문자',
        'Newest gifts' : '선물 기록',
        'Polls' : '투표',
        'Poll' : '투표',
        'Shiny Hunt' : '이로치 사냥',
        'is currently hunting' : '님은 현재 이 포켓몬을 사냥하는 중입니다:',
        'Hunt started' : '사냥 시작일',
        'Shinies hatched so far.' : '찾은 이로치 갯수',
        'Feeds' : '피드',
        'Medals' : '메달',
        'Badge Showcase' : '배지 진열장',
        'Safari Zone' : '사파리존',
        'Emera Square' : '에메라 광장',
        //Forum stuff
        'Forum Posts' : '글 갯수',
        'Day ago' : '일 전',
        'Posted:' : '쓴 날자:',
        'Days ago' : '일 전',
        'Months ago' : '달 전',
        'Month ago' : '달 전',
        'Hours and' : '시간',
        'Hour and' : '시간',
        'Year ago' : '년 전',
        'Years ago' : '년 전',
        'Hours' : '시간',
        'Subscribe' : '구독',
        'Post new message' : '새 답글 쓰기',
        'Start new Thread' : '새 토픽 시작하기',
        'OFFLINE' : '오프라인',
        'ONLINE' : '온라인',
        'Trainerlevel' : '레벨',
        'News-Page' : '뉴스 페이지',
        'See here for newest posts about updates, bugfixes or upcoming event announcements! Post your opinions on different news from the' : '여기에는 업데이트, 버그 패치 혹은 이벤트에 대한 정보가 있습니다. 자신의 의견도 달아보세요.',
        'Forum Overview' : '포럼 정리',
        'PokéHeroes - General' : 'PokéHeroes - 일반',
        'PokéHeroes - Game' : 'PokéHeroes - 게임',
        'Discussion' : '토론',
        //End forum stuff
        'Ancient Cave' : '고대 동굴',
        'Gem Collector' : '보석 수집가',
        'Share some news…' : '소식을 좀 공유해보세요…',
        ' Hours ago' : '시간 전',
        ' Hour ago' : '시간 전',
        ' Hours and' : '시간',
        ' Hour and' : '시간',
        ' Minutes and' : '분',
        ' Minute and' : '분',
        ' Minute ago' : '분 전',
        ' Minutes ago' : '분 전',
        ' Seconds ago' : '초 전',
        ' Second ago' : '초 전',
        'Year ago' : '년 전',
        'Years ago' : '년 전',
        'won' : '승',
        'lost' : '패',
        'Settings' : '설정',
        'Private Messages' : '메시지',
        'Share Widgets' : '공유 위젯',
        'Rules' : '규칙',
        'What is "interacting"?' : '"인터액션"이 뭔가요?',
        //Union room
        //interacting
        'Interacting on an Adoptable-website (like this one) is to visit a Pokémon\'s summary page and choosing an Interaction-Method.' : '이 사이트에서의 인터액션은 포켓몬의 페이지를 방문하여 인터액션 방법을 고르는 것입니다.', 'Those methods vary between eggs and Pokémon: While you can only' : '알들은 ', 'warm eggs' : '따뜻하게 해주는 것', ', you have two possibilities of how to interact with Pokémon: Training and Feeding.' : '밖에 할 수 없지만 포켓몬은 먹이를 주거나 훈련을 할 수 있습니다.',
        'Training is just spending some time with the Pokémon and teaching it some new tricks. Its Stat Value may increase, and it also gains some Experience Points.' : '훈련은 포켓몬과 시간을 보내면서 새 기술을 가르치는 겁니다. 능력치가 오를 수도 있고 경험치도 얻게 됩니다.',
        'To be able to feed one, you need a berry which the Pokémon likes. Every Pokémon has its own preferences. Note that the berry will be spent! Like at the training method, the Pokémon also gains some Experience Points.' : '먹이를 주려면 그 포켓몬이 좋아하는 베리를 먹여야 됩니다. 베리를 한번 사용하면 소모됩니다. 훈련과 같게 경험치를 얻게 됩니다.',
        //Why should I interact
        'Why should I interact?' : '왜 인터액션을 해야 하나요?',
        'Interacting with other users\' Pokémon has many advantages:' : '다른 유저의 포켓몬과 인터액션을 하는 것은 많은 좋은 점이 있습니다.',
        'You will sometimes receive a small amount of Pokédollar, which you can spend in the <a href="itemshop">Shop</a>.' : '인터액션 도중에 소량의 Pokédollar를 받을 수 있습니다. Pokédollar는 <a href="itemshop">샵</a>에서 쓸 수 있습니다.',
        //Interaction tips
        'BUT REMEMBER THE RULES: Using a Bot/Auto-Clicker/etc. is' : '하지만 꼭 기억하세요: 매크로를 쓰는 것은',
        'forbidden' : '절대로 안됩니다',
        //Union room end
        'Related Links' : '관련된 링크',
        'Referred users' : '초대한 유저',
        'Premium members' : '프리미엄 유저',
        'Staff members' : '스탭 멤버',
        'Friendlist' : '친구 목록',
        'Profile' : '프로필',
        'Change Avatar' : '프로필 사진 바꾸기',
        'Contact' : '연락',
        'Poll Manager' : '투표 관리',
        'Trainer ID' : '트레이너 ID',
        'Registration' : '계정 생성일',
        'Puzzle Collection' : '퍼즐 컬렉션',
        'Premium member' : '이 날짜까지 프리미엄:',
        'until' : '',
        'Time' : '시간',
        'Money' : '돈',
        'Total interactions' : '인터액션 갯수',
        'Trainer Battle Stats' : '트레이너 배틀 기록',
        'Starter Pokémon' : '스타터 포켓몬',
        'Edit Signature' : '사인 수정',
        'Userlist' : '유저 목록',
        'Ranklist' : '최고 기록',
        'View Recent Happenings' : '최근 일들 보기',
        'Owner:' : '주인:',
        'Union Room' : '유니언 룸',
        'Links' : '링크',
        'Filter' : '필터',
        'Social' : '소셜',
        'GIVE A HUG?' : '안아주실래요?',
        'FEED FREE BERRY!' : '무료 베리 먹이기!',
        'NEWS:' : '뉴스:',
        'News written by' : '글쓴이:',
        'News' : '뉴스',
        'Forum' : '포럼',
        'Rumbling' : '럼블링',
        'Pokéradar' : '포켓트레',
        'PokéRadar' : '포켓트레',
        'Notifications' : '알림',
        'Gifts' : '선물',
        'Auction House' : '경매장',
        'Global Trade Station' : '글로벌 트레이드 스테이션',
        'Town' : '마을',
        'Home' : '홈',
        'Index-Page' : '메인 페이지',
        'Badges' : '배지',
        
        'HeroWalker' : '히어로워커',
        'Other (' : '그 외 (',
        'Event Distribution' : '이벤트 배포',
        'Logged in as' : '로그인:',
        'Logout' : '로그아웃',
        'Remove Filters' : '필터 제거',
        'Level' : '레벨',
        'PokéHeroes Wiki' : 'PokéHeroes 위키 (영어)',
        'Pokémon names and sprites © 1995-2016 Nintendo, The Pokémon Company and Gamefreak' : '포켓몬 이름과 사진 © 1995-2016 닌텐도, The Pokemon Company와 Gamefreak',
        'This Website is © by Riako, 2013-2016' : '이 웹사이트 © Riako, 2013-2016. 한글번역 © Cliff_Armor 2016',
        //Lovemeter
        'The Lovemeter counts the total interactions around this site. As soon as it\'s filled, all interactions on the next day will count twice.' : '러브미터는 이 사이트의 모든 인터액션을 셉니다. 가득 차게 되면 다음날의 인터액션의 효과가 두배가 됩니다.',
        'Let\'s interact for a bonus day!' : '보너스를 위하여 인터액션을 합시다!', 
        'Lovemeter' : '러브미터',
        'What does it count?' : '이건 뭘 세나요?',
        'Current progress' : '현재 진행',
        'Interactions' : '인터액션'
    };











    //////////////////////////////////////////////////////////////////////////////
    // This is where the real code is
    // Don't edit below this
    //////////////////////////////////////////////////////////////////////////////

    var regexs = [], replacements = [],
        tagsWhitelist = ['BLOCKQUOTE', 'CODE', 'INPUT', 'TEXTAREA', 'A', 'TD', 'P'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // prepareRegex by JoeSimmons
    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words['']; // so the user can add each entry ending with a comma,
    // I put an extra empty key/value pair in the object.
    // so we need to remove it before continuing

    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);

            // add the search/needle/query
            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }

            // add the replacement
            replacements.push( words[word] );
        }
    }

    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if ( isTagOk(text.parentNode.tagName) ) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace( value, replacements[index] );
            });
        }
    }

}());