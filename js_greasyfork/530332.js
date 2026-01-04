// ==UserScript==
// @name         FUT.GG Custom Translation (Korean)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Translate English text on FUT.GG into Korean
// @author       JHwang831(리스제임스의목발)
// @match        https://www.fut.gg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530332/FUTGG%20Custom%20Translation%20%28Korean%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530332/FUTGG%20Custom%20Translation%20%28Korean%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // 성능 최적화: 금액 형식 체크 함수 (개선됨)
    // ============================================
    const isMoneyFormat = (text) => {
        const trimmed = text.trim();
        // 2.5M, 2.5m (소수점) 또는 2M, 10M, 100K (정수) 형태 모두 체크
        return /\d+\.?\d*\s*[MKmk]\b/.test(trimmed);
    };

    // ============================================
    // 게임 모드 매핑 (진화 조건용) - 확장됨
    // ============================================
    const evoModeMap = new Map([
        ["any mode", "아무 모드"],
        ["rush, rivals, champions, or squad battles on min. semi-pro", "러시, 라이벌, 챔피언스, 혹은 스쿼드 배틀 (최소 세미프로)"],
        ["rush, rivals, champions, or squad battles on min semi-pro", "러시, 라이벌, 챔피언스, 혹은 스쿼드 배틀 (최소 세미프로)"],
        ["squad battles on min. semi-pro difficulty (or rush/rivals/champions/live events)", "스쿼드 배틀(최소 세미프로) 또는 러시/라이벌/챔피언스/라이브 이벤트"],
        ["squad battles on min semi-pro difficulty (or rush/rivals/champions/live events)", "스쿼드 배틀(최소 세미프로) 또는 러시/라이벌/챔피언스/라이브 이벤트"],
        ["squad battles on min. semi-pro difficulty (or rivals/champions/live events)", "스쿼드 배틀(최소 세미프로) 또는 라이벌/챔피언스/라이브 이벤트"],
        ["squad battles on min semi-pro difficulty (or rivals/champions/live events)", "스쿼드 배틀(최소 세미프로) 또는 라이벌/챔피언스/라이브 이벤트"],
        ["squad battles (최소 세미프로 난이도)", "스쿼드 배틀(최소 세미프로 난이도)"],
        ["rivals or champions", "라이벌 또는 챔피언스"],
        ["champions or rivals", "챔피언스 또는 라이벌"],
        ["squad battles", "스쿼드 배틀"],
        ["rush", "러시"],
        ["rivals", "라이벌"],
        ["champions", "챔피언스"],
        ["live events", "라이브 이벤트"]
    ]);

    // ============================================
    // 유틸리티 함수
    // ============================================
    const normalize = (str) => str.trim().toLowerCase().replace(/[\.,]+$/, '');

    // normalizeMode 함수 개선 - 'in' 접두어 제거 및 정규화
    const normalizeMode = (mode) => {
        if (!mode) return 'any mode';

        // 앞의 'in' 제거 및 정규화
        const cleaned = mode.trim().toLowerCase()
            .replace(/^in\s+/, '')  // 앞의 'in' 제거
            .replace(/[\.,]+$/, '') // 끝의 점/쉼표 제거
            .replace(/\s+/g, ' ');  // 연속 공백 정리

        return evoModeMap.get(cleaned) || mode;
    };

    // 역할명 정규화 (하이픈/공백 무관하게 처리)
    const normalizeRole = (role) => role.trim().toLowerCase().replace(/[-\s]+/g, ' ');

    // ============================================
    // 역할(Role) 번역 맵
    // ============================================
    const roleTranslations = new Map([
        ["advanced forward", "어드밴스 포워드"],
        ["false 9", "폴스 나인"],
        ["poacher", "포처"],
        ["target forward", "타겟 포워드"],
        ["inside forward", "인사이드 포워드"],
        ["wide playmaker", "와이드 플레이메이커"],
        ["winger", "윙어"],
        ["classic 10", "클래식 10번"],
        ["half winger", "하프 윙어"],
        ["playmaker", "플레이메이커"],
        ["shadow striker", "쉐도우 스트라이커"],
        ["wide midfielder", "와이드 미드필더"],
        ["box to box", "박스 투 박스"],
        ["deep lying playmaker", "딥라잉 플레이메이커"],
        ["holding", "홀딩"],
        ["centre half", "센터 하프"],
        ["wide half", "와이드 하프"],
        ["ball playing defender", "볼플레잉 수비수"],
        ["ball playing keeper", "볼플레잉 키퍼"],
        ["defender", "수비수"],
        ["stopper", "스토퍼"],
        ["attacking wingback", "공격형 윙백"],
        ["falseback", "폴스백"],
        ["fullback", "풀백"],
        ["wingback", "윙백"],
        ["inverted wingback", "인버티드 윙백"],
        ["wideback", "와이드백"],
        ["box crasher", "박스 크래셔"],
        ["goalkeeper", "골키퍼"],
        ["sweeper keeper", "스위퍼 키퍼"]
    ]);

    // 역할 번역 함수
    const translateRole = (role) => {
        const normalized = normalizeRole(role);
        return roleTranslations.get(normalized) || role;
    };

    // ============================================
    // 월 매핑
    // ============================================
    const monthMap = {
        january: '1월', february: '2월', march: '3월', april: '4월',
        may: '5월', june: '6월', july: '7월', august: '8월',
        september: '9월', october: '10월', november: '11월', december: '12월',
        jan: '1월', feb: '2월', mar: '3월', apr: '4월',
        jun: '6월', jul: '7월', aug: '8월',
        sep: '9월', oct: '10월', nov: '11월', dec: '12월'
    };

    // ============================================
    // 정적 번역 데이터
    // ============================================
    const translations = {
        // 선수 페이지
        "Apply a filter to get started...": "필터를 적용하여 시작하세요...",
        "Try out our Smart Search...": "스마트 검색을 사용해보세요...",
        "SORT": "정렬",
        "RATING": "등급",
        "OVR / Price": "오버롤 / 가격",
        "Min OVR": "최소 오버롤",
        "Max OVR": "최대 오버롤",
        "Min Price": "최소 가격",
        "Max Price": "최대 가격",
        "Positions": "포지션",
        "SM / WF": "개인기 / 약한 발",
        "Has All Selected Positions": "선택한 모든 포지션 포함",
        "Min PlayStyles": "최소 플레이스타일",
        "Max PlayStyles": "최대 플레이스타일",
        "Min PlayStyles+": "최소 플레이스타일+",
        "Max PlayStyles+": "최대 플레이스타일+",
        "Has Any Selected PlayStyles": "선택한 플레이스타일 중 하나 포함",
        "Min Roles+": "최소 역할+",
        "Max Roles+": "최대 역할+",
        "Min Roles++": "최소 역할++",
        "Max Roles++": "최대 역할++",
        "Show Only Challenge Players": "챌린지 선수만 보기",
        "Has Dynamic": "다이나믹 이미지 있음",
        "AccelerRATE Type": "가속 타입",
        "Accelerate Type": "가속 타입",
        "Min Height": "최소 키",
        "Max Height": "최대 키",
        "Min Weight": "최소 몸무게",
        "Max Weight": "최대 몸무게",
        "Min Age": "최소 나이",
        "Max Age": "최대 나이",
        "Go Back": "뒤로가기",
        "Search...": "검색...",

        // 메인 네비게이션
        "Home": "홈",
        "Players": "선수",
        "Squads": "스쿼드",
        "Builder": "빌더",
        "Market": "시장",
        "News": "뉴스",
        "Login": "로그인",
        "Log In": "로그인",
        "Register": "회원가입",
        "Sign Up": "회원가입",
        "Sign Out": "로그아웃",
        "Account": "계정",
        "My Squads": "내 스쿼드",
        "Search": "검색",
        "Search Players...": "선수 검색...",
        "Type \"/\" to search...": "검색하려면 \"/\"를 입력...",
        "Search for a player": "선수 검색",
        "Overview": "개요",
        "Evolutions": "진화",
        "Objectives": "목표",
        "Rush": "러시",
        "Squad Battles": "스쿼드 배틀",
        "Rivals": "라이벌",
        "Champions": "챔피언스",
        "Live Events": "라이브 이벤트",
        "Semi-Pro": "세미프로",
        "min. Semi-Pro": "최소 세미프로",
        "on min. Semi-Pro difficulty": "(최소 세미프로 난이도)",
        "on min Semi-Pro difficulty": "(최소 세미프로 난이도)",
        "using your active EVO Player in game": "활성화된 진화 선수를 사용하여",
        "using your active EVO player in game": "활성화된 진화 선수를 사용하여",
        "Campaign Squads": "캠페인 스쿼드",
        "Tools": "도구",
        "Evo Lab": "진화 연구",
        "Live Hub": "라이브 허브",
        "Squad Builder": "스쿼드 빌더",
        "Mode Mastery": "모드 마스터리",
        "Collections": "컬렉션",
        "Player Pools": "선수 풀",
        "Upgrade Hub": "업그레이드 허브",
        "Card Creator": "카드 생성기",
        "Compare": "비교",
        "Trackers": "트래커",
        "Thunderstruck Tracker": "Thunderstruck 트래커",
        "RTTK Tracker": "RTTK 트래커",
        "TOTS Live Tracker": "TOTS Live 트래커",
        "Fantasy FC Tracker": "Fantasy FC 트래커",
        "Momentum Trends": "가격변동 추이",
        "Cheapest by Rating": "오버롤 별 최저가",
        "Resources": "리소스",
        "Past & Present": "과거 & 현재 소속 팀",
        "Clubs": "클럽",
        "Nations": "국가",
        "Leagues": "리그",
        "Rarities": "희귀도",
        "SBC Rating Combinations": "SBC 등급 조합",

        // 홈페이지 탭
        "Trending": "인기",
        "Recent": "최신",
        "Trending Evos": "인기 진화",
        "Trending Evolutions": "인기 진화",
        "In Packs": "현재 확률업 선수",
        "View All Trending Players": "모든 인기 선수 보기",
        "EXPIRING SOON": "곧 만료",
        "Expiring Soon": "곧 만료",
        "New Players": "신규선수",
        "Trending Players": "인기선수",
        "Women Players": "여자선수",
        "View All": "모두 보기",
        "Download the FUT.GG Mobile App": "FUT.GG 모바일 앱 다운로드",

        // 플레이스타일
        "PlayStyles": "플레이스타일",
        "Scoring": "득점",
        "Finesse Shot": "감아차기",
        "Chip Shot": "칩 슛",
        "Power Shot": "파워 슛",
        "Dead Ball": "데드볼",
        "Power Header": "파워 헤딩",
        "Low Driven Shot": "낮은 드리븐 슛",
        "Low Driven": "로우 드리븐",
        "Precision Header": "정밀 헤더",
        "Gamechanger": "게임체인저",
        "Game Changer": "게임체인저",
        "Passing": "패스",
        "Incisive Pass": "예리한 패스",
        "Pinged Pass": "핑 패스",
        "Long Ball Pass": "긴 패스",
        "Long Ball": "긴 패스",
        "Tiki Taka": "티키타카",
        "Whipped Pass": "휩 패스",
        "Inventive": "인벤티브",
        "Defending": "수비",
        "Jockey": "견제",
        "Block": "블로킹",
        "Intercept": "가로채기",
        "Anticipate": "예상",
        "Slide Tackle": "슬라이딩 태클",
        "Bruiser": "브루저",
        "Aerial Fortress": "에어리얼 포트리스",
        "Enforcer": "인포서",
        "Ball Control": "볼 컨트롤",
        "Technical": "테크니컬",
        "Rapid": "래피드",
        "Flair": "플레어",
        "First Touch": "퍼스트 터치",
        "Trickster": "트릭스터",
        "Press Proven": "압박 검증",
        "Physical": "피지컬",
        "Quick Step": "퀵 스텝",
        "Relentless": "끈기와 인내",
        "Trivela": "트리벨라",
        "Acrobatic": "아크로바틱",
        "Long Throw": "긴 스로우",
        "Aerial": "공중전",
        "Goalkeeping": "골키퍼",
        "Far Throw": "긴 스로우",
        "Footwork": "발놀림",
        "Cross Claimer": "크로스 클레이머",
        "Rush Out": "러시 블로킹",
        "Far Reach": "넓은 수비 범위",
        "Deflector": "디플렉터",

        // 스탯
        "Pace": "페이스",
        "Acceleration": "가속력",
        "Sprint Speed": "전력 질주 속도",
        "Shooting": "슈팅",
        "Att. Position": "포지셔닝",
        "Finishing": "골 결정력",
        "Shot Power": "슛 파워",
        "Long Shots": "중거리 슛",
        "Volleys": "발리슛",
        "Penalties": "페널티킥",
        "Vision": "시야",
        "Crossing": "크로스",
        "FK. Acc.": "프리킥 정확도",
        "Short Pass": "짧은 패스",
        "Long Pass": "긴 패스",
        "Curve": "커브",
        "Agility": "민첩성",
        "Balance": "밸런스",
        "Reactions": "반응 속도",
        "Composure": "평정심",
        "Interceptions": "가로채기",
        "Heading Acc.": "헤딩 정확도",
        "Def. Aware": "수비 이해도",
        "Stand Tackle": "스탠딩 태클",
        "Jumping": "점프",
        "Stamina": "스태미나",
        "Strength": "몸싸움",
        "Aggression": "적극성",
        "PAC": "페이스",
        "SHO": "슈팅",
        "PAS": "패스",
        "DRI": "드리블",
        "DEF": "수비",
        "PHY": "피지컬",

        // 필터
        "Filter": "필터",
        "Apply Filters": "필터 적용",
        "Reset Filters": "필터 초기화",
        "General": "일반",
        "Name": "이름",
        "Player Name": "선수 이름",
        "Quality": "품질",
        "Rarity": "희귀도",
        "Rarity Squad": "희귀도 스쿼드",
        "Nation": "국가",
        "League": "리그",
        "Club": "클럽",
        "Past and Present": "과거 및 현재 소속 팀",
        "Overall": "오버롤",
        "Price": "가격",
        "Skill Moves": "개인기",
        "Weak Foot": "약한 발",
        "Position": "포지션",
        "Attackers": "공격수",
        "Midfielders": "미드필더",
        "Defenders": "수비수",
        "Has All of Selected Positions": "선택한 모든 포지션 포함",
        "Only Primary Positions": "주 포지션만 포함",
        "Roles": "역할",
        "# of Roles+": "역할+ 개수",
        "# of Roles++": "역할++ 개수",
        "Miscellaneous": "기타 필터",
        "Show Only Market Players": "판매 선수만 보기",
        "Show Only SBC/Obj. Players": "SBC/목표 선수만 보기",
        "Has Dynamic Image": "미페 있음",
        "Has Real Face": "페이스온 있음",
        "Lengthy": "길게 가속 - 랭시",
        "Explosive": "폭발적인 가속 - 익스",
        "Mostly Lengthy": "대부분 길게 가속 - 모랭",
        "Mostly Explosive": "대부분 폭발적인 가속 - 모익",
        "Controlled Lengthy": "제어된 길게 가속 - 컨랭",
        "Controlled Explosive": "제어된 폭발적인 가속 - 컨익",
        "Controlled": "제어된 가속 - 컨트롤드",
        "Strong Foot": "주 발",
        "Left": "왼발잡이",
        "Right": "오른발잡이",
        "Gender": "성별",
        "Male": "남성",
        "Female": "여성",
        "Body Type": "체형 - 체중, 키 순",
        "Lean Short": "마르고 작음",
        "Lean Medium": "마르고 보통",
        "Lean Tall": "마르고 큼",
        "Average Short": "보통 작음",
        "Average Medium": "보통 보통",
        "Average Tall": "보통 큼",
        "Stocky Short": "덩치 작음",
        "Stocky Medium": "덩치 보통",
        "Stocky Tall": "덩치 큼",
        "Unique": "유니크 - 고유 체형",
        "Height": "키",
        "Weight": "몸무게",
        "Age": "나이",
        "Has Any of Selected PlayStyles": "선택한 모든 플레이스타일 포함",
        "# of PS": "플레이스타일 개수",
        "# of PS+": "플레이스타일+ 개수",
        "Custom Filters": "커스텀 필터",
        "Diving": "GK 다이빙",
        "Handling": "GK 핸들링",
        "Kicking": "GK 킥",
        "Reflexes": "GK 반응속도",
        "Speed": "GK 스피드",
        "Positioning": "위치선정",
        "GK Diving": "GK 다이빙",
        "GK Handling": "GK 핸들링",
        "GK Kicking": "GK 킥",
        "GK Reflexes": "GK 반응속도",
        "GK Speed": "GK 스피드",
        "GK Positioning": "GK 위치선정",
        "FK Accuracy": "프리킥 정확도",
        "Heading Accuracy": "헤딩 정확도",
        "Short Passing": "짧은 패스",
        "Long Passing": "긴 패스",
        "Defensive Awareness": "수비 이해도",
        "Standing Tackle": "스탠딩 태클",
        "Sliding Tackle": "슬라이딩 태클",
        "Sorting": "정렬",
        "Select": "선택",
        "Descending": "내림차순",
        "Ascending": "오름차순",
        "Foot": "주 발",
        "Real Face": "페이스온 적용여부",
        "Yes": "예",
        "No": "아니오",
        "Shirt Number": "등번호",
        "Added on": "추가된 날짜",
        "CHEM LINKS": "조직력 높은 선수",
        "Top Chemistry Links": "조직력 높은 선수",
        "Actions": "추가",
        "Add to Evo Lab": "진화 연구에 추가",
        "Add to Compare": "비교에 추가",
        "Other Versions": "다른 버전",
        "Comments": "댓글",
        "Total IGS": "총 인게임스탯 (IGS)",
        "Total Face Stats": "총 페이스스탯",
        "Number of PlayStyles": "플레이스타일 개수",
        "Number of PlayStyles+": "플레이스타일+ 개수",
        "Number of Total PlayStyles": "총 플레이스타일(금/은특) 개수",
        "Player Filters": "선수 필터",

        // 가격 관련
        "Price Momentum": "가격변동 추이",
        "Lowest": "최저가",
        "Highest": "최고가",
        "Lowest BIN": "현재 최저 즉시구매가",
        "Last Update": "최근 갱신",
        "Price Range": "가격 범위",
        "Average BIN": "일일 평균 즉시구매가",
        "Cheapest Sale": "일일 최저가",
        "Discard Value": "퀵셀 가격",
        "Attributes": "능력치",
        "AcceleRATE": "가속타입",
        "Dribbling": "드리블",
        "Physicality": "피지컬",
        "Prices": "가격",
        "YEAR": "년",
        "MONTH": "월",
        "WEEK": "주",
        "3 DAYS": "3일",
        "TODAY": "오늘",
        "Recent Sales": "최근 판매 목록",
        "Time Sold": "판매된 시간",
        "Live Auctions": "실시간 경매",
        "Ending": "만료까지",
        "Start Bid": "시작 가격",
        "BIN": "즉시구매가",

        // 케미스트리
        "basic": "기본",
        "sniper": "스나이퍼",
        "finisher": "피니셔",
        "deadeye": "데드아이",
        "marksman": "마크스맨",
        "hawk": "호크",
        "artist": "아티스트",
        "architect": "아키텍트",
        "powerhouse": "파워하우스",
        "maestro": "마에스트로",
        "engine": "엔진",
        "sentinel": "센티넬",
        "guardian": "가디언",
        "gladiator": "글래디에이터",
        "backbone": "백본",
        "anchor": "앵커",
        "hunter": "헌터",
        "catalyst": "카탈리스트",
        "shadow": "섀도우",
        "wall": "월",
        "glove": "글러브",
        "shield": "쉴드",
        "cat": "캣",

        // 목표(Objectives) 페이지
        "EA SPORTS FC 26 Objectives": "EA SPORTS FC 26 목표",
        "LIVE EVENTS": "라이브 이벤트",
        "CAMPAIGN": "캠페인",
        "CHALLENGERS": "챌린저스",
        "Completed": "완료됨",
        "Evo Unlock": "진화 잠금 해제",
        "Award": "보상",
        "SP": "SP",
        "of": "중",
        "Objectives": "목표",
        "Objective": "목표",
        "Complete": "완료",
        "challenges to earn": "챌린지를 완료하여 획득",

        // SBC 및 목표
        "SBC": "SBC",
        "CHALLENGES": "챌린지",
        "EXPIRES": "만료까지",
        "REPEATABLE": "반복 가능 횟수",
        "REFRESHES EVERY": "새로고침 주기",
        "Refreshes Every": "새로고침 주기",
        "REFRESHES": "새로고침",
        "Refreshes": "새로고침",
        "EVERY": "주기",
        "Every": "주기",
        "View Rewards": "보상 보기",
        "View Solution": "솔루션 보기",
        "View": "보기",
        "Exchange a": "교환:",
        "Exchange an": "교환:",
        "Top Form": "최고의 폼",
        "Rewards": "보상",
        "Solution": "솔루션",
        "Mark as Completed": "완료로 표시하기",
        "All": "모두",
        "Expiring Soon": "곧 만료됨",
        "Season Points": "시즌 포인트",
        "Season Pass": "시즌 패스",
        "Weekly Rush Objectives": "주간 러시 목표",
        "Seasonal": "시즌",
        "Live": "라이브",
        "FC Pro": "FC 프로",
        "FC Coaching Masterclass": "FC 코칭 마스터클래스",
        "Milestones": "마일스톤",
        "Foundations": "기본",
        "UPGRADES": "업그레이드",

        // 스쿼드 빌더
        "TOTAL CHEMISTRY:": "총 조직력",
        "EVOS": "내 진화선수",
        "Save": "저장",
        "Squad Title": "스쿼드 이름",
        "Reset": "초기화",
        "MANAGER": "감독",
        "FORMATION:": "포메이션",
        "Change Formation": "포메이션 변경",
        "Bench": "벤치",
        "Settings": "설정",
        "SHARE": "공유",
        "Select a Manager": "감독 선택",
        "Select a League": "리그 선택",
        "Select a Nation": "국가 선택",
        "TACTICS": "전술",
        "SQUAD TACTICS": "스쿼드 전술",
        "SQUAD TACTICS (2/4)": "스쿼드 전술 (2/4)",
        "GG CLUB": "GG 클럽",
        "GG Club": "GG 클럽",

        // 전술 설정
        "Build Up Style": "빌드업 스타일",
        "Defensive Approach": "수비 접근",
        "Balanced": "밸런스",
        "Versatile": "다재다능",
        "Attack": "공격",
        "Counter": "역습",
        "Aggressive": "공격적",
        "Deep": "낮게",
        "High": "높게",
        "Roaming": "로밍",
        "Build-Up": "빌드업",
        "Wide": "넓게",
        "Ball-Winning": "볼 위닝",
        "Defend": "수비",
        "Support": "지원",
        "Manually Adjust Line": "수비 라인 수동 조정",
        "Select an item": "항목 선택",

        // 역할 설명
        "ROLE (5)": "역할 (5)",
        "FOCUS": "집중",
        "STARTING": "시작 포메이션",
        "Wide Back": "와이드 백",

        // 진화 탭 (Evolutions) - 신규 추가
        "Hide Reward Evolutions": "보상 진화 숨기기",
        "Hide Evo Lab Excluded Evolutions": "진화 연구에서 제외된 진화 숨기기",
        "Hide Evo Lab Completed Evolutions": "진화 연구에서 완료된 진화 숨기기",
        "You have no players that match the requirements": "요구사항을 만족하는 선수가 없습니다.",
        "Evo Lab Mode": "진화 연구 모드",
        "Community Verdict": "커뮤니티 평가",
        "Must Do": "필수",
        "Solid Evo": "좋은 진화",
        "Worth Doing": "할만함",
        "Worth Considering": "고려해볼만함",
        "Weak Evo": "별로인 진화",
        "Skip": "건너뛰기",
        "Is Your Player Eligible?": "내 선수가 진화 가능한가요?",
        "Search for your player": "선수 검색",
        "Want to check eligibility for your already evolved players? Sync them now on": "이미 진화한 선수의 적격 여부를 확인하고 싶으신가요? 지금 동기화하세요:",
        "Completion Difficulty": "완료 난이도",
        "Number of Games": "필요 경기 수",
        "Recommended Position": "추천 포지션",
        "Number of Wins": "필요 승리 수",
        "Easy": "쉬움",
        "Medium": "보통",
        "Hard": "어려움",
        "Player Requirements": "선수 요구사항",
        "Details": "세부정보",
        "Submit by": "제출 기한",
        "Expiry": "만료",
        "Coins Cost": "코인 비용",
        "Points Cost": "포인트 비용",
        "Games": "경기",
        "Wins": "승리",
        "Clean Sheets": "무실점",
        "Online Required": "온라인 필수",
        "Analysis": "분석",
        "Stats Boost": "스탯 부스트",
        "Evolution Upgrades": "진화 업그레이드",
        "How do I unlock this?": "어떻게 잠금 해제하나요?",
        "No challenges": "챌린지 없음",

        // 진화
        "Show Expired": "만료된 진화 보기",
        "Hide Expired": "만료된 진화 가리기",
        "EXPIRED EVOLUTIONS": "만료된 진화",
        "Expired Evolutions": "만료된 진화",
        "EXCLUDED RARITY": "제외된 희귀도",
        "Excluded Rarity": "제외된 희귀도",
        "Show all": "모두 보기",
        "Show less": "접기",
        "Your Players": "내 선수",
        "You have no players that can be upgraded in this Evolution.": "이 진화로 업그레이드할 수 있는 선수가 없습니다.",
        "Go To Evo Lab": "진화 연구로 이동",
        "GG RATING": "GG 등급",
        "All Roles & Positions": "모든 역할 & 포지션",
        "Best Chemistry Styles": "최고의 케미스트리 스타일",
        "Ranked": "랭크",
        "Requirements": "요구사항",
        "Best Possible Path": "최적 진화 경로",
        "Select a Version...": "버전 선택...",
        "Filters": "필터",
        "View Upgrades": "업그레이드 보기",
        "Hide Upgrades": "업그레이드 숨기기",
        "Base Player": "기본 선수",
        "Level 1": "1단계",
        "Level 2": "2단계",
        "Level 3": "3단계",
        "Level 4": "4단계",
        "Level 5": "5단계",
        "Level 6": "6단계",
        "GENERATE": "생성하기",

        // 진화 연구 페이지
        "INCLUDE REWARD EVOLUTIONS": "보상 진화 포함",
        "ELIGIBLE EVOLUTIONS": "진화 가능",
        "ACTIVE EVOLUTIONS": "활성 진화",
        "USED EVOLUTIONS": "사용한 진화",
        "ALL EVOLUTIONS": "모든 진화",
        "Search for an Evolution": "진화 검색",
        "YOUR ELIGIBLE PLAYERS": "진화 가능한 내 선수",
        "None of your players are eligible for this evolution, you can find other options based on your available evolutions": "이 진화에 적합한 선수가 없습니다. 사용 가능한 다른 진화를 찾아보세요",
        "here": "여기",
        "Show Evolution Info": "진화 정보 보기",
        "Hide Evolution Info": "진화 정보 숨기기",
        "Show Evolution Information": "진화 정보 보기",
        "Hide Evolution Information": "진화 정보 숨기기",
        "Exclude from Player Upgrades": "선수 업그레이드에서 제외",
        "Other Evo Options": "다른 진화 옵션",
        "EXPIRES IN": "만료까지",
        "There are no evolutions available.": "사용 가능한 진화가 없습니다.",
        "WATCH PLAYER": "선수 보기",
        "Intro to Evolutions": "진화 소개",
        "VERSIONS": "버전",
        "Go to Evolution": "진화로 이동",

        // 진화 선수 목록 페이지
        "Exclude Your Evolutions": "내 진화 제외",
        "OFF": "끔",
        "ON": "켬",
        "Show Non-Upgraded Players": "업그레이드되지 않은 선수 보기",
        "Show Multiple Versions of Same Player": "동일 선수의 여러 버전 보기",

        // 기타
        "Clear All": "모두 지우기",
        "GGR": "GGR",
        "YOUR UPGRADES": "내 업그레이드",
        "NEW": "신규",
        "Custom Attributes": "커스텀 능력치",
        "OVR": "오버롤",
        "GK Reflexes": "GK 반응속도",
        "GK Reactions": "반응속도",
        "Dribbling (Att.)": "드리블 (공격)",
        "Max PS": "최대 플레이스타일",
        "SM": "개인기",
        "PlayStyle": "플레이스타일",
        "PlayStyle+": "플레이스타일+",
        "Max Pos.": "최대 포지션",
        "Excluded Position": "제외 포지션",
        "Max PS+": "최대 플레이스타일+",
        "New Pos.": "새로운 포지션",
        "WF": "약한 발",
        "Role++": "역할++",
        "Role+": "역할+",
        "UNLOCK BY": "잠금해제 기한",
        "EXPIRES ON": "만료일",
        "# PLAYERS": "진화 가능 선수 수",
        "Player": "선수",
        "Eligible Players": "진화가능 선수",
        "Evolved Players": "진화완료 선수",
        "Trending Evolved Players": "인기 진화완료 선수",
        "Total Upgrades": "총 업그레이드",
        "Full Evolution Path": "전체 진화 단계",
        "EXPIRED": "만료됨",
        "FREE": "무료",
        "TRAINING TIME": "훈련 기간",
        "For You": "맞춤 설정",
        "Exclude Your Used Evolutions": "내가 사용한 진화 제외",
        "Use Every Selected Evolution": "선택한 모든 진화 사용",
        "Exclude Unselected Evolutions": "선택하지 않은 진화 제외",
        "Hide Evolution Combinations": "진화 조합 숨기기",
        "Show All Versions of Same Player": "동일 선수의 모든 버전 보기",
        "Show Non-Boosted Players": "부스트되지 않은 선수 보기",
        "Hide Paid Evolutions": "유료 진화 숨기기",
        "Next": "다음",
        "Prev": "이전",
        "Assets": "스크린샷",
        "Share Path": "진화경로 공유",
        "All Versions": "모든 버전",
        "Check out Evo Lab for expired paths": "만료된 진화는 진화 연구에서 확인",

        // 진화 연구
        "Hide Base Players": "순정 선수 숨기기",
        "Hide Evolutions Players": "진화 선수 숨기기",
        "EVOLVE": "진화하기",
        "NUMBER OF UPGRADES": "업그레이드 개수",
        "NO UPGRADES": "업그레이드 없음",
        "Select a player to evolve": "진화할 선수 검색",
        "Active": "활성",
        "All Evos": "모든 진화",
        "Customise": "커스텀",
        "Review": "진화 적용 확인",
        "SAVE PLAYER": "선수 저장하기",
        "Hide Used Evolutions": "사용한 진화 숨기기",
        "Reset Modifications": "조정 리셋",
        "Show Attributes": "능력치 보기",
        "General Information": "일반 정보",
        "View Rarities": "희귀도 보기",
        "Cosmetic Evolution": "코스메틱 진화",
        "Select a Cosmetic Evolution": "코스메틱 진화 선택",
        "View Gallery": "갤러리 보기",
        "Alternative Positions": "보조 포지션",
        "PlayStyles+": "플레이스타일+",
        "Roles+": "역할+",
        "Roles++": "역할++",
        "Apply upgrades": "업그레이드 적용",
        "Check eligibility": "진화 적격 여부 확인",
        "Show prices": "가격 보기",
        "NEWEST FIRST": "최신순",
        "OLDEST FIRST": "오래된 순",
        "PRICE ASCENDING": "가격 오름차순",
        "PRICE DESCENDING": "가격 내림차순",
        "Search evolutions...": "진화 검색...",
        "APPLY": "적용하기",
        "+ CREATE": "제작하기",
        "Select a rarity": "희귀도 선택",
        "Loading...": "로딩중...",
        "+ ADD FROM MY PLAYERS": "+ 내 선수중에서 추가하기",
        "+ ADD FROM EVOLVE": "+ 진화에서 추가하기",
        "Recently Viewed": "최근 본 선수",
        "EXTINCT": "매물없음",
        "Info": "정보",

        // 역할 번역 (정적 번역용 - 단독으로 나올 때)
        "Advanced Forward": "어드밴스 포워드",
        "False 9": "폴스 나인",
        "Poacher": "포처",
        "Target Forward": "타겟 포워드",
        "Inside Forward": "인사이드 포워드",
        "Wide Playmaker": "와이드 플레이메이커",
        "Winger": "윙어",
        "Classic 10": "클래식 10번",
        "Half-Winger": "하프 윙어",
        "Half Winger": "하프 윙어",
        "Playmaker": "플레이메이커",
        "Shadow Striker": "쉐도우 스트라이커",
        "Wide Midfielder": "와이드 미드필더",
        "Box-To-Box": "박스 투 박스",
        "Box to Box": "박스 투 박스",
        "Deep-Lying Playmaker": "딥라잉 플레이메이커",
        "Deep Lying Playmaker": "딥라잉 플레이메이커",
        "Holding": "홀딩",
        "Centre-Half": "센터 하프",
        "Centre Half": "센터 하프",
        "Wide Half": "와이드 하프",
        "Ball-Playing Defender": "볼플레잉 수비수",
        "Ball Playing Defender": "볼플레잉 수비수",
        "Ball Playing Keeper": "볼플레잉 키퍼",
        "Defender": "수비수",
        "Stopper": "스토퍼",
        "Attacking Wingback": "공격형 윙백",
        "Falseback": "폴스백",
        "Fullback": "풀백",
        "Wingback": "윙백",
        "Inverted Wingback": "인버티드 윙백",
        "Wideback": "와이드백",
        "Box Crasher": "박스 크래셔",
        "Goalkeeper": "골키퍼",
        "Sweeper Keeper": "스위퍼 키퍼",

        // Footer
        "All rights reserved": "모든 권리 보유",
        "Privacy Policy": "개인정보 보호정책",
        "Terms & Conditions": "이용약관",
        "Business Inquiries": "비즈니스 문의"
    };

    // ============================================
    // 동적 번역 패턴 (우선순위 순서로 정렬)
    // ============================================
    const dynamicTranslations = [
        // ========== 우선순위 1: 가장 자주 사용되는 패턴 ==========

        // +N more 패턴
        { pattern: /\+\s*(\d+)\s+more/gi, replacement: '+$1개 더' },
        { pattern: /\+(\d+)\s+more/gi, replacement: '+$1개 더' },
        { pattern: /\+ (\d+) more/gi, replacement: '+$1개 더' },

        // CHEM & ROLE 패턴
        { pattern: /CHEM\s*\((\d+)\)/gi, replacement: '조직력($1)' },
        { pattern: /ROLE\s*\((\d+)\)/gi, replacement: '역할($1)' },

        // ========== 우선순위 2: 시간/날짜 표현 ==========

        // 만료 시간 (구체적인 것부터)
        { pattern: /Expires in (\d+)\s*day(?:s)?/i, replacement: '$1일 후 만료 예정' },
        { pattern: /Expires in (\d+)\s*month(?:s)?/i, replacement: '$1달 후 만료 예정' },
        { pattern: /in (\d+)\s*day(?:s)?/i, replacement: '$1일 후' },
        { pattern: /in (\d+)\s*month(?:s)?/i, replacement: '$1달 후' },
        { pattern: /in (\d+)\s*hour(?:s)?/i, replacement: '$1시간 후' },

        // 시간 포맷 (복합 → 단일 순서)
        { pattern: /(\d+)d\s*(\d+)h\s*(\d+)m/i, replacement: '$1일 $2시간 $3분' },
        { pattern: /(\d+)d\s*(\d+)h/i, replacement: '$1일 $2시간' },
        { pattern: /(\d+)d\s*(\d+)m/i, replacement: '$1일 $2분' },
        { pattern: /(\d+)\s*h\s*(\d+)\s*m/i, replacement: '$1시간 $2분' },
        { pattern: /(\d+)h(\d+)m/i, replacement: '$1시간 $2분' },
        { pattern: /(\d+)\s*years\b/i, replacement: '$1년' },
        { pattern: /(\d+)\s*months\b/i, replacement: '$1달' },
        { pattern: /(\d+)\s*month\b/i, replacement: '$1달' },
        { pattern: /(\d+)\s*days\b/i, replacement: '$1일' },
        { pattern: /(\d+)\s*day\b/i, replacement: '$1일' },
        { pattern: /(\d+)\s*hours\b/i, replacement: '$1시간' },
        { pattern: /(\d+)\s*h\b/i, replacement: '$1시간' },

        // 날짜 포맷
        {
            pattern: /([A-Za-z]+) (\d{1,2}), (\d{4}), (\d{1,2}):(\d{2}) (AM|PM)/i,
            replacement: (_, monthName, day, year, hour, minute, period) => {
                const months = {
                    January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
                    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
                };
                const m = months[monthName];
                let h = parseInt(hour, 10);
                if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
                if (period.toUpperCase() === 'AM' && h === 12) h = 0;
                const ampm = period.toUpperCase() === 'PM' ? '오후' : '오전';
                return `${year}년 ${m}월 ${day}일 ${ampm} ${h}시 ${minute}분`;
            }
        },
        {
            pattern: /([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})/i,
            replacement: (_, monthName, day, year) => {
                const months = {
                    January: '1월', February: '2월', March: '3월', April: '4월',
                    May: '5월', June: '6월', July: '7월', August: '8월',
                    September: '9월', October: '10월', November: '11월', December: '12월',
                    Jan: '1월', Feb: '2월', Mar: '3월', Apr: '4월',
                    May: '5월', Jun: '6월', Jul: '7월', Aug: '8월',
                    Sep: '9월', Oct: '10월', Nov: '11월', Dec: '12월'
                };
                const krMonth = months[monthName] || monthName;
                return `${year}년 ${krMonth} ${day}일`;
            }
        },
        {
            pattern: /(\d{1,2})(st|nd|rd|th)? ([A-Za-z]+) (\d{1,2}):(\d{2})/i,
            replacement: (_, day, __, month, hour, minute) => {
                const krMonth = monthMap[month.toLowerCase()] || month;
                return `${krMonth} ${day}일 ${hour}:${minute}`;
            }
        },

        // ========== 우선순위 3: SBC 요구사항 ==========

        { pattern: /Exchange (?:a|an) (\d+)-Rated Squad/i, replacement: '$1등급 스쿼드 교환' },
        { pattern: /Number of players:\s*(\d+)/i, replacement: '필요 선수: $1명' },
        { pattern: /(\d+)-rated squad/i, replacement: '$1등급 스쿼드' },
        { pattern: /Min\. (\d+) Players from: (.+)/i, replacement: '$2 소속 선수 최소 $1명' },
        { pattern: /Min\. (\d+) Players: Team of the Week/i, replacement: '최소 $1명: 이 주의 팀 선수' },
        { pattern: /Min\. Team Rating: (\d+)/i, replacement: '최소 팀 등급: $1' },
        { pattern: /Min\. Nationalities in Squad: (\d+)/i, replacement: '스쿼드 내 최소 국적 수: $1' },
        { pattern: /Max\. Nationalities in Squad: (\d+)/i, replacement: '스쿼드 내 최대 국적 수: $1' },
        { pattern: /Min\. (\d+) Players from the same League/i, replacement: '동일 리그 소속 선수 최소 $1명' },
        { pattern: /Max\. (\d+) Players from the same League/i, replacement: '동일 리그 소속 선수 최대 $1명' },
        { pattern: /Min\. (\d+) Players from the same Club/i, replacement: '동일 클럽 소속 선수 최소 $1명' },
        { pattern: /Max\. (\d+) Players from the same Club/i, replacement: '동일 클럽 소속 선수 최대 $1명' },
        { pattern: /Min\. Clubs in Squad: (\d+)/i, replacement: '스쿼드 내 클럽 최소 $1개' },
        { pattern: /Max\. Clubs in Squad: (\d+)/i, replacement: '스쿼드 내 클럽 최대 $1개' },
        { pattern: /Min\. (\d+) Players from the same Nation/i, replacement: '동일 국가 소속 선수 최소 $1명' },
        { pattern: /Max\. (\d+) Players from the same Nation/i, replacement: '동일 국가 소속 선수 최대 $1명' },
        { pattern: /Min\. Leagues in Squad: (\d+)/i, replacement: '스쿼드 내 리그 최소 $1개' },
        { pattern: /Max\. Leagues in Squad: (\d+)/i, replacement: '스쿼드 내 리그 최대 $1개' },
        { pattern: /Min\. (\d+) Players: (.+)/i, replacement: '최소 $1명: $2 선수' },
        { pattern: /Min\. Squad Total Chemistry Points: (\d+)/i, replacement: '최소 팀 총 조직력: $1' },
        { pattern: /Min\. (\d+) player with minimum OVR of (\d+)/i, replacement: '$2등급 선수 최소 $1명' },
        { pattern: /Min\. Leagues Squad: (\d+)/i, replacement: '스쿼드 내 리그 최소 $1개' },
        { pattern: /Min\. Clubs Squad: (\d+)/i, replacement: '스쿼드 내 클럽 최소 $1개' },
        { pattern: /Min\. Nationalities Squad: (\d+)/i, replacement: '스쿼드 내 국적 최소 $1개' },
        { pattern: /Player quality: Min\. ['"]?([A-Za-z\s]+)['"]?/i, replacement: '최소 $1 선수' },

        // ========== 우선순위 4: 목표(Objectives) 조건 ==========

        {
            pattern: /(\d+) of (\d+) Objectives/i,
            replacement: '$2개 중 $1개 목표'
        },
        {
            pattern: /Score at least (\d+) goals? from outside of the box in the (.+?)\. Earn an EVO Consumable that grants (.+?), applicable to all Player Items \(excluding (.+?)\) with a 최대 (\d+) OVR\./i,
            replacement: (match, goals, event, bonus, excluded, ovr) => `${event.trim()}에서 박스 밖에서 최소 ${goals}골을 기록하세요. 모든 선수 아이템(${excluded} 제외, 최대 ${ovr} 오버롤)에 적용 가능한 ${bonus} 진화 소모품을 획득하세요.`
        },
        {
            pattern: /Score at least (\d+) goals? in (\d+) separate matches in (?:the )?(.+?)(?: to earn a special (.+?))?\.$/i,
            replacement: (match, goals, matches, event, reward) => {
                const base = `${event.trim()}에서 ${matches}경기에서 최소 ${goals}골을 기록하세요`;
                return reward ? `${base.slice(0, -1)}여 특별한 ${reward.trim()}을 획득하세요.` : base + '.';
            }
        },
        {
            pattern: /Earn ([\d,]+) Rush Points\./i,
            replacement: '러시 포인트 $1 획득.'
        },
        {
            pattern: /(\d+) Completions/i,
            replacement: '$1회 완료'
        },
        {
            pattern: /(\d+) Completion/i,
            replacement: '$1회 완료'
        },
        {
            pattern: /(\d+) Objectives/i,
            replacement: '$1개 목표'
        },

        // ========== 우선순위 5: 진화 조건 (가장 구체적 → 일반) ==========

        // 커뮤니티 투표 패턴
        {
            pattern: /(\d+)% of GG users upvoted this Evolution\. Vote Now!/i,
            replacement: 'GG 사용자의 $1%가 이 진화를 추천했습니다. 지금 투표하세요!'
        },

        // 구체적인 진화 조건들 - Squad Battles 변형 포함
        {
            pattern: /Play (\d+) matches? in Squad Battles on min\.? Semi-Pro difficulty \(or (?:Rush\/)?Rivals\/Champions\/Live Events\) using your active EVO [Pp]layer in game\./i,
            replacement: '스쿼드 배틀(최소 세미프로) 또는 라이벌/챔피언스/라이브 이벤트에서 활성화된 진화 선수를 사용해 $1경기를 플레이하세요.'
        },
        {
            pattern: /Win (\d+) matches? in Squad Battles on min\.? Semi-Pro difficulty \(or (?:Rush\/)?Rivals\/Champions\/Live Events\) using your active EVO [Pp]layer in game\./i,
            replacement: '스쿼드 배틀(최소 세미프로) 또는 라이벌/챔피언스/라이브 이벤트에서 활성화된 진화 선수를 사용해 $1경기를 승리하세요.'
        },
        {
            pattern: /Assist (\d+) goals? in Squad Battles on min\.? Semi-Pro difficulty \(or (?:Rush\/)?Rivals\/Champions\/Live Events\) using your active EVO [Pp]layer in game\./i,
            replacement: '스쿼드 배틀(최소 세미프로) 또는 라이벌/챔피언스/라이브 이벤트에서 활성화된 진화 선수로 $1도움을 기록하세요.'
        },
        {
            pattern: /Score (\d+) goals? in Squad Battles on min\.? Semi-Pro difficulty \(or (?:Rush\/)?Rivals\/Champions\/Live Events\) using your active EVO [Pp]layer in game\./i,
            replacement: '스쿼드 배틀(최소 세미프로) 또는 라이벌/챔피언스/라이브 이벤트에서 활성화된 진화 선수로 $1골을 기록하세요.'
        },
        {
            pattern: /Score at least (\d+) Low Driven goals? with your active EVO player in (\d+) separate matches in any mode\./i,
            replacement: '아무 모드에서 활성화된 진화 선수로 $2경기에서 최소 $1개의 로우 드리븐 골을 기록하세요.'
        },
        {
            pattern: /Win (\d+) matches? while conceding (\d+) goals? or less in Squad Battles on min\.? Semi-Pro difficulty \(or Rivals,? Champions,? Live Events\) using your active EVO player in game\./i,
            replacement: '스쿼드 배틀(최소 세미프로) 또는 라이벌/챔피언스/라이브 이벤트에서 활성화된 진화 선수를 사용해 $2실점 이하로 $1경기를 승리하세요.'
        },

        // Rivals/Champions 전용
        {
            pattern: /Play (\d+) match(?:es)? in (?:Rivals or Champions|Champions or Rivals) using your active EVO [Pp]layer in game/i,
            replacement: '라이벌 또는 챔피언스에서 활성화된 진화 선수를 사용해 $1경기를 플레이하세요'
        },
        {
            pattern: /Win (\d+) match(?:es)? in (?:Rivals or Champions|Champions or Rivals) using your active EVO [Pp]layer in game/i,
            replacement: '라이벌 또는 챔피언스에서 활성화된 진화 선수를 사용해 $1경기를 승리하세요'
        },

        // 일반화된 진화 조건 (가장 마지막에 배치)
        {
            pattern: /Play (\d+) match(?:es)?(?: (?:in|on)? (.*?))? using your active EVO player(?: in game| game)?\.?$/i,
            replacement: (_, count, mode) => `${normalizeMode(mode || 'any mode')}에서 활성화된 진화 선수를 사용해 ${count}경기를 플레이하세요.`
        },
        {
            pattern: /Win (\d+) match(?:es)?(?: (?:in|on)? (.*?))? using your active EVO player(?: in game| game)?\.?/i,
            replacement: (_, count, mode) => `${normalizeMode(mode || 'any mode')}에서 활성화된 진화 선수를 사용해 ${count}경기를 승리하세요.`
        },
        {
            pattern: /Score (\d+) goals? with your active EVO player(?: (?:in|on)? (.*?))?\.?$/i,
            replacement: (_, goals, mode) => `${normalizeMode(mode || 'any mode')}에서 활성화된 진화 선수로 ${goals}골을 기록하세요.`
        },
        {
            pattern: /Assist (\d+) goals? with your active EVO player(?: (?:in|on)? (.*?))?\.?/i,
            replacement: (_, assists, mode) => `${normalizeMode(mode || 'any mode')}에서 활성화된 진화 선수로 ${assists}도움을 기록하세요.`
        },

        // ========== 우선순위 6: 포지션-역할 패턴 ==========

        // 하이픈 포함 패턴 (예: "ST - Advanced Forward ++")
        {
            pattern: /\b(CAM|CM|CDM|ST|CF|LW|RW|LM|RM|CB|LB|RB|LWB|RWB|GK)\s*-\s*([A-Za-z\s-]+?)(\s*\+{1,2})?\b/gi,
            replacement: (match, position, role, plus = '') => {
                const translatedRole = translateRole(role);
                return `${position} - ${translatedRole}${plus}`;
            }
        },
        // 스페이스만 있는 패턴 (예: "ST Advanced Forward ++")
        {
            pattern: /\b(CAM|CM|CDM|ST|CF|LW|RW|LM|RM|CB|LB|RB|LWB|RWB|GK)\s+([A-Za-z\s-]+?)(\s*\+{1,2})?\b(?!\s*-)/gi,
            replacement: (match, position, role, plus = '') => {
                const translatedRole = translateRole(role);
                return `${position} ${translatedRole}${plus}`;
            }
        },

        // ========== 우선순위 7: 기타 패턴 ==========

        { pattern: /Max\. (\d+)/i, replacement: '최대 $1' },
        { pattern: /Min\. (\d+)/i, replacement: '최소 $1' },
        { pattern: /^([\d,]+)\s+players$/i, replacement: '$1 선수 진화 가능' },
        { pattern: /^Level\s*(\d+)/i, replacement: '$1단계' },
        {
            pattern: /Selected (.+?) Evolution Path/i,
            replacement: '선택된 $1 진화 경로'
        },
        {
            pattern: /Best (.+?) Evolutions Path/i,
            replacement: '최고의 $1 진화 경로'
        },
        {
            pattern: /All (.+?) Evolution Paths/i,
            replacement: '$1의 모든 진화 경로'
        },

        // 시제 단어
        { pattern: /\bago\b/i, replacement: ' 전' }
    ];

    // ============================================
    // 소문자 변환된 번역 맵 생성
    // ============================================
    const lowerCaseTranslations = Object.fromEntries(
        Object.entries(translations).map(([k, v]) => [k.trim().toLowerCase(), v])
    );

    // ============================================
    // 포지션+역할 패턴 전용 번역 함수
    // ============================================
    function translatePositionRole(text) {
        // 패턴: "ST Advanced Forward ++" 형태만 처리
        const positionRolePattern = /^(CAM|CM|CDM|ST|CF|LW|RW|LM|RM|CB|LB|RB|LWB|RWB|GK)\s+(.+?)(\s*\+{1,2})?$/i;
        const match = text.match(positionRolePattern);

        if (match) {
            const position = match[1].toUpperCase();
            const role = match[2].trim();
            const plus = match[3] ? match[3].trim() : '';

            const translatedRole = translateRole(role);

            // 역할이 번역되었으면 번역된 텍스트 반환
            if (translatedRole !== role) {
                return `${position} ${translatedRole}${plus ? ' ' + plus : ''}`;
            }
        }

        return null; // 매칭 안됨
    }

    // ============================================
    // 텍스트 노드 번역 함수
    // ============================================
    function translateTextNode(node) {
        const original = node.nodeValue;
        if (!original || !original.trim()) return;

        // 금액 형식은 번역하지 않음 (2M, 2.5M, 100K 등)
        if (isMoneyFormat(original)) return;

        const trimmed = original.trim();
        const normalized = trimmed.toLowerCase();

        // 1. 정적 번역 우선
        if (lowerCaseTranslations[normalized]) {
            node.nodeValue = original.replace(trimmed, lowerCaseTranslations[normalized]);
            return;
        }

        // 2. 포지션+역할 패턴 체크 (예: "ST Advanced Forward ++")
        const posRoleTranslated = translatePositionRole(trimmed);
        if (posRoleTranslated) {
            node.nodeValue = original.replace(trimmed, posRoleTranslated);
            return;
        }

        // 3. 동적 패턴 번역
        let translated = original;
        for (const { pattern, replacement } of dynamicTranslations) {
            if (pattern.test(translated)) {
                translated = typeof replacement === 'function'
                    ? translated.replace(pattern, replacement)
                    : translated.replace(pattern, replacement);

                if (translated !== original) {
                    node.nodeValue = translated;
                    return;
                }
            }
        }
    }

    // ============================================
    // 번역 적용 함수 (최적화됨)
    // ============================================
    function applyTranslations() {
        // TreeWalker로 텍스트 노드만 순회
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) translateTextNode(node);
    }

    // ============================================
    // MutationObserver + Debounce
    // ============================================
    const observer = new MutationObserver(() => {
        clearTimeout(window._futggDebounce);
        window._futggDebounce = setTimeout(applyTranslations, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', () => setTimeout(applyTranslations, 300));

})();