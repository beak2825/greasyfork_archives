// ==UserScript==
// @name        Arona.AI Translate
// @namespace   arona.ai
// @match       https://arona.ai/*raidreport
// @grant       none
// @version     1.3
// @author      u/aisjsjdjdjskwkw
// @license     MIT
// @description Translate arona.ai to English
// @downloadURL https://update.greasyfork.org/scripts/543895/AronaAI%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/543895/AronaAI%20Translate.meta.js
// ==/UserScript==

// Full strings to replace
const strings = {
	"이 페이지는 Arona.AI에서 \"실험실\" 메뉴를 통해 제공되는 개발 중인 기능으로, 예고 없이 기능의 일부 또는 UI가 변경 또는 삭제되거나 일정 시간 작동을 멈추는 현상 등이 발생할 수 있습니다. 대부분의 오류는 일정 시간 뒤 새로고침으로 해결됩니다.": "This page is an experimental preview provided by Arona.AI through the \"Labs\" menu. Some features or UI may change or be deleted without notice, or may stop working temporarily. Most errors can be resolved by refreshing the page after a short period of time.",
	"현재 진행 중인 대결전의 실시간에 가까운 통계를 보고 싶으시다면": "For near real-time statistics on the current Grand Assault, use the",
	"대결전 그래프(개발 버전)": "Grand Assault Graph (Experimental Preview)",
	"현재 진행 중인 총력전의 실시간에 가까운 통계를 보고 싶으시다면": "For near real-time statistics on the current Total Assault, use the",
	"총력전 그래프(개발 버전)": "Total Assault Graph (Experimental Preview)",
	"기능을 이용해주세요.": "page.",
	"입장": "Select",
	"조회 목록": "Edit Layout",
	"시간별 등수 변화 추이": "Final Ranking Over Time",
	"등급별 점수 변화 추이": "Division Cutoff Score Over Time",
	"난이도별 인원 수 변화 추이": "Difficulty Clear Count Over Time",
	"최종 인원 분포 선버스트": "Final Rankings Distribution",
	"인원 분포 선버스트의 파티 수는 실제 사용 파티 수가 아닌 걸린 시간을 기준으로 합니다. 예를 들어 파티 3개를 사용했더라도 5분이 소요되었다면 실질 2파티로 간주합니다.": "The number of teams shown is based on the time taken, not the actual number of teams. For example, if you use 3 teams but clear in 5 minutes, it is displayed as a 2 team clear.",
	"인원 분포 선버스트의 난이도별 인원은 실제 클리어 현황이 아닌 점수를 기준으로 합니다. 점수 합계 기준에 따라 분류되며 실제 클리어 난이도와는 다소 상이할 수 있습니다.": "The number of people shown in each difficulty is based on the score, not the actual difficulty cleared. Clears are classified based on the total score and may differ from the actual difficulties cleared.",
	"특정 순위별 점수": "Scores by Ranking",
	"순위": "Ranking",
	"점수": "Score",
	"전부": "Show All",
	"추가 설정 ": "",  // "Additional Settings"
	"열기": "Open Settings",
	"닫기": "Close Settings",
	"등급별 커트라인": "Division Cutoff Scores",
	"등급별 커트라인 보기": "Always show cutoff scores",
	"난이도별 최고/최저점": "Highest/Lowest Scores",
	"최고점": "Highest",
	"최저점": "Lowest",
	"기타 등수 조회": "Rankings",
	"위 ~": "~",
	"위 (": "(Every",
	"단위)": "th rank)",
	"등급별 커트라인 및 동 난이도 1위와의 시간 차": "Division Cutoff Score vs Fastest Clear on the Same Difficulty",
	"등급별 컷과 동 난이도 1위 시간차": "Division Cutoff Score vs Fastest Clear on the Same Difficulty",
	"경장갑": "Red Armour",
	"중장갑": "Yellow Armour",
	"특수장갑": "Blue Armour",
	"탄력장갑": "Purple Armour",
	"통계 표시 범위": "Display statistics for",
	"IN ": "Top ",
	"캐릭터/파티 사용 통계": "Student/Team Usage Statistics",
	" 캐릭터 사용 통계": " Student Usage Statistics",
	"캐릭터": "Student",
	"사용률": "Usage Rate",
	"직접 사용": "Owned",
	"조력자 사용": "Borrowed",
	" 파티 사용 통계": " Team Count Statistics",
	"비율": "Ratio",
	" 위치별 캐릭터 사용": " Student Usage by Ranking",
	"위  현황": "Ranks ",
	"캐릭터를 선택해주세요!": "Select a student to display statistics",

	"조합 직접 검색": "Most Common Teams/Team Search",
	"많이 사용한 조합": "Most Common Teams",
	"보여줄 조합 수": "Display count",
	"건": " Teams",
	"회 사용": " uses",

	"직접 검색": "Team Search",
	"데이터 범위 선택": "Select a data range",
	"최대 점수": "Maximum Score",
	"최소 점수": "Minimum Score",
	"학생 풀 조건": "Student Filters",
	"(추가한 조건이 없어요)": "(None)",
	"학생 조건 추가": "Add a student filter",
	"추가": "Add",
	"미포함": "Exclude",
	"일치": "=",
	"이상": "≥",
	"이하": "≤",
	"조건": "Filter",
	"조건을 느슨하게 체크": "Loose filter",
	"느슨하게 체크 시, 이상/이하 조건에서 미포함도 충족으로 판단하고, 조력자 사용도 고려하게 됩니다.": "When filtering loosely, any ≥ or ≤ filters will be ignored.",
	"위": "",  // "Rank"
	"★3 이하": "3★ or less",
	"★4 사용": "4★",
	"★5 사용": "5★",
	"무기 ★1 사용": "UE1",
	"무기 ★2 사용": "UE2",
	"무기 ★3 사용": "UE3",
	"무기 ★4 사용": "UE4",
	"무기 ★5 사용": "UE5",

	"개 파티 사용": (e) => " team" + (e.previousSibling.textContent === "1" ? "" : "s"),
	"명": (e) => " clear" + (e.previousSibling.textContent === "1" ? "" : "s"),

	"* 데이터 크기가 커지면 속도가 저하될 수 있습니다.": "* As the data size increases, the speed may decrease.",
}

// Words to replace within strings
const words = [
	["비나", "Binah"],
	["헤세드", "Chesed"],
	["시로&쿠로", "Shiro & Kuro"],
	["페로로지라", "Perorodzilla"],
	["호드", "Hod"],
	["고즈", "Goz"],
	["그레고리오", "Gregorius"],
	["예로니무스", "Hieronymus"],
	["호버크래프트", "Hovercraft"],
	["쿠로카게", "Kurokage"],
	["게부라", "Geburah"],

	["실내전", "Indoors"],
	["야외전", "Outdoors"],
	["시가지전", "Urban"],

	[/(\d)(\+?)PT/, "$1T$2"],  // "Party" -> "Team"
	[/(\d+)개씩/, "Show $1"],
	["편성", "Team"],
	["무기", "UE"],
	["사용", ""],  // "Use/s"
	["미포함", "Excluded"],
	["이상", "≥"],
	["이하", "≤"],
	["전", "UE"],
	["성", "★"],

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
	["키리노", "Kirino"],
	["나츠", "Natsu"],
	["마리", "Mari"],
	["하츠네 미쿠", "Hatsune Miku"],
	["아코", "Ako"],
	["토모에", "Tomoe"],
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
	["사오리", "Saori"],
	["모에", "Moe"],
	["카즈사", "Kazusa"],
	["코코나", "Kokona"],
	["노아", "Noa"],
	["히마리", "Himari"],
	["시구레", "Shigure"],
	["미네", "Mine"],
	["미카", "Mika"],
	["메구", "Megu"],
	["칸나", "Kanna"],
	["사쿠라코", "Sakurako"],
	["토키", "Toki"],
	["나기사", "Nagisa"],
	["코유키", "Koyuki"],
	["카호", "Kaho"],
	["레이사", "Reisa"],
	["루미", "Rumi"],
	["미나", "Mina"],
	["미노리", "Minori"],
	["메루", "Meru"],
	["모미지", "Momiji"],
	["이치카", "Ichika"],
	["카스미", "Kasumi"],
	["미사카 미코토", "Misaka Mikoto"],
	["쇼쿠호 미사키", "Shokuhou Misaki"],
	["사텐 루이코", "Saten Ruiko"],
	["유카리", "Yukari"],
	["렌게", "Renge"],
	["키쿄", "Kikyou"],
	["이부키", "Ibuki"],
	["마코토", "Makoto"],
	["우미카", "Umika"],
	["키라라", "Kirara"],
	["레이죠", "Reijo"],
	["키사키", "Kisaki"],
	["치아키", "Chiaki"],
	["사츠키", "Satsuki"],
	["세이아", "Seia"],
	["리오", "Rio"],
	["레이", "Rei"],
	["히카리", "Hikari"],
	["노조미", "Nozomi"],
	["아오바", "Aoba"],
	["나구사", "Nagusa"],
	["니야", "Niya"],

	["(무장)", " (Armed)"],
	["(밴드)", " (Band)"],
	["(바니걸)", " (Bunny)"],
	["(캠핑)", " (Camp)"],
	["(사복)", " (Casual)"],
	["(응원단)", " (Cheer Squad)"],
	["(크리스마스)", " (Christmas)"],
	["(라이딩)", " (Cycling)"],
	["(드레스)", " (Dress)"],
	["(가이드)", " (Guide)"],
	["(온천)", " (Hot Spring)"],
	["(메이드)", " (Maid)"],
	["(새해)", " (New Year)"],
	["(아르바이트)", " (Part-time Job)"],
	["(파자마)", " (Pajamas)"],
	["(아이돌)", " (Pop Idol)"],
	["(치파오)", " (Qipao)"],
	["(교복)", " (School)"],
	["(어린이)", " (Small)"],
	["(수영복)", " (Swimsuit)"],
	["테러", "Terror"],
	["(체육복)", " (Track)"],
].sort((a, b) => a[0].length < b[0].length)  // Longest words first to avoid erroneously replacing substrings

// DOM transformations
// [css selector]: (e: Element) => {}
const transforms = {
	// Ranking Distribution: swap filter positions so the filter symbol makes sense
	".css-1qc8sdx > .css-1wxaqej": (e) => e.style.order = -1,

	// Scores by Ranking: make the ranking filters look nice
	".css-k008qs > input:nth-child(odd)": (e) => e.style.textAlign = "right",
	".css-k008qs > input:nth-child(even)": (e) => e.style.textAlign = "left",

	// Student Usage by Ranking: fix word order on "Ranks xx~xx"
	".css-1r3an09": (e) => { const [a, b] = e.childNodes; a.before(b) },

	// Team Search: swap star and filter positions so the filter symbol makes sense
	".css-m5fvjt": (e) => e.style.gridArea = "c",
	".css-9v801z": (e) => e.style.gridArea = "d",

	// Team Search: student search box
	"[placeholder=\"학생을 선택해주세요\"]": (e) => {
		e.placeholder = "Select a student"
		transliteratify(e)
	},

	// Team Search: swap star and filter positions so the filter symbol makes sense
	".css-m5fvjt": (e) => e.style.gridArea = "c",
	".css-9v801z": (e) => e.style.gridArea = "d",

	// Team Search: keep "Team n" text on one line
	".css-16a9oup": (e) => e.style["box-sizing"] = "content-box",

	// Graphs: allow tooltips to extend outside of the graph
	// Not a translation, but some QoL I very much wanted.
	".MuiCard-root": (e) => e.style.overflow = "visible",
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
	if (root.nodeType === Node.ELEMENT_NODE) {
		transformNode(root)
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
		// setTimeout(() => input.value = value, 0)
	}
}
