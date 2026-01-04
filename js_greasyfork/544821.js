// ==UserScript==
// @name        BA Torment Translate
// @namespace   bluearchive-torment
// @match       https://bluearchive-torment.netlify.app/*
// @grant       none
// @version     1.4
// @author      u/aisjsjdjdjskwkw
// @license     MIT
// @description Translate BA Torment to English
// @downloadURL https://update.greasyfork.org/scripts/544821/BA%20Torment%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/544821/BA%20Torment%20Translate.meta.js
// ==/UserScript==

// Full strings to replace
const strings = {
	"로딩 중...": "Loading...",

	// Sidebar
	"블루 아카이브 파티 찾기": "Blue Archive Team Finder",
	"메뉴": "Menu",
	"홈": "Home",
	"영상 분석": "Video Analysis",
	"계산기": "Calculator",
	"점수 계산기": "Score Calculator",

	// Home
	"파티 찾기": "Search",
	"파티 Filter": "Team Filters",
	"필터 Reset": "Reset Filters",
	"점수": "Score",
	"파티 수": "Number of teams",
	"파티": " Teams",
	"포함할 ": "Include",
	"내 캐릭터": " Students",
	"캐릭터를 선택하세요": "Select a student",
	"※ 성급 관계없이 보고 싶다면 부모 항목을 선택하세요.": "※ To include a student regardless of star level, select their name at the top.",
	"제외할 ": "Exclude",
	"제외할 캐릭터를 선택하세요": "Select a student to exclude",
	"조력자에서도 제외": "Exclude from assistants",
	"조력자": "Assistant",
	"조력자를 선택하세요": "Select an assistant",
	"조력자 포함 중복 허용": "Allow duplicate assistants",
	"Youtube 영상": "With Youtube video only",
	"검색 결과: 총 ": "Search results: ",
	"개": " teams",
	"개씩": (e) => { e.after(e.previousSibling); return "Show " },
	"위": "",  // "Rank"
	"점": "",  // "Points"
	"채널": "Channel",
	"영상": "Video",
	"5파티 이후 보기": "Show more teams",

	"요약": "Summary (Torment)",
	"요약 (루나틱)": "Summary (Lunatic)",
	"영상 분석 페이지로 이동": "Go to Video Analysis",
	"Platinum 클리어 비율": "Platinum Clears",
	"Platinum 컷": "Platinum Cutoffs",
	"파란색은 총력전 점수, 주황색은 현재 속성 점수예요.": "(GA only) Blue is the total score, orange is the selected armour type's score",
	"등": (e) => { e.after(e.previousSibling); return "#" },
	"필수 보유 학생": "Human Rights",
	"70% 이상의 플래티넘 유저가 본인 캐릭터를 사용했어요. 없으면 클리어나 경쟁이 힘들 수 있어요.": "Over 70% of platinum clears owned these students. Without them, clearing or speedrunning may be difficult.",
	"사용하지 않으면 점수 차가 큰 학생 3명이에요.": "These were the students with the largest impact on score when absent.",
	"최고: ": "Top Rank: ",
	"미사용: ": "Usage Cutoff: ",
	"Top 3 조력자": "Top 3 Assistants",
	"가장 많이 빌린 학생 3명이에요.": "These were the students who were borrowed the most.",
	"많이 쓰인 학생들": "High Usage Rate Students",
	"10% 이상 사용된 학생들이에요.": "These students were present in more than 10% of clears.",
	"Top 5 Party": "Top 5 Most Common Clears",
	"전용무기와 배치는 표시되지 않아요.": "Without considering student star level or positioning.",
	"명 사용": "uses",
	"최소 전용무기 클리어": "Least owned UE student clear",
	"최다 파티 클리어": "Highest Team Count Clear",
	"파티 비율": "Team Count Usage",
	"캐릭터 사용률": "Student Usage",
	"이름": "Name",
	"사용률 (%)": "Usage (%)",
	"캐릭터 성장 통계": "Student Investment Statistics",

	// Video Analysis
	"검색 결과: 총 ": "Search Results: ",
	"개": " videos",
	"전체": "All Raids",
	"분석 큐 상태": "Analysis Queue",
	"영상 분석은 AI로 1차 처리된 다음 수동으로 2차 확인을 하고 있어요.": "Video analysis is first done by AI then manually verified.",
	"실패": "Failed",
	"대기중": "Pending",
	"새로고침": "Refresh",
	"레이드: ": "Raid: ",
	"영상 분석 추가": "Submit a video",
	"영상 분석 큐에 추가": "Submit Video For Analysis",
	"레이드": "Raid",
	"레이드를 선택하세요": "Select a raid",
	"취소": "Cancel",
	"큐에 추가": "Submit",
	"레이드:": "Raid:",
	"파티 정보가 정확합ni다": "The team(s) used have been verified.",
	"목록으로": "Back",
	"HTML 복사": "Copy HTML",
	"편집": "Edit",
	// TODO: Video Analysis Edit page

	// Score Calculator
	"총력전/대결전 또는 종합전술시험의 점수를 계산할 수 있어요.": "Calculate scores for Total/Grand Assault or Joint Firing Drills.",
	"종합전술시험": "JFD",
	"총력전/대결전 점수 계산기": "TA/GA Score Calculator",
	"시간 또는 점수를 입력하면 나머지를 계산해요. (최대 3개)": "Enter a time to calculate the score, or score to calculate the required time. (Up to 3 scores)",
	"총 점수": "Total Score",
	"점수 #": "Score #",
	"난이도": "Difficulty",
	"시간 제한": "Time Limit",
	"3분": "3:00",
	"4분": "4:00",
	"4분 30초": "4:30",
	"시간 입력": "Time",
	"기본 점수: ": "Base Score: ",
	"1초당 점수: ": "Points per Second: ",
	"계산기 추가 (": "Add Calculator (",

	"종합전술시험 점수 계산기": "JFD Score Calculator",
	"플레이 시간 또는 점수를 입력하면 나머지를 계산합니다. (최대 3개)": "Enter a time to calculate the score, or score to calculate the required time. (Up to 3 scores)",
	"단계": "Stage",
	"3단계": "Stage 3",
	"4단계": "Stage 4",
	"제한 시간 (초)": "Time Limit (seconds)",
	"제한 시간은 60초 이상이어야 합니다.": "The time limit must be at least 60 seconds.",
	"실제 플레이 시간": "Time",

	// Info Menu
	"오류 제보 (이메일)": "Bug Report (Email)",
}

// Words to replace within strings
const words = [
	["총력전", "TA"],
	["대결전", "GA"],

	["비나", "Binah"],
	["헤세드", "Chesed"],
	["시로쿠로", "ShiroKuro"],
	["예로니무스", "Hieronymus"],
	["카이텐", "Kaiten"],
	["페로로지라", "Perorodzilla"],
	["호드", "Hod"],
	["고즈", "Goz"],
	["그레고리오", "Gregorius"],
	["호버크래프트", "Hovercraft"],
	["쿠로카게", "Kurokage"],
	["게부라", "Geburah"],
	["예소드", "Yesod"],

	["실내", "Indoors"],
	["야외", "Outdoors"],
	["시가지", "Urban"],

	["경장갑,", "Red "],
	["중장갑,", "Yellow "],
	["특수장갑,", "Blue "],
	["탄력장갑,", "Purple "],

	["인세인", "Insane"],
	["토먼트", "Torment"],
	["루나틱", "Lunatic"],
	["총합", "Total"],

	[/전용무기 (\d+)개로 클리어했어요./, "The clear with the least owned student(s) with UE used $1."],
	[/(\d+)파티로 클리어했어요./, "The clear with the most teams used $1 team(s)."],
	[/In (\d+)/, "Top $1"],
	[/(\d)PT(\+?)/, "$1T$2"],

	[/(\d+)개 이상의 총력전 영상이 준비되어 있어요./, "Over $1 Total Assault battle videos are available."],

	["5★ 무기0", "5★"],
	["5★ 무기", "UE"],

	["1성", "1★"], ["2성", "2★"], ["3성", "3★"], ["4성", "4★"], ["5성", "5★"],
	["전1", "UE1"], ["전2", "UE2"], ["전3", "UE3"], ["전4", "UE4"], ["전5", "UE5"],

	["아","a"], ["바","ba"], ["비","bi"], ["부","bu"], ["체","che"], ["치","chi"], ["데","de"], ["도","do"], ["에","e"], ["후","fu"], ["게","ge"], ["기","gi"], ["구","gu"], ["하","ha"], ["히","hi"], ["호","ho"], ["이","i"], ["지","ji"], ["죠","jo"], ["주","ju"], ["준","jun"], ["카","ka"], ["칸","kan"], ["키","ki"], ["코","ko"], ["쿠","ku"], ["쿄","kyou"], ["마","ma"], ["메","me"], ["미","mi"], ["모","mo"], ["무","mu"], ["나","na"], ["네","ne"], ["니","ni"], ["노","no"], ["오","o"], ["피","pi"], ["라","ra"], ["레","re"], ["렌","ren"], ["리","ri"], ["린","rin"], ["로","ro"], ["루","ru"], ["사","sa"], ["세","se"], ["시","shi"], ["쇼","shou"], ["스","su"], ["타","ta"], ["테","te"], ["텐","ten"], ["토","to"], ["츠","tsu"], ["우","u"], ["와","wa"], ["야","ya"], ["요","yo"], ["유","yu"], ["조","zo"], ["즈","zu"],

	["아루", "Aru"],
	["에이미", "Eimi"],
	["하루나", "Haruna"],
	["히후미", "Hifumi"],
	["히나", "Hina"],
	["호시노", "Hoshino"],
	["이오리", "Iori"],
	["마키", "Maki"],
	["네루", "Neru"],
	["이즈미", "Izumi"],
	["시로코", "Shiroko"],
	["슌", "Shun"],
	["스미레", "Sumire"],
	["츠루기", "Tsurugi"],
	["아카네", "Akane"],
	["치세", "Chise"],
	["아카리", "Akari"],
	["하스미", "Hasumi"],
	["노노미", "Nonomi"],
	["카요코", "Kayoko"],
	["무츠키", "Mutsuki"],
	["준코", "Junko"],
	["세리카", "Serika"],
	["츠바키", "Tsubaki"],
	["유우카", "Yuuka"],
	["하루카", "Haruka"],
	["아스나", "Asuna"],
	["코토리", "Kotori"],
	["스즈미", "Suzumi"],
	["피나", "Pina"],
	["히비키", "Hibiki"],
	["카린", "Karin"],
	["사야", "Saya"],
	["아이리", "Airi"],
	["후우카", "Fuuka"],
	["하나에", "Hanae"],
	["하레", "Hare"],
	["우타하", "Utaha"],
	["아야네", "Ayane"],
	["치나츠", "Chinatsu"],
	["코타마", "Kotama"],
	["주리", "Juri"],
	["세리나", "Serina"],
	["시미코", "Shimiko"],
	["요시미", "Yoshimi"],
	["마시로", "Mashiro"],
	["이즈나", "Izuna"],
	["시즈코", "Shizuko"],
	["아리스", "Aris"],
	["미도리", "Midori"],
	["모모이", "Momoi"],
	["체리노", "Cherino"],
	["노도카", "Nodoka"],
	["유즈", "Yuzu"],
	["아즈사", "Azusa"],
	["하나코", "Hanako"],
	["코하루", "Koharu"],
	["아즈사(수영복)", "S.Azusa"],
	["마시로(수영복)", "S.Mashiro"],
	["츠루기(수영복)", "S.Tsurugi"],
	["히후미(수영복)", "S.Hifumi"],
	["히나(수영복)", "S.Hina"],
	["이오리(수영복)", "S.Iori"],
	["이즈미(수영복)", "S.Izumi"],
	["시로코(라이딩)", "C.Shiroko"],
	["슌(어린이)", "Shun (Small)"],
	["키리노", "Kirino"],
	["사야(사복)", "C.Saya"],
	["네루(바니걸)", "B.Neru"],
	["카린(바니걸)", "B.Karin"],
	["아스나(바니걸)", "B.Asuna"],
	["나츠", "Natsu"],
	["마리", "Mari"],
	["하츠네 미쿠", "Hatsune Miku"],
	["아코", "Ako"],
	["체리노(온천)", "O.Cherino"],
	["치나츠(온천)", "O.Chinatsu"],
	["토모에", "Tomoe"],
	["노도카(온천)", "O.Nodoka"],
	["아루(새해)", "NY.Aru"],
	["무츠키(새해)", "NY.Mutsuki"],
	["세리카(새해)", "NY.Serika"],
	["와카모", "Wakamo"],
	["후부키", "Fubuki"],
	["세나", "Sena"],
	["치히로", "Chihiro"],
	["미모리", "Mimori"],
	["우이", "Ui"],
	["히나타", "Hinata"],
	["마리나", "Marina"],
	["미야코", "Miyako"],
	["사키", "Saki"],
	["미유", "Miyu"],
	["카에데", "Kaede"],
	["이로하", "Iroha"],
	["미치루", "Michiru"],
	["츠쿠요", "Tsukuyo"],
	["미사키", "Misaki"],
	["히요리", "Hiyori"],
	["아츠코", "Atsuko"],
	["와카모(수영복)", "S.Wakamo"],
	["노노미(수영복)", "S.Nonomi"],
	["아야네(수영복)", "S.Ayane"],
	["호시노(수영복)", "S.Hoshino"],
	["시즈코(수영복)", "S.Shizuko"],
	["이즈나(수영복)", "S.Izuna"],
	["치세(수영복)", "S.Chise"],
	["사오리", "Saori"],
	["모에", "Moe"],
	["카즈사", "Kazusa"],
	["코코나", "Kokona"],
	["우타하(응원단)", "C.Utaha"],
	["노아", "Noa"],
	["히비키(응원단)", "C.Hibiki"],
	["아카네(바니걸)", "B.Akane"],
	["유우카(체육복)", "T.Yuuka"],
	["마리(체육복)", "T.Mari"],
	["하스미(체육복)", "T.Hasumi"],
	["히마리", "Himari"],
	["시구레", "Shigure"],
	["세리나(크리스마스)", "C.Serina"],
	["하나에(크리스마스)", "C.Hanae"],
	["하루나(새해)", "NY.Haruna"],
	["후우카(새해)", "NY.Fuuka"],
	["준코(새해)", "NY.Junko"],
	["미네", "Mine"],
	["미카", "Mika"],
	["메구", "Megu"],
	["칸나", "Kanna"],
	["사쿠라코", "Sakurako"],
	["토키", "Toki"],
	["나기사", "Nagisa"],
	["코유키", "Koyuki"],
	["카요코(새해)", "NY.Kayoko"],
	["하루카(새해)", "NY.Haruka"],
	["카호", "Kaho"],
	["아리스(메이드)", "M.Aris"],
	["토키(바니걸)", "B.Toki"],
	["유즈(메이드)", "M.Yuzu"],
	["레이사", "Reisa"],
	["루미", "Rumi"],
	["미나", "Mina"],
	["미노리", "Minori"],
	["미야코(수영복)", "S.Miyako"],
	["사키(수영복)", "S.Saki"],
	["미유(수영복)", "S.Miyu"],
	["시로코(수영복)", "S.Shiroko"],
	["우이(수영복)", "S.Ui"],
	["히나타(수영복)", "S.Hinata"],
	["코하루(수영복)", "S.Koharu"],
	["하나코(수영복)", "S.Hanako"],
	["미모리(수영복)", "S.Mimori"],
	["메루", "Meru"],
	["모미지", "Momiji"],
	["코토리(응원단)", "C.Kotori"],
	["하루나(체육복)", "T.Haruna"],
	["이치카", "Ichika"],
	["카스미", "Kasumi"],
	["시구레(온천)", "O.Shigure"],
	["미사카 미코토", "Misaka Mikoto"],
	["쇼쿠호 미사키", "Shokuhou Misaki"],
	["사텐 루이코", "Saten Ruiko"],
	["유카리", "Yukari"],
	["렌게", "Renge"],
	["키쿄", "Kikyou"],
	["에이미(수영복)", "S.Eimi"],
	["코타마(캠핑)", "C.Kotama"],
	["하레(캠핑)", "C.Hare"],
	["아코(드레스)", "D.Ako"],
	["이부키", "Ibuki"],
	["마코토", "Makoto"],
	["히나(드레스)", "D.Hina"],
	["카요코(드레스)", "D.Kayoko"],
	["아루(드레스)", "D.Aru"],
	["아카리(새해)", "NY.Akari"],
	["우미카", "Umika"],
	["츠바키(가이드)", "G.Tsubaki"],
	["카즈사(밴드)", "B.Kazusa"],
	["요시미(밴드)", "B.Yoshimi"],
	["아이리(밴드)", "B.Airi"],
	["키라라", "Kirara"],
	["모모이(메이드)", "M.Momoi"],
	["미도리(메이드)", "M.Midori"],
	["세리카(수영복)", "S.Serika"],
	["칸나(수영복)", "S.Kanna"],
	["후부키(수영복)", "S.Fubuki"],
	["키리노(수영복)", "S.Kirino"],
	["모에(수영복)", "S.Moe"],
	["호시노(무장)", "B.Hoshino"],
	["시로코*테러", "Kuroko"],
	["아츠코(수영복)", "S.Atsuko"],
	["사오리(수영복)", "S.Saori"],
	["히요리(수영복)", "S.Hiyori"],
	["마리나(치파오)", "Q.Marina"],
	["토모에(치파오)", "Q.Tomoe"],
	["레이죠", "Reijo"],
	["키사키", "Kisaki"],
	["마리(아이돌)", "I.Mari"],
	["사쿠라코(아이돌)", "I.Sakurako"],
	["미네(아이돌)", "I.Mine"],
	["치아키", "Chiaki"],
	["사츠키", "Satsuki"],
	["유우카(파자마)", "PJ.Yuuka"],
	["노아(파자마)", "PJ.Noa"],
	["세이아", "Seia"],
	["아스나(교복)", "U.Asuna"],
	["카린(교복)", "U.Karin"],
	["네루(교복)", "U.Neru"],
	["리오", "Rio"],
	["마키(캠핑)", "C.Maki"],
	["세나(사복)", "C.Sena"],
	["주리(아르바이트)", "PT.Juri"],
	["이즈미(새해)", "NY.Izumi"],
	["레이", "Rei"],
	["스미레(아르바이트)", "PT.Sumire"],
	["사오리(드레스)", "D.Saori"],
	["히카리", "Hikari"],
	["노조미", "Nozomi"],
	["아오바", "Aoba"],
	["피나(가이드)", "G.Pina"],
	["나구사", "Nagusa"],
	["니야", "Niya"],
	["나츠(밴드)", "B.Natsu"],
	["유카리(수영복)", "S.Yukari"],
	["렌게(수영복)", "S.Renge"],
	["키쿄(수영복)", "S.Kikyou"],
	["세이아(수영복)", "S.Seia"],
	["하스미(수영복)", "S.Hasumi"],
	["이치카(수영복)", "S.Ichika"],
	["나기사(수영복)", "S.Nagisa"],
	["미카(수영복)", "S.Mika"],
	["에리", "Eri"],
	["카노에", "Kanoe"],
	["미사키(수영복)", "S.Misaki"],
	["미요", "Miyo"],
	["후유", "Fuyu"],
	["리츠", "Ritsu"],
	["레이사(매지컬)", "M.Reisa"],
	["스즈미(매지컬)", "M.Suzumi"],
	["라브", "Rabu"],
	["스바루", "Subaru"],
	["타카네", "Takane"],
	["야쿠모", "Yakumo"],
	["츠쿠요(드레스)", "D.Tsukuyo"],
	["미치루(드레스)", "D.Michiru"],

	["무장", "Armed"],
	["밴드", "Band"],
	["바니걸", "Bunny"],
	["캠핑", "Camp"],
	["사복", "Casual"],
	["응원단", "Cheer Squad"],
	["크리스마스", "Christmas"],
	["라이딩", "Cycling"],
	["드레스", "Dress"],
	["가이드", "Guide"],
	["온천", "Hot Spring"],
	["메이드", "Maid"],
	["새해", "New Year"],
	["아르바이트", "Part-time Job"],
	["파자마", "Pajamas"],
	["아이돌", "Pop Idol"],
	["치파오", "Qipao"],
	["교복", "School"],
	["어린이", "Small"],
	["수영복", "Swimsuit"],
	["러", "Terror"],
	["체육복", "Track"],
].sort((a, b) => a[0].toString().length < b[0].toString().length)  // Longest words first to avoid erroneously replacing substrings

// DOM transformations
// [css selector]: (e: Element) => {}
const transforms = {
	// Home/Search: Score filters
	"input[placeholder='최소'": (e) => e.placeholder = "Minimum",
	"input[placeholder='최대'": (e) => e.placeholder = "Maximum",

	// Home/Search: Student search boxes
	"input[placeholder='검색...']": (e) => (e.placeholder = "Search...") && transliteratify(e),

	// Home/Search: make search results display limit text fit
	".w-23": (e) => e.style.width = "calc(var(--spacing)*26)",

	// Home/Summary/Student Investment Statistics: Student search box
	"input[placeholder='학생 검색...']": (e) => (e.placeholder = "Search...") && transliteratify(e),

	// Home/Summary/Student Investment Statistics: translate investments
	"span[class^='font-medium text-sm ']": (e) => new MutationObserver(() => {
		const [stars, text, ue] = e.childNodes
		if (ue.textContent === "0") {
			if (stars.textContent === "") stars.textContent = "5"
			// The MutationObserver triggers itself, so these extra ifs are needed
			if (text.textContent !== "★") text.textContent = "★"
			if (ue.textContent !== "") ue.textContent = ""
		} else if (ue.textContent !== "") {
			if (stars.textContent !== "") stars.textContent = ""
			if (text.textContent !== "UE") text.textContent = "UE"
		}
	}).observe(e, { characterData: true, subtree: true }),

	// Video Analysis: YouTube Search button
	"a[title='YouTube에서 검색']": (e) => e.title = "Search on YouTube",

	// Score Calculator: Time input box
	"input[placeholder='01:23 또는 01:23.456']": (e) => e.placeholder = "01:23 or 01:23.456",

	// Score Calculator/JFD: Time Limit input box
	"input[placeholder='60 이상']": (e) => e.placeholder = "60 or more",
}

// Romanised sounds to Hangul
const transliterations = [
	// Kana (this was generated by ChatGPT so I don't know how accurate it is)
	["a",  "아"], ["i",  "이"], ["u",  "우"], ["e",  "에"], ["o",  "오"],
	["ka", "카"], ["ki", "키"], ["ku", "쿠"], ["ke", "케"], ["ko", "코"],
	["ga", "가"], ["gi", "기"], ["gu", "구"], ["ge", "게"], ["go", "고"],
	["sa", "사"], ["shi", "시"], ["su", "스"], ["se", "세"], ["so", "소"],
	["ja", "자"], ["ji", "지"], ["ju", "주"],               ["zo", "조"],
	["ta", "타"], ["chi", "치"], ["tsu", "츠"], ["te", "테"], ["to", "토"],
	["da", "다"], ["di", "디"], ["zu", "즈"], ["de", "데"], ["do", "도"],
	["na", "나"], ["ni", "니"], ["nu", "누"], ["ne", "네"], ["no", "노"],
	["ha", "하"], ["hi", "히"], ["fu", "후"], ["he", "헤"], ["ho", "호"],
	["ba", "바"], ["bi", "비"], ["bu", "부"], ["be", "베"], ["bo", "보"],
	["pa", "파"], ["pi", "피"], ["pu", "푸"], ["pe", "페"], ["po", "포"],
	["ma", "마"], ["mi", "미"], ["mu", "무"], ["me", "메"], ["mo", "모"],
	["ya", "야"], ["yu", "유"], ["yo", "요"],
	["ra", "라"], ["ri", "리"], ["ru", "루"], ["re", "레"], ["ro", "로"],
	["wa", "와"], ["wo", "오"], ["nn", "ㄴ"],
	["kyo", "쿄"], ["sho", "쇼"],

	// Students
	["che", "체"],     // [che]rino
	["주n", "준"],     // [jun]ko
	["카ㄴ아", "칸나"], // kanna
	["테n", "텐"],      // sa[ten]
	["레nge", "렌게"],  // renge
	["쿠로코", "시로코*테러"], // kuroko
	["shun", "슌"],

	// Alts
	["(아rmed|바ttle)", "무장"], // armed/battle
	["바nd", "밴드"], // band
	["(부ㄴy|바니)", "바니걸"], // bunny
	["camp", "캠핑"],
	["casual", "사복"],
	["체에r", "응원단"], // cheer
	["(christmas|x)", "크리스마스"],
	["(cy|(리|라이)디ng)", "라이딩"], // cycling/riding
	["dress", "드레스"],
	["구이데", "가이드"], // guide
	["(hs|호t ?spring)", "온천"], // hot spring
	["이도l", "아이돌"], // idol
	["(마|메)이d", "메이드"], // maid
	["(ny|네w ?year)", "새해"], // new year
	["pj", "파자마"], // pajama
	["(pt|파rt ?time)", "아르바이트"], // part time
	["q", "치파오"], // qipao
	["(school|jk|우니form)", "교복"], // school
	["small", "어린이"],
	["swim", "수영복"], // swimsuit
	["테rror", "러"], // terror
	["track", "체육복"],
].map(h => [
	new RegExp("(^|[^a-z])" + h[0], "gi"),
	"$1" + h[1]
])

const observer = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(translateTree)))
observer.observe(document.body, { childList: true, subtree: true })
translateTree(document.body)

function translateTree(root) {
	switch (root.nodeType) {
	case Node.ELEMENT_NODE:
		transformNode(root)
		break
	case Node.TEXT_NODE:
		translate(root)
		break
	}

	const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
	while (walker.nextNode()) {
		const node = walker.currentNode
		if (node.nodeType === Node.TEXT_NODE) {
			new MutationObserver(() => translate(node)).observe(node, { characterData: true })
			// console.log(`"${node.textContent}" --> "${translate(node)}"`, node)
			translate(node)
			continue
		}

		transformNode(node)
	}
}

function translate(text) {
	if (text.parentElement.tagName === "SCRIPT") return

	// Ignore announcement banner
	if (text.parentElement.closest("div[role=alert]")) return

	let content = text.textContent
	const translation = strings[content]
	if (translation !== undefined) {
		return text.textContent = typeof translation === "function" ? translation(text) : translation
	}

	for (const [pattern, translation] of words) {
		if (typeof pattern === "string" ? content.includes(pattern) : content.match(pattern)) {
			content = typeof translation === "function"
				? translation(text)
				: content.replace(pattern, translation)
		}
	}

	if (text.textContent !== content) {
		return text.textContent = content
	}

	return null
}

function transformNode(node) {
	for (const [css, transform] of Object.entries(transforms)) {
		if (node.matches(css)) {
			transform(node)
			return
		}
	}
}

function transliteratify(input) {
	const { onChange } = input[Object.keys(input).find(k => k.startsWith("__reactProps$"))]

	input.oninput = (e) => {
		const { value } = input
		if (value === "" || e.data === null) return

		let transliterated = value
		for (const [r, h] of transliterations) {
			transliterated = transliterated.replaceAll(r, h)
		}

		input.value = transliterated
		onChange({ target: { value: transliterated } })
	}
}
