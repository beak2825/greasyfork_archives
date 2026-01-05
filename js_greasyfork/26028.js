// ==UserScript==
// @name        Kharus Chat Ban Patch
// @namespace   Kharus Chat Patch
// @match       https://kharus.com/pages/chat*
// @match       http://kharus.com/pages/chat*
// @description:en for Kharus Chatting
// @version     20161227.007

// @description for Kharus Chatting
// @downloadURL https://update.greasyfork.org/scripts/26028/Kharus%20Chat%20Ban%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/26028/Kharus%20Chat%20Ban%20Patch.meta.js
// ==/UserScript==

function ChatBan1() {
$('.nick:contains("Death"), .nick:contains("Ho"), .nick:contains("Penguin"), .nick:contains("Queen"), .nick:contains("TT"), .nick:contains("가온나래"), .nick:contains("갯히잉"), .nick:contains("갯힝"), .nick:contains("거짓말"), .nick:contains("검술")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan2, 300);}
function ChatBan2() {
$('.nick:contains("검신하세요"), .nick:contains("곰곰"), .nick:contains("과르네리"), .nick:contains("광블리"), .nick:contains("교촌치킨"), .nick:contains("구구구구구구"), .nick:contains("구루구루"), .nick:contains("구름동동"), .nick:contains("굿굿맨"), .nick:contains("그대는")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan3, 300);}
function ChatBan3() {
$('.nick:contains("김둥둥"), .nick:contains("껑졍"), .nick:contains("꼬맹"), .nick:contains("꽃장식소녀"), .nick:contains("뀨르"), .nick:contains("나는나비"), .nick:contains("나이트메어인"), .nick:contains("나인간"), .nick:contains("날아라뿅알"), .nick:contains("네네홍갓")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan4, 300);}
function ChatBan4() {
$('.nick:contains("놀러와써요"), .nick:contains("누델"), .nick:contains("뉴비토끼"), .nick:contains("뉴트론"), .nick:contains("니알리"), .nick:contains("다현"), .nick:contains("달라니까"), .nick:contains("데이어"), .nick:contains("도넛"), .nick:contains("도도고키드")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan5, 300);}
function ChatBan5() {
$('.nick:contains("도비"), .nick:contains("도주경로"), .nick:contains("도축"), .nick:contains("동구아빠"), .nick:contains("디유"), .nick:contains("란슬롯"), .nick:contains("러미"), .nick:contains("러브"), .nick:contains("레히인"), .nick:contains("려호"), .nick:contains("로가")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan6, 300);}
function ChatBan6() {
$('.nick:contains("로록"), .nick:contains("록시"), .nick:contains("루테아"), .nick:contains("리븐"), .nick:contains("린"):not(:contains("류하린")), .nick:contains("마도병기니아"), .nick:contains("마이로드"), .nick:contains("매르시"), .nick:contains("멍"), .nick:contains("목새"), .nick:contains("문지기")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan7, 300);}
function ChatBan7() {
$('.nick:contains("뭉게"), .nick:contains("뭉식이"), .nick:contains("믈흰"), .nick:contains("미르"), .nick:contains("미선"), .nick:contains("미수킹"), .nick:contains("민군주"), .nick:contains("밍쨩다이스키"), .nick:contains("밍크리"), .nick:contains("바르앵"), .nick:contains("반하다")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan8, 300);}
function ChatBan8() {
$('.nick:contains("벗먹도"), .nick:contains("베아트리체"), .nick:contains("벨라"), .nick:contains("별난바사쥬"), .nick:contains("블랙쉽"), .nick:contains("비류"), .nick:contains("비터"), .nick:contains("빵끈"), .nick:contains("사나"), .nick:contains("삭제"), .nick:contains("산무")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan9, 300);}
function ChatBan9() {
$('.nick:contains("산호"), .nick:contains("상꿀"), .nick:contains("서계피"), .nick:contains("석포"), .nick:contains("선현짱"), .nick:contains("세룬"), .nick:contains("세르오스"), .nick:contains("셰인"), .nick:contains("소년"):not(:contains("우주소년")), .nick:contains("소라"), .nick:contains("소마")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan10, 300);}
function ChatBan10() {
$('.nick:contains("솔빛바다멸치"), .nick:contains("순수"), .nick:contains("슈"), .nick:contains("스케얼"), .nick:contains("구루메"), .nick:contains("귀뚱"), .nick:contains("도비갓"), .nick:contains("미녀") , .nick:contains("사토미") , .nick:contains("성소") , .nick:contains("양념장어")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan11, 300);}
function ChatBan11() {
$('.nick:contains("지진") , .nick:contains("스타빌드") , .nick:contains("스튜어트") , .nick:contains("슥삭") , .nick:contains("슬라임") , .nick:contains("시간여유") , .nick:contains("신민아") , .nick:contains("심심한가") , .nick:contains("싸치") , .nick:contains("아델아도니스"), .nick:contains("아르킨")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan12, 300);}
function ChatBan12() {
$('.nick:contains("아르티엔") , .nick:contains("아리에스") , .nick:contains("아슷바뷰") , .nick:contains("아아") , .nick:contains("안녕하시든가") , .nick:contains("알래스카연어") , .nick:contains("앙김웍지") , .nick:contains("앙앙앙") , .nick:contains("약수터") , .nick:contains("양과") , .nick:contains("양사무엘")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan13, 300);}
function ChatBan13() {
$('.nick:contains("에나츠") , .nick:contains("엘르시온") , .nick:contains("연꽃") , .nick:contains("연지곤지나지") , .nick:contains("영썽") , .nick:contains("영웅제왕") , .nick:contains("오리가미") , .nick:contains("오스발") , .nick:contains("온새미로") , .nick:contains("올빼밍") , .nick:contains("옴므")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan14, 300);}
function ChatBan14() {
$('.nick:contains("와전") , .nick:contains("왕"):not(:contains("낚시왕")) , .nick:contains("잇신") , .nick:contains("유달님") , .nick:contains("이가네장손") , .nick:contains("이지금") , .nick:contains("TT") , .nick:contains("TT") , .nick:contains("TT") , .nick:contains("유한조") , .nick:contains("유햇님") , .nick:contains("음주코딩")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan15, 300);}
function ChatBan15() {
$('.nick:contains("응미얀마") , .nick:contains("이효리") , .nick:contains("자룡") , .nick:contains("자매") , .nick:contains("자비없음") , .nick:contains("저글링네마리") , .nick:contains("전하사") , .nick:contains("정채연") , .nick:contains("제르") , .nick:contains("주금") , .nick:contains("주김") , .nick:contains("주니")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan16, 300);}
function ChatBan16() {
$('.nick:contains("주작") , .nick:contains("주제") , .nick:contains("지수"):not(:contains("김지수")) , .nick:contains("지아야") , .nick:contains("지존짱짱수범") , .nick:contains("진서위상") , .nick:contains("진실") , .nick:contains("차차차") , .nick:contains("초밥킹") , .nick:contains("초코") , .nick:contains("카나데") , .nick:contains("카레돈까스")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan17, 300);}
function ChatBan17() {
$('.nick:contains("카쨩") , .nick:contains("캐릭터") , .nick:contains("크레센트") , .nick:contains("크림") , .nick:contains("킹스발") , .nick:contains("토끼"):not(:contains("달토끼")) , .nick:contains("토요") , .nick:contains("토우마카즈사") , .nick:contains("티모벌레") , .nick:contains("평선") , .nick:contains("포케"), .nick:contains("퐁당퐁당")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan18, 300);}
function ChatBan18() {
$('.nick:contains("푸르른공원"), .nick:contains("푸쨩"), .nick:contains("퓨코"), .nick:contains("퓨코퓨코퓨"), .nick:contains("프레비오스"), .nick:contains("프로젝트제드"), .nick:contains("하늘잠자리"), .nick:contains("하루종일"), .nick:contains("하루하루"), .nick:contains("한결"), .nick:contains("헐헐너"), .nick:contains("형")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan19, 300);}
function ChatBan19() {
$('.nick:contains("화교꼬부기"), .nick:contains("화백"), .nick:contains("회계원리"), .nick:contains("후치"), .nick:contains("휴대폰"), .nick:contains("흑마법사"), .nick:contains("히유키")').toggleClass('nick nic').css({'text-decoration' : 'underline'});
setTimeout(ChatBan1, 300);}

setTimeout(ChatBan1, 100);
