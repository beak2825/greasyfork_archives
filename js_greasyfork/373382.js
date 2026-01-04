// ==UserScript==
// @name         van.mz.playerAdvanced
// @namespace    van
// @version      4.28
// @description  Player display optimization 球员着色插件
// @author       van
// @match        https://www.managerzone.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      www.x2x.fun
// @connect      sgj.x2x.fun
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/pako/1.0.5/pako.min.js
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-20-M/dexie/3.2.0/dexie.min.js
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-20-M/blueimp-md5/2.14.0/js/md5.min.js
// @require      https://unpkg.com/vple/base64js.min.js
// @require      https://unpkg.com/vple/vple.min.js
// @require      https://unpkg.com/vple/echarts.min.js
// @downloadURL https://update.greasyfork.org/scripts/373382/vanmzplayerAdvanced.user.js
// @updateURL https://update.greasyfork.org/scripts/373382/vanmzplayerAdvanced.meta.js
// ==/UserScript==

var vanGmMzModel = {

    language: {
        zh: {
            Name: "中文",
            GetPlayersHtml: "获取球员页面HTML",
            GetPlayersHtml2: "获取球员页面HTML(不用缓存)",
            Clear: "清空缓存",
            Save: "保存",
            Setting: "设置",
            Test: "测试",
            SettingTitle: "点击可对语言和XML导出进行设置",
            Language: "语言",
            XmlMode: "战术导出模式",
            XmlMode1: "顺序选择球员",
            XmlMode2: "根据位置选择球员(需提交数据到后台)",
            TacConf: "位置系数设置",
            AutoRun: "自动着色",
            AutoRun0: "仅打开页面时自动执行一次",
            AutoRun1: "随系统刷新自动着色(如果浏览器变卡请关闭此选项)",

            Pay: "如果你觉得好用，可通过打赏支持作者。",



            NotSureEx: "挂牌后属性可能有变动，不确定转会市场显示是否是真实属性，请自行甄别。<br/>属性变动时间",
            NotSure: "属性不确定",
            ManualColorTitle: "点击可手动着色 快捷键:ALT + A",
            ManualColor: "手动着色",
            Jijing: "比赛集锦",
            dongzuo: "球员动作",
            Copyxml1: "复制主队战术",
            Copyxml2: "复制客队战术",
            CopyXml: "数据已复制到剪切板",
            CopyXmlMsg: "战术已复制到剪切板",
            CopyXmlMsgError: "战术复制失败",
            BA_NORMAL: "BA_NORMAL",
            BA_WALL: "站人墙",
            BA_HOLD: "抱着球",
            BA_DOWN: "倒地",
            BA_HOLD_THROWIN: "界外球准备",
            BA_THROWIN: "界外球",
            BA_LEFT_FOOT_SHOT_FWD: "射门/长传(L)",
            BA_LEFT_FOOT_SHOT_BACK: "BA_LEFT_FOOT_SHOT_BACK",
            BA_LEFT_FOOT_SHOT_RIGHT: "BA_LEFT_FOOT_SHOT_RIGHT",
            BA_LEFT_FOOT_SHOT_LEFT: "BA_LEFT_FOOT_SHOT_LEFT",
            BA_RIGHT_FOOT_SHOT_FWD: "射门/长传(R)",
            BA_RIGHT_FOOT_SHOT_BACK: "BA_RIGHT_FOOT_SHOT_BACK",
            BA_RIGHT_FOOT_SHOT_RIGHT: "BA_RIGHT_FOOT_SHOT_RIGHT",
            BA_RIGHT_FOOT_SHOT_LEFT: "BA_RIGHT_FOOT_SHOT_LEFT",
            BA_LEFT_FOOT_PASS_FWD: "短传(L)",
            BA_LEFT_FOOT_PASS_BACK: "BA_LEFT_FOOT_PASS_BACK",
            BA_LEFT_FOOT_PASS_RIGHT: "BA_LEFT_FOOT_PASS_RIGHT",
            BA_LEFT_FOOT_PASS_LEFT: "BA_LEFT_FOOT_PASS_LEFT",
            BA_RIGHT_FOOT_PASS_FWD: "短传(R)",
            BA_RIGHT_FOOT_PASS_BACK: "BA_RIGHT_FOOT_PASS_BACK",
            BA_RIGHT_FOOT_PASS_RIGHT: "BA_RIGHT_FOOT_PASS_RIGHT",
            BA_RIGHT_FOOT_PASS_LEFT: "BA_RIGHT_FOOT_PASS_LEFT",
            BA_PICK_UP_BALL: "捡起球",
            BA_DROP_BALL: "放下球",
            BA_HEADER: "争顶",
            BA_TRIP: "丢失球权",
            BA_CELEBRATE: "庆祝进球",
            BA_GK_READY: "准备扑救",
            BA_GK_ACRO_LEFT: "ACRO(L)",
            BA_GK_ACRO_LEFT_HOLD: "ACRO_HOLD(L)",
            BA_GK_ACRO_RIGHT: "ACRO(R)",
            BA_GK_ACRO_RIGHT_HOLD: "ACRO_HOLD(R)",
            BA_GK_SIDESTEP_LEFT: "移动(L)",
            BA_GK_SIDESTEP_RIGHT: "移动(R)",
            BA_GK_KICK: "BA_GK_KICK",
            BA_GK_THROW_BALL: "BA_GK_THROW_BALL",
            BA_GK_STRETCH_LEFT: "BA_GK_STRETCH_LEFT",
            BA_GK_STRETCH_LEFT_HOLD: "BA_GK_STRETCH_LEFT_HOLD",
            BA_GK_STRETCH_RIGHT: "BA_GK_STRETCH_RIGHT",
            BA_GK_STRETCH_RIGHT_HOLD: "BA_GK_STRETCH_RIGHT_HOLD",
            BA_BALL_OWNER: "控球",
            BA_TACKLE: "上抢",
            BA_SLIDING_TACKLE: "BA_SLIDING_TACKLE",
            BA_SLIDING_TACKLE_STAND: "BA_SLIDING_TACKLE_STAND",
            BA_MAX: "BA_MAX",
            BA_MY_1001: "头球攻门(L)",
            BA_MY_1002: "头球攻门(R)",
            BA_MY_1003: "卸下球",
            BA_MY_1011: "上抢(成功)",
            BA_MY_1012: "上抢(失败)",
            Unknown: "未知"


            ,
            training_pos: "无教练",
            training_camp: "进营",
            training_coach: "有教练",
            training_ycc: "调整",
            training_itc: "强化",
            training_neg: "掉球",
            training_unit: "格",
            training_unknown: "未知训练类型",
            training_ball_day: "离下一次涨球训练天数",
            training_part: "分段训练效率",
            training_total: "进度",
            training_avg: "平均",
            training_now: "当前训练进度",
            SkillsAnalysisTitle: "点击可手动着色和分析训练效率 快捷键:ALT + S",
            SkillsAnalysis: "训练效率分析"


            ,

            sug_T0: "首选:",
            sug_T1: "次选:",
            sug_T2: "可尝试:",
            sug_T3: "默认:",

            Pos9: "后卫",
            Pos7: "门将",
            Pos10: "边锋",
            Pos5: "前锋",
            Pos4: "中场",
            Pos56: "中锋",
            Pos21: "后腰",
            Pos22: "边卫",
            Pos23: "前腰",
            PosScores: "位置评分",
            Scores: "评分",

            sug_Loser: "关键属性容易早死，尽早交换或开除。",

            sug_PRI: "训练顺序:",
            attrName1: "速度",
            attrName2: "耐力",
            attrName3: "意识",
            attrName4: "传球",
            attrName5: "射门",
            attrName6: "头球",
            attrName7: "守门",
            attrName8: "控球",
            attrName9: "抢断",
            attrName10: "传中",
            attrName11: "定位"

            ,
            scoutReport: "球探报告"
            ,
            now: "当前",
            future: "可达",
            max: "最大可能"
        }
        ,

        en: {
            Name: "English",
            GetPlayersHtml: "Get players page",
            GetPlayersHtml2: "Get players page(No cache)",
            Clear: "Clear Cache",
            Save: "Save",
            Setting: "Setting",
            Test: "Test",
            SettingTitle: "Click setting language",
            Language: "Language",
            XmlMode: "Tactical Export Model",
            XmlMode1: "Sequential selection",
            XmlMode2: "Choose by location(need submit data to server)",
            TacConf: "Tactical Coefficient Setting",
            AutoRun: "Auto Colorable",
            AutoRun0: "By page loaded(Once)",
            AutoRun1: "By MZ Refresh",
            Pay: "Support the author.",

            NotSureEx: "Skills may change after entering the transfer market.<br/>Change time ",
            NotSure: "Uncertain skill",
            ManualColorTitle: "Click the Colorable Skill. Shortcut key : ALT + A",
            ManualColor: "Colorable Skill",
            Jijing: "Events",
            dongzuo: "PlayerStatus",
            Copyxml1: "CopyXML(home)",
            Copyxml2: "CopyXML(away)",
            CopyXml: "The data has been copied to the clipboard!",
            CopyXmlMsg: "The tactic was copied to the Clipboard!",
            CopyXmlMsgError: "Copy error!",
            BA_NORMAL: "Normal",
            BA_WALL: "Wall",
            BA_HOLD: "Hold",
            BA_DOWN: "Down",
            BA_HOLD_THROWIN: "HoldThrowin",
            BA_THROWIN: "Throwin",
            BA_LEFT_FOOT_SHOT_FWD: "FootShot(L)",
            BA_LEFT_FOOT_SHOT_BACK: "FootShotBack(L)",
            BA_LEFT_FOOT_SHOT_RIGHT: "FootShotRight(L)",
            BA_LEFT_FOOT_SHOT_LEFT: "FootShotLeft(L)",
            BA_RIGHT_FOOT_SHOT_FWD: "FootShot(R)",
            BA_RIGHT_FOOT_SHOT_BACK: "FootShotBack(R)",
            BA_RIGHT_FOOT_SHOT_RIGHT: "FootShotRight(R)",
            BA_RIGHT_FOOT_SHOT_LEFT: "FootShotLeft(R)",
            BA_LEFT_FOOT_PASS_FWD: "FootPass(L)",
            BA_LEFT_FOOT_PASS_BACK: "FootPassBack(L)",
            BA_LEFT_FOOT_PASS_RIGHT: "FootPassRight(L)",
            BA_LEFT_FOOT_PASS_LEFT: "FootPassLeft(L)",
            BA_RIGHT_FOOT_PASS_FWD: "FootPass(R)",
            BA_RIGHT_FOOT_PASS_BACK: "FootPassBack(R)",
            BA_RIGHT_FOOT_PASS_RIGHT: "FootPassRight(R)",
            BA_RIGHT_FOOT_PASS_LEFT: "FootPassLeft(R)",
            BA_PICK_UP_BALL: "PickUpBall",
            BA_DROP_BALL: "DropBall",
            BA_HEADER: "Header",
            BA_TRIP: "Trip",
            BA_CELEBRATE: "Celebrate",
            BA_GK_READY: "GkReady",
            BA_GK_ACRO_LEFT: "GkAcroLeft",
            BA_GK_ACRO_LEFT_HOLD: "GkAcroLeftHold",
            BA_GK_ACRO_RIGHT: "GkAcroRight",
            BA_GK_ACRO_RIGHT_HOLD: "GkAcroRightHold",
            BA_GK_SIDESTEP_LEFT: "GkSidestepLeft",
            BA_GK_SIDESTEP_RIGHT: "GkSidestepRight",
            BA_GK_KICK: "GkKick",
            BA_GK_THROW_BALL: "GkThrowBall",
            BA_GK_STRETCH_LEFT: "GkStretchLeft",
            BA_GK_STRETCH_LEFT_HOLD: "GkStretchLeftHold",
            BA_GK_STRETCH_RIGHT: "GkStretchRight",
            BA_GK_STRETCH_RIGHT_HOLD: "GkStretchRightHold",
            BA_BALL_OWNER: "BallOwner",
            BA_TACKLE: "Tackle",
            BA_SLIDING_TACKLE: "SlidingTackle",
            BA_SLIDING_TACKLE_STAND: "SlidingTackleStand",
            BA_MAX: "Max",
            BA_MY_1001: "HeadGoal(L)",
            BA_MY_1002: "HeadGoal(R)",
            BA_MY_1003: "StopTheBall",
            BA_MY_1011: "Tackle(Success)",
            BA_MY_1012: "Tackle(Fail)",
            Unknown: "Unknown"



            ,
            training_pos: "No coach",
            training_camp: "CAMP",
            training_coach: "Coach",
            training_ycc: "Ycc",
            training_itc: "Itc",
            training_neg: "Neg",
            training_unit: "↑",
            training_unknown: "Unknown training",
            training_ball_day: "Next ball days",
            training_part: "Training efficiency",
            training_total: "Total",
            training_avg: "Avg",
            training_now: "Now",
            SkillsAnalysisTitle: "Colorable Skill and Analysis of Training Efficiency Shortcut key :ALT + S",
            SkillsAnalysis: "Colorable By Graphs"



            ,
            sug_T0: "First plan:",
            sug_T1: "Second plan:",
            sug_T2: "May try:",
            sug_T3: "Default:",

            Pos9: "CB",
            Pos7: "GK",
            Pos10: "WF",
            Pos5: "ST",
            Pos4: "MF",
            Pos56: "CF",
            Pos21: "DM",
            Pos22: "WB",
            Pos23: "AMF",
            PosScores: "Tactics score",
            Scores: "Scores",

            sug_Loser: "Key skills too low.Exchange or dismiss as soon as possible.",

            sug_PRI: "Training order:",
            attrName1: "Speed",
            attrName2: "Stamina",
            attrName3: "Play Intelligence",
            attrName4: "Passing",
            attrName5: "Shooting",
            attrName6: "Heading",
            attrName7: "Keeping",
            attrName8: "Ball Control",
            attrName9: "Tackling",
            attrName10: "Aerial Passing",
            attrName11: "Set Plays"
            ,
            scoutReport: "Scout Report",
            now: "now",
            future: "attainable",
            max: "max"
        }

        ,
        es: {
            Name: "Español",
            GetPlayersHtml: "Página de jugadores",
            GetPlayersHtml2: "Página de jugadores(sin caché)",
            Clear: "Vaciar el caché",
            Save: "Guardar",
            Setting: "Ajustes",
            Test: "Test",
            SettingTitle: "Haga clic en configuración Idioma",
            Language: "Idioma",

            XmlMode: "Tactical Export Model",
            XmlMode1: "Secuencia de selección",
            XmlMode2: "Elegir por locación (necesita suministrar datos al servidor)",
            TacConf: "Tactical Coefficient Setting",
            AutoRun: "Auto Coloreable",
            AutoRun0: "Por página cargada (sólo una vez)",
            AutoRun1: "Por recargar MZ",
            Pay: "Apoya al autor.",

            NotSureEx: "Las skills pueden cambiar después de ingresar al mercado. <br/> Cambiar hora ",
            NotSure: "Skill incierta",
            ManualColorTitle: "Haga clic en la skill para colorear. Acceso directo: ALT + A",
            ManualColor: "Color de la skill",
            Jijing: "Eventos",
            dongzuo: "PlayerStatus",
            Copyxml1: "CopiarXML(local)",
            Copyxml2: "CopiarXML(visitante)",
            CopyXml: "Los datos se han copiado al portapapeles",
            CopyXmlMsg: "La táctica fue copiada al portapapeles",
            CopyXmlMsgError: "¡Error al copiar!",
            BA_NORMAL: "Normal",
            BA_WALL: "Wall",
            BA_HOLD: "Hold",
            BA_DOWN: "Down",
            BA_HOLD_THROWIN: "HoldThrowin",
            BA_THROWIN: "Throwin",
            BA_LEFT_FOOT_SHOT_FWD: "FootShot(L)",
            BA_LEFT_FOOT_SHOT_BACK: "FootShotBack(L)",
            BA_LEFT_FOOT_SHOT_RIGHT: "FootShotRight(L)",
            BA_LEFT_FOOT_SHOT_LEFT: "FootShotLeft(L)",
            BA_RIGHT_FOOT_SHOT_FWD: "FootShot(R)",
            BA_RIGHT_FOOT_SHOT_BACK: "FootShotBack(R)",
            BA_RIGHT_FOOT_SHOT_RIGHT: "FootShotRight(R)",
            BA_RIGHT_FOOT_SHOT_LEFT: "FootShotLeft(R)",
            BA_LEFT_FOOT_PASS_FWD: "FootPass(L)",
            BA_LEFT_FOOT_PASS_BACK: "FootPassBack(L)",
            BA_LEFT_FOOT_PASS_RIGHT: "FootPassRight(L)",
            BA_LEFT_FOOT_PASS_LEFT: "FootPassLeft(L)",
            BA_RIGHT_FOOT_PASS_FWD: "FootPass(R)",
            BA_RIGHT_FOOT_PASS_BACK: "FootPassBack(R)",
            BA_RIGHT_FOOT_PASS_RIGHT: "FootPassRight(R)",
            BA_RIGHT_FOOT_PASS_LEFT: "FootPassLeft(R)",
            BA_PICK_UP_BALL: "Toma la pelota",
            BA_DROP_BALL: "Tira la pelota al césped",
            BA_HEADER: "Cabezazo",
            BA_TRIP: "Trip",
            BA_CELEBRATE: "Celebración",
            BA_GK_READY: "Arquero preparado",
            BA_GK_ACRO_LEFT: "GkAcroLeft",
            BA_GK_ACRO_LEFT_HOLD: "GkAcroLeftHold",
            BA_GK_ACRO_RIGHT: "GkAcroRight",
            BA_GK_ACRO_RIGHT_HOLD: "GkAcroRightHold",
            BA_GK_SIDESTEP_LEFT: "Arquero da un paso a la izquierda",
            BA_GK_SIDESTEP_RIGHT: "Arquero da un paso a la derecha",
            BA_GK_KICK: "Arquero da una patada",
            BA_GK_THROW_BALL: "GkThrowBall",
            BA_GK_STRETCH_LEFT: "GkStretchLeft",
            BA_GK_STRETCH_LEFT_HOLD: "GkStretchLeftHold",
            BA_GK_STRETCH_RIGHT: "GkStretchRight",
            BA_GK_STRETCH_RIGHT_HOLD: "GkStretchRightHold",
            BA_BALL_OWNER: "Con la pelota en los pies",
            BA_TACKLE: "Entrada",
            BA_SLIDING_TACKLE: "Barrida",
            BA_SLIDING_TACKLE_STAND: "SlidingTackleStand",
            BA_MAX: "Max",
            BA_MY_1001: "HeadGoal(L)",
            BA_MY_1002: "HeadGoal(R)",
            BA_MY_1003: "Frena la pelota",
            BA_MY_1011: "Entrada(acertada)",
            BA_MY_1012: "Entrada(fallida)",
            Unknown: "Desconocido"


            ,
            training_pos: "Sin entrenador",
            training_camp: "CAMP",
            training_coach: "Coach",
            training_ycc: "YCC",
            training_itc: "ITC",
            training_neg: "Neg",
            training_unit: "↑",
            training_unknown: "Entrenamiento desconocido",
            training_ball_day: "Días para ganar una pelotita",
            training_part: "Eficacia de entrenamiento",
            training_total: "Total",
            training_avg: "Avg",
            training_now: "Ahora",
            SkillsAnalysisTitle: "Skills y análisis de eficacia de entrenamiento coloreables al presionar: ALT + S",
            SkillsAnalysis: "Coloreable por gráficos"


            ,
            sug_T0: "Primera opción:",
            sug_T1: "Segunda opción:",
            sug_T2: "Podrías intentar:",
            sug_T3: "Predeterminado:",

            Pos9: "Centro defensor",
            Pos7: "Arquero",
            Pos10: "Delantero lateral",
            Pos5: "Segundo delantero",
            Pos4: "Centrocampista",
            Pos56: "Miediocampista/Anchor",
            Pos21: "DM",
            Pos22: "WB",
            Pos23: "AMF",
            PosScores: "Puntuación táctica",
            Scores: "Puntuación",

            sug_Loser: "Habilidades clave demasiado bajas. Intercambialo lo más antes posible.",

            sug_PRI: "Orden de entrenamiento:",
            attrName1: "Velocidad",
            attrName2: "Resistencia",
            attrName3: "Inteligencia",
            attrName4: "Pases",
            attrName5: "Remates",
            attrName6: "Cabezazos",
            attrName7: "Atajando",
            attrName8: "Control de balón",
            attrName9: "Entradas",
            attrName10: "Pases Largos",
            attrName11: "Balón Parado"
            ,
            scoutReport: "REPORTE DE SCOUTEO",
            now: "ahora",
            future: "realizable",
            max: "máximo"
        }
        ,

        br: {
            Name: "Português",
            GetPlayersHtml: "Página de jogadores",
            GetPlayersHtml2: "Página de jugadores(sem cache)",
            Clear: "Esvaziar o cache",
            Save: "Salvar",
            Setting: "Configurações",
            Test: "Teste",
            SettingTitle: "Clique para configurar linguagem",
            Language: "Linguagem",
            XmlMode: "Exportar Modelo Tático",
            XmlMode1: "Seleção Sequencial",
            XmlMode2: "Escolha localização (precisa submeter dados ao servidor)",
            TacConf: "Configuração de Coeficiente Tático",
            AutoRun: "Auto Colorir",
            AutoRun0: "Por página carregada(Uma vez)",
            AutoRun1: "Recarregada do MZ",
            Pay: "Apoie o autor.",

            NotSureEx: "Habilidades podem mudar depois de entrar no mercado de transferências.<br/>Hora da mudança ",
            NotSure: "Habilidade incerta",
            ManualColorTitle: "Clique na habilidade colorida. Tecla de atalho: ALT + A",
            ManualColor: "Habilidade colorida",
            Jijing: "Eventos",
            dongzuo: "Status do jogador",
            Copyxml1: "Copiar XML(mandante)",
            Copyxml2: "Copiar XML(visitante)",
            CopyXml: "Os dados foram copiados para a área de transferência!",
            CopyXmlMsg: "A tática foi copiada para a área de transferências!",
            CopyXmlMsgError: "Erro na cópia!",
            BA_NORMAL: "Normal",
            BA_WALL: "Wall",
            BA_HOLD: "Hold",
            BA_DOWN: "Down",
            BA_HOLD_THROWIN: "HoldThrowin",
            BA_THROWIN: "Throwin",
            BA_LEFT_FOOT_SHOT_FWD: "FootShot(L)",
            BA_LEFT_FOOT_SHOT_BACK: "FootShotBack(L)",
            BA_LEFT_FOOT_SHOT_RIGHT: "FootShotRight(L)",
            BA_LEFT_FOOT_SHOT_LEFT: "FootShotLeft(L)",
            BA_RIGHT_FOOT_SHOT_FWD: "FootShot(R)",
            BA_RIGHT_FOOT_SHOT_BACK: "FootShotBack(R)",
            BA_RIGHT_FOOT_SHOT_RIGHT: "FootShotRight(R)",
            BA_RIGHT_FOOT_SHOT_LEFT: "FootShotLeft(R)",
            BA_LEFT_FOOT_PASS_FWD: "FootPass(L)",
            BA_LEFT_FOOT_PASS_BACK: "FootPassBack(L)",
            BA_LEFT_FOOT_PASS_RIGHT: "FootPassRight(L)",
            BA_LEFT_FOOT_PASS_LEFT: "FootPassLeft(L)",
            BA_RIGHT_FOOT_PASS_FWD: "FootPass(R)",
            BA_RIGHT_FOOT_PASS_BACK: "FootPassBack(R)",
            BA_RIGHT_FOOT_PASS_RIGHT: "FootPassRight(R)",
            BA_RIGHT_FOOT_PASS_LEFT: "FootPassLeft(R)",
            BA_PICK_UP_BALL: "Pega a bola",
            BA_DROP_BALL: "Deixa a bola",
            BA_HEADER: "Cabeceio",
            BA_TRIP: "Trip",
            BA_CELEBRATE: "Celebração",
            BA_GK_READY: "Goleiro pronto",
            BA_GK_ACRO_LEFT: "GkAcroLeft",
            BA_GK_ACRO_LEFT_HOLD: "GkAcroLeftHold",
            BA_GK_ACRO_RIGHT: "GkAcroRight",
            BA_GK_ACRO_RIGHT_HOLD: "GkAcroRightHold",
            BA_GK_SIDESTEP_LEFT: "Goleiro dá passo à esquerda",
            BA_GK_SIDESTEP_RIGHT: "Goleiro dá passo à direita",
            BA_GK_KICK: "Goleiro chuta",
            BA_GK_THROW_BALL: "GkThrowBall",
            BA_GK_STRETCH_LEFT: "GkStretchLeft",
            BA_GK_STRETCH_LEFT_HOLD: "GkStretchLeftHold",
            BA_GK_STRETCH_RIGHT: "GkStretchRight",
            BA_GK_STRETCH_RIGHT_HOLD: "GkStretchRightHold",
            BA_BALL_OWNER: "Com a bola nos pés",
            BA_TACKLE: "Desarme",
            BA_SLIDING_TACKLE: "Carrinho",
            BA_SLIDING_TACKLE_STAND: "SlidingTackleStand",
            BA_MAX: "Max",
            BA_MY_1001: "HeadGoal(L)",
            BA_MY_1002: "HeadGoal(R)",
            BA_MY_1003: "Pára a bola",
            BA_MY_1011: "Desarme(Sucesso)",
            BA_MY_1012: "Desarme(Falha)",
            Unknown: "Desconhecido"



            ,
            training_pos: "Sem treinador",
            training_camp: "CAMP",
            training_coach: "Coach",
            training_ycc: "Ycc",
            training_itc: "Itc",
            training_neg: "Neg",
            training_unit: "↑",
            training_unknown: "Treinamento desconhecido",
            training_ball_day: "Dias para ganhar bola",
            training_part: "Eficiência de treinamento",
            training_total: "Total",
            training_avg: "Avg",
            training_now: "Agora",
            SkillsAnalysisTitle: "Tecla de atalho de Habilidades coloridas e Análise de Eficiência de treinamento: ALT + S",
            SkillsAnalysis: "Colorir por gráficos"



            ,
            sug_T0: "Primeira opção:",
            sug_T1: "Segunda opção:",
            sug_T2: "Pode tentar:",
            sug_T3: "Padrão:",

            Pos9: "Zagueiro central",
            Pos7: "Goleiro",
            Pos10: "Ponta",
            Pos5: "Segundo atacante",
            Pos4: "Meia Central",
            Pos56: "Meio-campo/Volante",
            Pos21: "DM",
            Pos22: "WB",
            Pos23: "AMF",
            PosScores: "Pontuação tática",
            Scores: "Pontuação",

            sug_Loser: "Habilidades principais muito baixas. Troque ou dispense o mais breve possível.",

            sug_PRI: "Ordem de treinamento:",
            attrName1: "Velocidade",
            attrName2: "Resistência",
            attrName3: "Inteligência",
            attrName4: "Passe Curto",
            attrName5: "Chute",
            attrName6: "Cabeceio",
            attrName7: "Defesa a Gol",
            attrName8: "Controle de Bola",
            attrName9: "Desarme",
            attrName10: "Passe Longo",
            attrName11: "Bola Parada"
            ,
            scoutReport: "Relatório de Observador",
            now: "agora",
            future: "realizável",
            max: "máximo"
        }
    }
    ,
    scoutLocList: { "9": { "Prop": { "1": 0, "2": 0, "9": 1, "10": 2, "8": 2, "3": 2, "4": 2, "6": 2 }, "Order": [1, 2, 9, 10, 8, 3, 4, 6], "CampKey": "9" }, "7": { "Prop": { "2": 0, "7": 1, "3": 1, "1": 1, "10": 2, "11": 2, "8": 2 }, "Order": [2, 7, 3, 1, 10, 11, 8], "CampKey": "7" }, "10": { "Prop": { "1": 0, "2": 0, "10": 1, "8": 1, "9": 2, "4": 2, "5": 2, "6": 2 }, "Order": [1, 2, 10, 8, 9, 4, 5, 6], "CampKey": "10" }, "5": { "Prop": { "1": 0, "2": 0, "5": 1, "8": 1, "6": 1, "3": 2, "4": 2, "10": 2, "9": 2 }, "Order": [1, 2, 5, 8, 6, 3, 4, 10, 9], "CampKey": "5" }, "4": { "Prop": { "1": 0, "2": 0, "4": 1, "8": 1, "3": 1, "10": 2, "9": 2, "5": 2, "6": 2 }, "Order": [1, 2, 4, 8, 3, 10, 9, 5, 6], "CampKey": "4" }, "5,6": { "Prop": { "2": 0, "1": 0, "5": 1, "6": 1, "8": 1, "3": 2, "4": 2, "10": 2, "9": 2 }, "Order": [2, 1, 5, 8, 6, 3, 4, 10, 9], "CampKey": "56" } }
    ,
    OKeys: ["9", "7", "10", "5", "4", "5,6"]
    ,
    CTable: function () {
        //key value
        this.data = {};
        //keys
        this.keys = new Array();
        this.addData = function (key, value) {
            if (this.data[key] == undefined) {
                this.keys.push(key);
                this.keys.sort(function (a, b) {
                    return a - b;
                });
            }
            this.data[key] = value;
        };
        this.getVal = function (i) {
            if (this.data[i] == undefined) {
                //
            } else {
                return this.data[i];
            }
        };
        this.GetX = function (i) {
            let rv = this.getVal(i);
            rv = Math.floor(rv * 214 / 1000) - 3;
            return rv;
        };
        this.GetY = function (i) {
            let rv = this.getVal(i);
            rv = Math.floor(rv * 328 / 1000) - 1;
            return rv;
        };
    }
    ,

    mzcamp: function () {
        this.data = {};
        this.name = null;
        this.keys = new Array();
        this.index = 0;
        this.add = function (begin, end) {
            if (end > begin + 2937600000) {
                end = begin + 2937600000;
            }
            if (this.data[begin] == undefined) {
                this.keys.push(begin);
                this.keys.sort(function (a, b) {
                    return a - b;
                });
            }
            this.data[begin] = {
                begin: begin,
                end: end
            };
        };
        this.getItem = function (begin) {
            return this.data[begin];
        };
        this.resetIndex = function () {
            this.index = 0;
        };
        this.inYTC = function (x) {
            while (this.index < this.keys.length) {
                let item = this.data[this.keys[this.index]];
                if (x < item.begin) {
                    return false;
                } else if (x <= item.end) {
                    if (/\d/.test(item.name)) {
                        return false;
                    }
                    return true;
                }
                if (x > item.end) {
                    this.index++;
                }
            }
            return false;
        };
    }
    ,
    playerTrainingBySkill: function () {
        //涨球时间
        this.ballDay = 0;
        //训练统计
        this.stat = new vanGmMzModel.trainingStat();
        //当前球数
        this.skill = 0;
        //最后一次训练
        this.lt = 0;
    }
    ,
    trainingStat: function () {
        //所有 不包含掉球
        this.all = new vanGmMzModel.trainingDay();
        ////普通训练 无教练
        //this.pos = new vanGmMzModel.trainingDay();
        ////强化营
        //this.itc = new vanGmMzModel.trainingDay();
        ////调整营
        //this.ycc = new vanGmMzModel.trainingDay();
        ////掉球
        //this.neg = new vanGmMzModel.trainingDay();
        ////理疗
        //this.physio = new vanGmMzModel.trainingDay();
        ////有教练
        //this.coach = new vanGmMzModel.trainingDay();
        ////训练营
        //this.camp = new vanGmMzModel.trainingDay();
        //对某类型加1
        this.add = function (type, tn) {
            if (!this[type]) {
                this[type] = new vanGmMzModel.trainingDay();
            }
            this[type][tn] += 1;

        };
        this.getSum = function (canOver100) {
            let ret = 0;
            if (this.neg) {
                ret = this.all.getSum() - this.neg.getSum();
            } else {
                ret = this.all.getSum();
            }
            if (!canOver100) {
                if (ret >= 100) {
                    ret = 99.99;
                }
            }
            return ret;
        };
        this.getAvg = function () {
            //let ret = this.getSum() / (this.t1 * 1 + this.t2 * 1 + this.t3 * 1 + this.t4 * 1 + this.t5 * 1 + this.t6 * 1 + this.t7 * 1 + this.t8 * 1 + this.t9 * 1 + this.t10 * 1);
            //ret = parseFloat(ret).toFixed(1);
            //return ret;
            if (this.neg) {
                return -this.neg.getAvg();
            } else {
                return this.all.getAvg();
            }
        };
        this.getTnText = function (now_language) {
            let str = "";
            if (this.pos) {
                str += " " + now_language.training_pos + this.pos.getTnText(now_language);
            }
            if (this.camp) {
                str += " " + now_language.training_camp + this.camp.getTnText(now_language);
            }
            if (this.coach) {
                str += " " + now_language.training_coach + this.coach.getTnText(now_language);
            }
            if (this.ycc) {
                str += " " + now_language.training_ycc + this.ycc.getTnText(now_language);
            }
            if (this.itc) {
                str += " " + now_language.training_itc + this.itc.getTnText(now_language);
            }
            if (this.neg) {
                str += " " + now_language.training_neg + this.neg.getTnText(now_language);
            }
            return str;
        };
        //this.getAvgAndText = function () {
        //    //let ret = this.getSum() / (this.t1 * 1 + this.t2 * 1 + this.t3 * 1 + this.t4 * 1 + this.t5 * 1 + this.t6 * 1 + this.t7 * 1 + this.t8 * 1 + this.t9 * 1 + this.t10 * 1);
        //    //ret = parseFloat(ret).toFixed(1);
        //    //return ret;

        //    let ret = this.getAvg();
        //    let str = "";
        //    if (ret <= 0.4) {
        //        str = "1格";
        //    }
        //    else if (ret > 0.4 && ret <= 1.1) {
        //        str = "2格";
        //    }
        //    else if (ret > 0.4 && ret <= 2.1) {
        //        str = "2格";
        //    }



        //          this.t1  * 0.4  * 1
        //        + this.t2  * 0.55 * 2
        //        + this.t3  * 0.7  * 3
        //        + this.t4  * 0.85 * 4
        //        + this.t5  * 1    * 5
        //        + this.t6  * 1.15 * 6
        //        + this.t7  * 1.3  * 7
        //        + this.t8  * 1.45 * 8
        //        + this.t9  * 1.6  * 9
        //        + this.t10 * 1.75 * 10;
        //};
        this.getDayByAvg = function (avg) {
            let ret = (100 - this.getSum()) / avg;
            ret = parseFloat(ret).toFixed(1);
            return ret;
        };
        this.getDay = function () {
            if (this.coach) {
                return this.getDayByAvg(this.coach);
            } else if (this.pos) {
                return this.getDayByAvg(this.pos);
            }
            return undefined;
        };
    }
    ,
    trainingDay: function () {
        this.t1 = 0;
        this.t2 = 0;
        this.t3 = 0;
        this.t4 = 0;
        this.t5 = 0;
        this.t6 = 0;
        this.t7 = 0;
        this.t8 = 0;
        this.t9 = 0;
        this.t10 = 0;
        this.getSum = function () {
            let ret = this.t1 * 0.645 * 1 + this.t2 * 0.55 * 2 + this.t3 * 0.7 * 3 + this.t4 * 0.85 * 4 + this.t5 * 0.96 * 5 + this.t6 * 1.111 * 6 + this.t7 * 1.3 * 7 + this.t8 * 1.6 * 8 + this.t9 * 2.02 * 9 + this.t10 * 2.4 * 10;
            ret = parseFloat(ret).toFixed(1);
            return ret;
        };
        this.getAvg = function () {
            let ret = this.getSum() / (this.t1 * 1 + this.t2 * 1 + this.t3 * 1 + this.t4 * 1 + this.t5 * 1 + this.t6 * 1 + this.t7 * 1 + this.t8 * 1 + this.t9 * 1 + this.t10 * 1);
            ret = parseFloat(ret).toFixed(1);
            return ret;
        };
        this.getTnText = function (now_language) {
            let str = "";
            if (this.t1 > 0) {
                str += " 1" + now_language.training_unit + "(" + this.t1 + ")";
            }
            if (this.t2 > 0) {
                str += " 2" + now_language.training_unit + "(" + this.t2 + ")";
            }
            if (this.t3 > 0) {
                str += " 3" + now_language.training_unit + "(" + this.t3 + ")";
            }
            if (this.t4 > 0) {
                str += " 4" + now_language.training_unit + "(" + this.t4 + ")";
            }
            if (this.t5 > 0) {
                str += " 5" + now_language.training_unit + "(" + this.t5 + ")";
            }
            if (this.t6 > 0) {
                str += " 6" + now_language.training_unit + "(" + this.t6 + ")";
            }
            if (this.t7 > 0) {
                str += " 7" + now_language.training_unit + "(" + this.t7 + ")";
            }
            if (this.t8 > 0) {
                str += " 8" + now_language.training_unit + "(" + this.t8 + ")";
            }
            if (this.t9 > 0) {
                str += " 9" + now_language.training_unit + "(" + this.t9 + ")";
            }
            if (this.t10 > 0) {
                str += " 10" + now_language.training_unit + "(" + this.t10 + ")";
            }
            return str;
        };
    }
    ,
    mzreg: {
        td_skill_val: /(\d+)/,
        img_val: /(\d+)\.gif/,
        playerMax: /trainingField.players\s*=\s*({.+})/,
        playerId: /player_id_(\d+)/,
        bar_itc: /bar_itc_(\d+)/,
        bar_ycc: /bar_ycc_(\d+)/,
        bar_pos: /bar_pos_(\d+)/,
        bar_neg: /bar_neg_(\d+)/,
        trainingType: /&t=([^)]+)/,
        data2d_url: /matchviewer\/media/,
        shortlist_url: /\/?p=shortlist/,
        ruok_url: /\/?p=team&tid=572357/,
        playerId_tac: /pid=(\d+)/,
        matchResult: /\/?p=match&sub=result&mid=(\d+)/,
        nocache: /nocache-\d+/
        //data2d_url: /matchviewer\/getMatchFiles.php\?type=data&mid=\d+/
    },
    mzImg: {
        g: "data:image/gif;base64,R0lGODlhDAAKAJEDAP///8zM/wAA/////yH5BAEAAAMALAAAAAAMAAoAAAIk3CIpYZ0BABJtxvjMgojTIVwKpl0dCQbQJX3T+jpLNDXGlDUFADs=",
        r: "data:image/gif;base64,R0lGODlhDAAKAJEDAP////8AAMyZmf///yH5BAEAAAMALAAAAAAMAAoAAAIk3BQZYp0CAAptxvjMgojTEVwKpl0dCQrQJX3T+jpLNDXGlDUFADs=",
        b: "data:image/gif;base64,R0lGODlhDAAKAJEDAP///5mZmQAAAP///yH5BAEAAAMALAAAAAAMAAoAAAIk3CIpYZ0BABJtxvjMgojTIVwKpl0dCQbQJX3T+jpLNDXGlDUFADs=",
        p: "data:image/gif;base64,R0lGODlhDAAKAJEDAP///5lm/5kzzP///yH5BAEAAAMALAAAAAAMAAoAAAIk3CIpYZ0BABJtxvjMgojTIVwKpl0dCQbQJX3T+jpLNDXGlDUFADs=",
        x: "data:image/gif;base64,R0lGODlhBgAKAJEDAJnMZpmZmQAAAP///yH5BAEAAAMALAAAAAAGAAoAAAIRXCRhApAMgoPtVXXS2Lz73xUAOw=="
    },
    hImg: {
        g: "data:image/gif;base64,R0lGODlhDAAKALMNAOnt/+Xr/9ri/6/A/6G1/73L/52x/8/Z/4Wf/32Z/1x9/0Rr/x9N/////wAAAAAAACH5BAEAAA0ALAAAAAAMAAoAAAQwsDXD2FJB6sot0UnHLYckdoJ5VmmzWoi0nAuxSIEyW0qxJBrFAAAYKCoaSYgD1EQAADs=",
        r: "data:image/gif;base64,R0lGODlhDAAKANUkAOXq//8pKunt//ZTVPz19dXZ+tzk/+NAV+bl+Ojs//4wMeWkreXp/f4tLvRMT+Dm/+Xr/7lra/4vMepKSv7///ZRUvz8/tmHhs/Z/+xKSfVeYNCJkfhFRPUxOuBUZvRsb9ri//39//hDQv8oKf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACQALAAAAAAMAAoAAAZCQBLpMhqJMgiLkEQoOkeDwnLzdIowwuoTlNUWDRSSF/oIkUQBZ6BRAWiEkIlopPgsEhzPMgIQCBgOEiNLQh1PB4RBADs=",
        b: "data:image/gif;base64,R0lGODlhDAAKAMQUALW1teLi4oCAgMDAwB0dHevr6+3t7aCgoDMzM9nZ2bOzs0pKSszMzC0tLX9/f19fXz8/P5qamhISEgAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABQALAAAAAAMAAoAAAU1IEUpkgQ5hahObNsAatTOTyLOMxHcOKvzvcdB1Oi9FqKCA1I6MR4RlWBgMAwEiIlKJGtFVSEAOw==",
        p: "data:image/gif;base64,R0lGODlhDAAKALMNAOnt/+Xr/9ri/6/A/6G1/73L/52x/8/Z/4Wf/32Z/1x9/4tQ/30+/////wAAAAAAACH5BAEAAA0ALAAAAAAMAAoAAAQwsDXD2FJB6sot0UnHLYckdoJ5VmmzWoi0nAuxSIEyW0qxJBrFAAAYKCoaSYgD1EQAADs=",
        x: "data:image/gif;base64,R0lGODlhBgAKAJEDAJnMZpmZmQAAAP///yH5BAEAAAMALAAAAAAGAAoAAAIRXCRhApAMgoPtVXXS2Lz73xUAOw=="
    }
    ,
    //以下为2D比赛辅助
    MatchEvent: function () {
        this.data = new Array();
        this.setAllPlayerEvent = function (team, tc) {
            for (let i = 0; i < tc.length; i++) {
                this.data.push(tc[i]);
            }

            for (let i = 0; i < team.m_players.length; i++) {
                let len = team.m_players[i].m_events.getLength();
                for (let j = 0; j < len; j++) {
                    this.data.push(team.m_players[i].m_events.at(j));
                }
            }
        };
        this.Sort = function () {
            this.data.sort(function (a, b) {
                return a.m_frame - b.m_frame;
            });
        };
    }
    ,
    OutOfPlay: function () {
        this.data = new Array();
        this.add = function (begin, end) {
            this.data.push({
                begin: begin,
                end: end
            });
        };
        this.resetIndex = function () {
            this.index = 0;
        };
        this.notin = function (frame) {
            while (this.index < this.data.length) {
                let item = this.data[this.index];
                if (frame < item.begin) {
                    return true;
                } else if (frame <= item.end) {
                    return false;
                }
                if (frame > item.end) {
                    this.index++;
                }
            }
            return true;
        };
        this.Sort = function () {
            this.data.sort(function (a, b) {
                return a.begin - b.begin;
            });
        }
    }

};

var vanGmMz = {
    now_sport: "soccer",
    now_language: vanGmMzModel.language.en
    ,
    pmax: {},
    tacP: {},
    tacCof: {},
    trainingInfo: {},
    vv: "",

    getMax: function (callback) {
        vple.ajax(
            "/?p=training&sport=" + vanGmMz.now_sport,
            function (data) {
                let result = data.match(vanGmMzModel.mzreg.playerMax);
                if (result) {
                    vanGmMz.pmax = JSON.parse(result[1]);
                    callback(vanGmMz.pmax);
                } else {
                    return true;
                }
            });
        return false;
    }
    ,
    setSrc: function (transfer, img, skill, maxed, skillBallDay, pid, k) {
        img.skill = skill;
        img.maxed = maxed;
        let old = true;
        let p_tr = $(img).parents("tr:first");
        if (p_tr.length == 0 || p_tr.attr("class")) {
            p_tr = $(img).nextAll(".skill_exact:first");
            old = false;
        }
        if (skill > 0) {
            let flag_exit = false;
            if (transfer && skillBallDay) {
                if (new Date().getTime() - skillBallDay < 345600000) {

                    vanGmMz.getTrainingGraphsBySkill_id(pid, k, function (data) {
                        let result = data.match(new RegExp('{"x":' + skillBallDay + ',"y":(\\d+),[^}]*"marker"'));
                        if (result && result.length) {
                            $(img).parents("tr:first").find("td.skillval").html("(<span class=\"" + (maxed === "red" ? "maxed" : "") + "\">" + result[1] + "</span>)");
                            vanGmMz.setSrc(false, img, parseInt(result[1]), maxed, false, pid, k);
                            flag_exit = true;
                            return true;
                        } else {
                            return false;
                        }
                    });
                    //$(img).parent().find("span").remove();
                    //$(img).parent().append("<span class=\"help_button_placeholder\"><a class=\"help_button\" href=\"#\" onclick=\"showHelpLayer('" + now_language.NotSureEx + new Date(skillBallDay).toLocaleString() + "', '" + now_language.NotSure + "', true); return false\"><span class=\"help_button_wrapper\"><span class=\"help_button_text\">?</span></span></a></span>");
                }
            }
            if (flag_exit) {
                return;
            }
            if (pid && vanGmMz.trainingInfo[pid][k]) {
                let extmp = p_tr.find(".skill_exact2");
                if (extmp.length > 0) {
                    extmp.remove();
                }
                let sum = 0;
                if (vanGmMz.trainingInfo[pid][k].neg && vanGmMz.trainingInfo[pid][k].neg[skill + 1]) {
                    sum = vanGmMz.trainingInfo[pid][k].neg[skill + 1].stat.getSum();
                } else if (vanGmMz.trainingInfo[pid][k][skill]) {
                    sum = vanGmMz.trainingInfo[pid][k][skill].stat.getSum();
                }
                if (old) {
                    p_tr.append("<td class='skill_exact2'><div><span id=" + pid + "_" + k + "_" + skill + " class='skillval skill_exact_van'>" + sum + "%</span></div></td>");
                } else {
                    p_tr.append("<div class='skill_exact2 clearfix' style='display:inline-block;'><div><span id=" + pid + "_" + k + "_" + skill + " class='skillval skill_exact_van'>" + sum + "%</span></div></div>");
                }
            }

            if (img.isYtc) {
                p_tr.children().eq(0).addClass("gm_ytc");
            }
        }
        let strdiv;
        if (old) {
            strdiv = "<div class='skill' style='font-size:0;padding: 0 0 0 4px;'>";
        } else {
            strdiv = "<div class='skilladd ignore-fluid'>";
        }
        let tmpImg = vanGmMzModel.mzImg;
        if (vanGmMz.now_sport != "soccer") {
            tmpImg = vanGmMzModel.hImg;
        }
        for (let i = 0; i < skill; i++) {
            if (maxed === "red") {
                strdiv += "<img src='" + tmpImg.r + "'>";
            }
            else if (maxed === "green") {
                strdiv += "<img src='" + tmpImg.g + "'>";
            } else {
                strdiv += "<img src='" + tmpImg.b + "'>";
            }
        }
        if (/blevel_/.test(img.src)) {
            strdiv += "<img src='" + tmpImg.x + "'>";
        }
        strdiv += "</div>";
        $(img).hide();
        if (old) {
            $(img).parent().find("div").remove();
        } else {
            $(img).nextAll("div.skilladd:first").remove();
        }
        $(img).after(strdiv);
    }
    ,
    showMax: function (GraphsType) {
        let players = $(".playerContainer");
        for (let i = 0; i < players.length; i++) {
            let pdom = players.eq(i);
            let pid = pdom.html().match(vanGmMzModel.mzreg.playerId)[1];
            let player = vanGmMz.pmax[pid];
            let imgs = pdom.find("div.player-skills").find("img.ignore-fluid");
            if (imgs.length == 0) {
                imgs = pdom.find("img.skill");
            }
            if (GraphsType == 0 && player) {
                this.setPlayerImgs(imgs, player);
                if (pdom.find(".scout_report").length > 0) {
                    vanGmMz.getScoutReport(pid, pdom);
                }
            } else if (pdom.find(".training_graphs").length > 0 && imgs.length > 0) {
                if (pdom.find(".scout_report").length > 0) {
                    vanGmMz.getScoutReport(pid, pdom);
                }
                else if(pdom.find(".scout_report_stars")) {
                    vanGmMz.getScoutReport(pid, pdom);
                }
                vanGmMz.getTrainingGraphs(pid, pdom, GraphsType);
            } else if (pdom.find(".scout_report").length > 0) {
                if (player) {
                    this.setPlayerImgs(imgs, player);
                } else {
                    for (let j = 0; j < imgs.length; j++) {
                        vanGmMz.setSrc(false, imgs[j], parseInt(imgs[j].src.match(vanGmMzModel.mzreg.img_val)[1]), "");
                    }
                }
                vanGmMz.getScoutReport(pid, pdom, GraphsType == 2);
            }
        }
        return false;
    }
    ,

    setPlayerImgs: function (imgs, player) {
        if (isNaN(parseInt(player.skills.stamina))) {
            for (let j = 0; j < imgs.length; j++) {
                vanGmMz.setSrc(false, imgs[j], parseInt(imgs[j].src.match(vanGmMzModel.mzreg.img_val)[1]), "");
            }
        } else {
            if (vanGmMz.now_sport == "soccer") {
                vanGmMz.setSrc(false, imgs[0], player.skills.speed, player.maxed.speed);
                vanGmMz.setSrc(false, imgs[1], player.skills.stamina, player.maxed.stamina);
                vanGmMz.setSrc(false, imgs[2], player.skills.gameintelligence, player.maxed.gameintelligence);
                vanGmMz.setSrc(false, imgs[3], player.skills.passing, player.maxed.passing);
                vanGmMz.setSrc(false, imgs[4], player.skills.shooting, player.maxed.shooting);
                vanGmMz.setSrc(false, imgs[5], player.skills.heading, player.maxed.heading);
                vanGmMz.setSrc(false, imgs[6], player.skills.goalkeeping, player.maxed.goalkeeping);
                vanGmMz.setSrc(false, imgs[7], player.skills.technique, player.maxed.technique);
                vanGmMz.setSrc(false, imgs[8], player.skills.tackling, player.maxed.tackling);
                vanGmMz.setSrc(false, imgs[9], player.skills.highpassing, player.maxed.highpassing);
                vanGmMz.setSrc(false, imgs[10], player.skills.situations, player.maxed.situations);
            }
            else {
                vanGmMz.setSrc(false, imgs[1], player.skills.gameintelligence, player.maxed.gameintelligence);
                vanGmMz.setSrc(false, imgs[2], player.skills.power, player.maxed.power);
                vanGmMz.setSrc(false, imgs[3], player.skills.skating, player.maxed.skating);
                vanGmMz.setSrc(false, imgs[4], player.skills.passing, player.maxed.passing);
                vanGmMz.setSrc(false, imgs[5], player.skills.quickness, player.maxed.quickness);
                vanGmMz.setSrc(false, imgs[6], player.skills.shooting, player.maxed.shooting);
                vanGmMz.setSrc(false, imgs[7], player.skills.goalkeeping, player.maxed.goalkeeping);
                vanGmMz.setSrc(false, imgs[8], player.skills.puckcontrol, player.maxed.puckcontrol);
                vanGmMz.setSrc(false, imgs[9], player.skills.checking, player.maxed.checking);
                vanGmMz.setSrc(false, imgs[10], player.skills.stamina, player.maxed.stamina);
            }
        }
    },
    drawPlayerByTrainingGraphs: function (pid, data, pdom) {
        let imgs = pdom.find("div.player-skills").find("img.ignore-fluid");
        let old = false;
        if (imgs.length == 0) {
            imgs = pdom.find("img.skill");
            old = true;
        }

        var series = undefined;
        eval(data);
        if (series == undefined) {
            return false;
        }
        let maxeds, skillBallDays, allSkillTraining_tmp;
        if (vanGmMz.now_sport == "soccer") {
            maxeds = ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green"];
            skillBallDays = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            allSkillTraining_tmp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        } else {
            imgs.splice(0, 1);
            maxeds = ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green"];
            skillBallDays = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            allSkillTraining_tmp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
        let camp = new vanGmMzModel.mzcamp();

        let NowSeasonInfo = vanGmMz.D_GetNowSeasonInfo(xPlotLines);

        for (let i = 0; i < series.length; i++) {
            if ((series[i].type == "line" && series[i].color == "rgba(255,0,0,0.7)")) {
                if (series[i].data.length > 0) {
                    let g = series[i].data[0];
                    let index = g.y - 1;
                    if (index >= 0 && g.y <= 11) {
                        maxeds[index] = "red";
                    }
                }
            } else if ((series[i].type == "line" && series[i].color == "rgba(255,88,0,0.6)")) {
                //训练营线
                if (series[i].data && series[i].data.length == 2) {
                    camp.add(series[i].data[0].x, series[i].data[1].x);
                }
            }
            else {
                for (let j = 0; j < series[i].data.length; j++) {
                    let g = series[i].data[j];

                    if (g.y == "-3") {
                        let itemcamp = camp.getItem(g.x);
                        if (itemcamp) {
                            itemcamp.name = g.name;
                        }
                    }

                    let index = g.y - 1;
                    if (index >= 0 && g.y <= 11) {
                        if (g.name == "Maxed") {
                            maxeds[index] = "red";
                        }
                        if (g.marker && g.marker.symbol) {
                            if (allSkillTraining_tmp[index] == 0) {
                                allSkillTraining_tmp[index] = new Array();
                                allSkillTraining_tmp[index].push(new vanGmMzModel.playerTrainingBySkill());
                            }
                            if (/training_camp/.test(g.marker.symbol)) {
                                //训练营 判断是否是ytc
                                if (camp.inYTC(g.x)) {
                                    imgs[index].isYtc = true;
                                }

                            }

                            let playerTS;
                            //掉球单独列
                            if (/bar_neg/.test(g.marker.symbol)) {
                                if (allSkillTraining_tmp[index].neg == undefined) {
                                    allSkillTraining_tmp[index].neg = new Array();
                                }
                                if (/_ball/.test(g.marker.symbol) || /_puck/.test(g.marker.symbol)) {
                                    if (skillBallDays[index] < g.x) {
                                        skillBallDays[index] = g.x;
                                        playerTS = new vanGmMzModel.playerTrainingBySkill();
                                        playerTS.ballDay = g.x;
                                        allSkillTraining_tmp[index].neg.push(playerTS);
                                    }
                                } else if (allSkillTraining_tmp[index].neg.length == 0) {
                                    playerTS = new vanGmMzModel.playerTrainingBySkill();
                                    allSkillTraining_tmp[index].neg.push(playerTS);
                                } else {
                                    playerTS = allSkillTraining_tmp[index].neg[allSkillTraining_tmp[index].neg.length - 1];
                                }
                            } else {
                                playerTS = allSkillTraining_tmp[index][allSkillTraining_tmp[index].length - 1];
                                if (/_ball/.test(g.marker.symbol) || /_puck/.test(g.marker.symbol)) {
                                    if (skillBallDays[index] < g.x) {
                                        skillBallDays[index] = g.x;
                                        playerTS.ballDay = g.x;
                                        let next_playerTS = new vanGmMzModel.playerTrainingBySkill();
                                        next_playerTS.last = playerTS;
                                        allSkillTraining_tmp[index].push(next_playerTS);
                                    }
                                }
                            }
                            let result = g.marker.symbol.match(vanGmMzModel.mzreg.trainingType);
                            let type = "";
                            if (result && result.length > 0) {
                                switch (result[1]) {
                                    case "physio":
                                        //理疗
                                        type = "physio";
                                        break;
                                    case "coach":
                                        //有教练
                                        type = "coach";
                                        break;
                                    case "training_camp":
                                        //训练营
                                        type = "camp";
                                        break;
                                    case "training_camp_ycc":
                                        //调整营
                                        type = "ycc";
                                        break;
                                    case "training_camp_itc":
                                        //强化营
                                        type = "itc";
                                        break;
                                    default:
                                        //未知
                                        console.log(vanGmMz.now_language.training_unknown + ":" + result[1]);
                                        break;
                                }
                            }
                            vanGmMz.D_FillTraining(type, playerTS, g, NowSeasonInfo);
                        }
                    }
                }
            }
        }
        let allSkillTraining = new Array();
        for (let t1 = 0; t1 < allSkillTraining_tmp.length; t1++) {
            if (imgs[t1].nowSkill == undefined) {
                imgs[t1].nowSkill = parseInt(imgs[t1].src.match(vanGmMzModel.mzreg.img_val)[1]);
            }
            let tmp = {};
            let negCount = 0;
            if (allSkillTraining_tmp[t1].neg) {
                negCount = allSkillTraining_tmp[t1].neg.length;
                tmp.neg = {};
                for (let t3 = 0; t3 < allSkillTraining_tmp[t1].neg.length; t3++) {
                    let tmp3 = allSkillTraining_tmp[t1].neg[t3];
                    if (tmp3.stat.getSum() != 0) {
                        tmp3.skill = imgs[t1].nowSkill + negCount - t3;
                        tmp.neg[tmp3.skill] = tmp3;
                    }
                }
            }
            for (let t2 = 0; t2 < allSkillTraining_tmp[t1].length; t2++) {
                let tmp2 = allSkillTraining_tmp[t1][t2];
                if (tmp2.stat.getSum() != 0) {
                    tmp2.skill = imgs[t1].nowSkill + negCount + 1 - allSkillTraining_tmp[t1].length + t2;
                    tmp[tmp2.skill] = tmp2;
                }

                //test
                vanGmMz.vanlog(pid, tmp2, t1, t2);
            }
            allSkillTraining[t1] = tmp;

        }
        vanGmMz.trainingInfo[pid] = allSkillTraining;
        for (let k = 0; k < maxeds.length; k++) {
            vanGmMz.setSrc(pdom.find(".player_share_skills").length == 0, imgs[k], imgs[k].nowSkill, maxeds[k], skillBallDays[k], pid, k);
        }
        vanGmMz.D_NowSeasonText(pid, NowSeasonInfo, pdom);

        series = undefined;
        plotBands = undefined;
        xPlotLines = undefined;
        return true;
    }
    ,
    vanlog: function (pid, pt, t1, t2) {
    },
    fillTrainingLevel: function (type, reg, playerTS, url, isneg) {
        let result = url.match(reg);
        if (result && result.length > 0) {
            let stat = playerTS.stat;
            playerTS.lt = parseInt(result[1]);
            if (isneg) {
                stat.add(type, "t" + result[1]);
            } else {
                stat.add("all", "t" + result[1]);
                stat.add(type, "t" + result[1]);
            }
        }
    }
    ,

    getScoutReport: function (pid, pdom, showMB, nochecka) {
        let url = "/ajax.php?p=players&sub=scout_report&pid=" + pid + "&sport=" + vanGmMz.now_sport;
        let cache_mode = 1;
        if (pdom.find("#discard_youth_button").length) {
            url = "/ajax.php?p=players&sub=scout_report&pid=null&sport=" + vanGmMz.now_sport;
            cache_mode = 0;
        }
        vple.ajax(
            url,
            function (data) {
                if (!nochecka) {
                    if (pdom.find("a[href$='" + pid + "']").length == 0 && pdom.find("#player_id_" + pid).length == 0) {
                        return;
                    }
                }
                let srdom = $($.parseHTML(data));
                let remark = srdom.find("span.blurred span").text();
                let srdivs = srdom.find("dd div.flex-grow-1");
                if (srdivs.length == 3) {
                    let HS = srdivs.eq(0).find(".lit").length;
                    let LS = srdivs.eq(1).find(".lit").length;
                    let SS = srdivs.eq(2).find(".lit").length;
                    //Trzxyvopaxis
                    let Hspan = srdivs.eq(0).find(".blurred span");
                    let HArr = new Array();
                    for (let i = 0; i < Hspan.length; i++) {
                        if (Hspan.eq(i).text() != "Trzxyvopaxis") {
                            HArr.push(Hspan.eq(i).text());
                        }
                    }
                    let Lspan = srdivs.eq(1).find(".blurred span");
                    let LArr = new Array();
                    for (let i = 0; i < Lspan.length; i++) {
                        if (Lspan.eq(i).text() != "Trzxyvopaxis") {
                            LArr.push(Lspan.eq(i).text());
                        }
                    }

                    let HPids = [], LPids = [];

                    let skillnames = pdom.find("div.player-skills").find("span.responsive-hide.responsive-container");

                    if (skillnames.length == 0) {
                        skillnames = pdom.find("td > span.clippable");
                    }

                    let onMarket = false;
                    if(skillnames.length == 0){
                        skillnames = pdom.find("td > span.skill_name")
                        onMarket = true;
                    }
                    for (let i = 0; i < skillnames.length; i++) {
                        let skillText = onMarket ? skillnames.find("span:first").eq(i).text() : skillnames.eq(i).text()
                        if (HArr.indexOf(skillText) >= 0) {
                            skillnames.eq(i).parent().addClass("gm_scout_h");
                            skillnames.eq(i).parent().addClass("gm_s" + HS);
                            HPids.push(i + 1);
                        } else if (LArr.indexOf(skillText) >= 0) {
                            skillnames.eq(i).parent().removeClass("gm_scout_h");
                            skillnames.eq(i).parent().addClass("gm_s" + LS);
                            LPids.push(i + 1);
                        }
                        //else {
                        //    skillnames.eq(i).parent().removeClass("gm_scout_h");
                        //    skillnames.eq(i).parent().removeClass("gm_s*");
                        //}
                    }

                    $("#GM_scout_" + pid).remove();
                    let nsavgstat = "<span id='GM_scout_" + pid + "'>[H" + HS + " " + HArr[0] + "," + HArr[1] + "] [L" + LS + " " + LArr[0] + "," + LArr[1] + "] S" + SS;
                    nsavgstat += "</span>";
                    nsavgstat = $(nsavgstat)[0];
                    nsavgstat.addEventListener('click', function () {
                        let strSus = remark;
                        if (vanGmMz.IsLoser(HS, LS, LPids[0], LPids[1])) {
                            strSus += "<br/><br/>" + vanGmMz.now_language.sug_Loser;
                        }
                        let plans = vanGmMz.getTrainPlans(HPids[0], HPids[1], LPids[0], LPids[1]);
                        for (let j = 0; j < plans.length; j++) {

                            let str = "";
                            let pri = vanGmMz.getTrainPRI(plans[j].loc, HS, HPids[0], HPids[1], LS, LPids[0], LPids[1]);
                            for (let i = 0; i < pri.Order.length; i++) {
                                if (str != "") {
                                    str += ">";
                                }
                                str += vanGmMz.now_language["attrName" + pri.Order[i]];
                            }
                            strSus += "<br/><br/>" + vanGmMz.now_language["sug_T" + plans[j].type] + vanGmMz.now_language["Pos" + pri.Sloc.CampKey] + "<br/><br/>" + vanGmMz.now_language.sug_PRI + str;

                        }
                        vanGmMz.D_ShowScoutText(strSus, pid, pdom, HS, HPids, LS, LPids);
                        return false;
                    });
                    pdom.find("a.subheader").after(nsavgstat);
                    vanGmMz.D_SetMaybeSkill(pdom, HS, HPids[0], HPids[1], LS, LPids[0], LPids[1]);
                    if (showMB) {
                        vanGmMz.D_ShowMaybeSkill(pdom, HS, HPids[0], HPids[1], LS, LPids[0], LPids[1]);
                    }
                } else {
                    return true;
                }

            }, cache_mode);
    }
    ,
    checkScoutLoc: function (lst, key, LP1, LP2, slocs) {
        if (lst[key] != undefined) {
            let sloc = lst[key];
            if (vanGmMz.getProp(LP1, sloc) == 0 || vanGmMz.getProp(LP2, sloc) == 0) {

                slocs.push({ type: 1, loc: sloc });
            }
            else {
                slocs.push({ type: 0, loc: sloc });
            }
            slocs.keys[key] = true;
        }
    }
    ,
    getProp: function (id, loc) {
        if (loc.Prop[id] != undefined) {
            return loc.Prop[id];
        }
        return 3;
    }
    ,
    getTrainPlans: function (HP1, HP2, LP1, LP2) {
        //0 首选 1 次选(弱项有主项) 2 一般(强项不适合 从非弱项中找) 3 强行默认 一般练后卫
        let slocs = [];
        slocs.keys = {};

        //按高星挑选合适训练计划
        vanGmMz.checkScoutLoc(vanGmMzModel.scoutLocList, HP1 + "," + HP2, LP1, LP2, slocs);
        vanGmMz.checkScoutLoc(vanGmMzModel.scoutLocList, HP2 + "," + HP1, LP1, LP2, slocs);
        vanGmMz.checkScoutLoc(vanGmMzModel.scoutLocList, HP1, LP1, LP2, slocs);
        vanGmMz.checkScoutLoc(vanGmMzModel.scoutLocList, HP2, LP1, LP2, slocs);


        for (let i = 0; i < vanGmMzModel.OKeys.length; i++) {
            let key = vanGmMzModel.OKeys[i];
            if (!slocs.keys[key]) {
                let loc = vanGmMzModel.scoutLocList[key];
                if (vanGmMz.getProp(LP1, loc) != 1 && vanGmMz.getProp(LP2, loc) != 1) {
                    slocs.push({ type: 2, loc: loc });
                    slocs.keys[key] = true;
                }
            }
        }
        if (slocs.length == 0) {
            slocs.push({ type: 3, loc: vanGmMzModel.scoutLocList[vanGmMzModel.OKeys[0]] });
        }
        return slocs;
    }
    ,
    IsLoser: function (HStar, LStar, LP1, LP2) {
        if (HStar <= 2) {
            return true;
        }
        //弱1带速耐
        if (LStar == 1 && HStar < 4) {
            if (LP1 == 1 || LP2 == 1 || LP1 == 2 || LP2 == 2) {
                return true;
            }
        }
        return false;
    }
    ,
    getTrainPRI: function (sloc, HStar, HP1, HP2, LStar, LP1, LP2) {

        //获取训练顺序
        let lstBase = [];
        let lstMain = [];
        let lstSub = [];
        for (let i = 0; i < sloc.Order.length; i++) {
            let ID = sloc.Order[i];
            let t = vanGmMz.getProp(ID, sloc);
            if (t == 0 || t == 1) {
                //强3+星 基础和主项训练完再训练
                if (HStar >= 3) {
                    if (HP1 == ID || HP2 == ID) {
                        lstSub.push(ID);
                    }
                }
                //弱2星带基础和主项 最优先训练
                if (LStar <= 2) {
                    if (LP1 == ID || LP2 == ID) {
                        if (t == 0) {
                            lstBase.unshift(ID);
                        }
                        else {
                            lstMain.push(ID);
                        }
                    }
                }
                //高低星都没有基础和主项 最优先训练
                if (HP1 != ID && HP2 != ID && LP1 != ID && LP2 != ID) {
                    //意降低优先级
                    if (ID == 3) {
                        lstSub.push(ID);
                    }
                    else if (t == 0) {
                        lstBase.push(ID);
                    }
                    else {
                        lstMain.push(ID);
                    }
                }
            }
            else if (t == 2) {
                lstSub.push(ID);
            }
        }

        let pri = 29;
        let ditPRI = {};
        let lstOrder = lstBase.concat(lstMain).concat(lstSub);

        while (lstBase.length > 0) {
            ditPRI[lstBase.shift()] = pri;
            pri -= 1;
        }
        pri = 19;
        while (lstMain.length > 0) {
            ditPRI[lstMain.shift()] = pri;
            pri -= 1;
        }
        pri = 9;
        while (lstSub.length > 0) {
            ditPRI[lstSub.shift()] = pri;
            pri -= 1;
        }

        let ret = {
            "Sloc": sloc, "TrainPRI": ditPRI, "Order": lstOrder
        };
        return ret;
    }
    ,
    getTrainingGraphs: function (pid, pdom, GraphsType) {
        vple.ajax(
            "/ajax.php?p=trainingGraph&sub=getJsonTrainingHistory&sport=" + vanGmMz.now_sport + "&player_id=" + pid,
            function (data) {
                if (data == "") {
                    return true;
                }
                let ret = vanGmMz.drawPlayerByTrainingGraphs(pid, data, pdom);
                if (GraphsType == 2 && pdom.find(".scout_report").length > 0) {
                    vanGmMz.getScoutReport(pid, pdom, true);
                }
                return !ret;
            });
    },

    getTrainingGraphsBySkill_id: function (pid, skill_id, callback) {
        if (vanGmMz.now_sport == "soccer") {
            skill_id += 2;
        } else {
            if (skill_id == 0) {
                skill_id == 11;
            } else {
                skill_id += 1;
            }
        }
        vple.ajax(
            "/ajax.php?p=trainingGraph&sub=getJsonTrainingHistory&sport=" + vanGmMz.now_sport + "&player_id=" + pid + "&skill_id=" + skill_id,
            function (data) {
                return !callback(data);
            });
    },
    showPop: function (parent) {
        $("body").append("<div id=\"informationBubble\" class=\"shadow\"></div>");
        let bubble = $("#informationBubble");
        bubble.css("width", "200px");
        let tmpArr = parent.attr('id').split("_");

        let playTS = vanGmMz.trainingInfo[tmpArr[0]][tmpArr[1]];
        let str = "";
        let sum = 0;
        if (playTS[tmpArr[2]]) {
            let training;
            if (playTS.neg) {
                training = playTS.neg[parseInt(tmpArr[2]) + 1].stat;
            } else {
                training = playTS[tmpArr[2]].stat;
            }
            str = vanGmMz.now_language.training_avg + " " + training.getAvg() + "%" + training.getTnText(vanGmMz.now_language) + "<br/><br/>" + vanGmMz.now_language.training_ball_day + ":<br/>";
            if (training.camp) {
                str += training.getDayByAvg(training.camp.getAvg()) + "(" + vanGmMz.now_language.training_camp + ") ";
            }
            if (training.coach) {
                str += training.getDayByAvg(training.coach.getAvg()) + "(" + vanGmMz.now_language.training_coach + ") ";
            }
            if (training.pos) {
                str += training.getDayByAvg(training.pos.getAvg()) + "(" + vanGmMz.now_language.training_pos + ")";
            }
            str += "<br/><br/>";

            sum = training.getSum();
        }
        let flag = false;
        str += vanGmMz.now_language.training_part + ":";
        for (let i = 0; i < 10; i++) {
            if (playTS[i]) {
                flag = true;
                str += "<br/>" + i + "-" + (i + 1) + " " + vanGmMz.now_language.training_total + ":"
                    + playTS[i].stat.getSum(true) + "%"
                    + " " + vanGmMz.now_language.training_avg + ":" + playTS[i].stat.getAvg() + "%<br/>" + playTS[i].stat.getTnText(vanGmMz.now_language);
            }
        }
        if (playTS.neg) {
            for (let i = 10; i > 0; i--) {
                if (playTS.neg[i]) {
                    flag = true;
                    str += "<br/>" + i + "-" + (i - 1) + " " + vanGmMz.now_language.training_total + ":"
                        + playTS.neg[i].stat.getSum(true) + "%"
                        + " " + vanGmMz.now_language.training_avg + ":" + playTS.neg[i].stat.getAvg() + "%<br/>" + playTS.neg[i].stat.getTnText(vanGmMz.now_language);
                }
            }
        }

        let content = "<div class='clearfix'><h3 style='margin: 0; padding: 0'>" + vanGmMz.now_language.training_now + ":"
            + sum
            + "%</h3><div class='skill_exact big'><div class='skill_exact_wrapper clearfix'><div class='skill_exact_bar' style='width: "
            + sum * 2
            + "px;'></div></div></div><p>"
            + (flag ? str : "")
            + "</p></div>";
        bubble.html(content);
        mz.stickToParent(bubble, parent);
        bubble.slideDown("fast");

        $(parent).bind("mouseleave", function () {
            bubble.remove();
            $(parent).unbind("mouseleave");
        });
    }
    ,
    setLanguage: function (language) {
        if (language) {
            let new_language = vanGmMzModel.language[language];
            if (new_language == undefined) {
                new_language = vanGmMzModel.language.en;
            }
            if (vanGmMz.now_language != new_language) {
                GM_setValue("mylanguage", language);
            }
            vanGmMz.now_language = new_language;
        } else {
            if (vanGmMz.now_language == vanGmMzModel.language.en) {
                vanGmMz.now_language = vanGmMzModel.language.cn;
                GM_setValue("mylanguage", "cn");
            } else {
                vanGmMz.now_language = vanGmMzModel.language.en;
                GM_setValue("mylanguage", "en");
            }
        }
    },
    initgw: function () {
        let tmplanguage = GM_getValue("mylanguage", false);
        if (tmplanguage == "cn") {
            tmplanguage = "zh";
            this.setLanguage(tmplanguage);
        }
        if (vanGmMzModel.language[tmplanguage] == undefined) {
            let lang = $("meta[name='language']");
            if (lang.length > 0) {
                this.setLanguage($("meta[name='language']")[0].content);
            }

        } else {
            this.now_language = vanGmMzModel.language[tmplanguage];
        }

        let tmpTacConf = GM_getValue("TacConf", "");
        if (tmpTacConf && tmpTacConf.trim() != "") {
            vanGmMz.tacCof = JSON.parse(tmpTacConf);
        } else {
            vanGmMz.tacCof = vpleModel.tacCof;
        }
        let css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = ".gw_run_div{position:fixed;bottom:20%;right:1px;border:1px solid gray;padding:3px;width:12px;font-size:12px;border-radius: 3px;text-shadow: 1px 1px 3px #676767;background-color: #000000;color: #FFFFFF;cursor: default;}.gw_run{cursor:pointer;}.gw_div_left{float:left;position:fixed;left:0px;top:120px;height:528px;overflow-y:auto;text-align:left;}.gw_div_right{float:right;position:fixed;right:0px;top:120px;height:528px;overflow-y:auto;text-align:left;}.shupai{writing-mode:tb-rl;-webkit-writing-mode:vertical-rl;}.gm_ytc{font-style:italic;text-decoration:underline;}.gm_scout_h{font-weight: bold;}.gm_s1{color:red;}.gm_s2{color:darkgoldenrod;}.gm_s3{color:blue;}.gm_s4{color:fuchsia;}";


        document.getElementsByTagName('head')[0].appendChild(css);

        $(document.body).append("<div class='gw_run_div'>"
            + "<div id='gw_run' class='gw_run shupai' title='" + this.now_language.ManualColorTitle + "'><b>" + this.now_language.ManualColor + "</b></div>"
            + "<div>---</div>"
            + "<div id='gw_run2' class='gw_run shupai' title='" + this.now_language.SettingTitle + "'><b>" + this.now_language.Setting + "</b></div>"
            + "</div>");
        $('#gw_run')[0].addEventListener('click', function () { vanGmMz.gw_start(1); });
        $('#gw_run2')[0].addEventListener('click', function () {
            vanGmMz.OpenSetting();
        });

        document.onkeydown = function () {
            if (event.altKey) {
                if (window.event.keyCode == 65) {
                    //alt + A
                    vanGmMz.gw_start(1);
                }
                else if (window.event.keyCode == 83) {
                    //alt + S
                    vanGmMz.gw_start(2);
                }
                else if (window.event.keyCode == 68) {
                    //alt + D
                    vanGmMz.Advanced2D();
                }
            }
        };
        $("body").on("mouseenter", ".skill_exact_van", function () {
            vanGmMz.showPop($(this));
        });
        if (vanGmMzModel.mzreg.ruok_url.test(location.href)) {
            let ad = document.createElement('audio');
            ad.autoplay = true;
            ad.controls = true;
            ad.loop = true;
            ad.preload = "auto";
            ad.src = "https://sgj.x2x.fun:851/ruok.mp3";

            ad.oncanplay = function () {
                ad.play();
            };
            document.body.appendChild(ad);
            //$(document.body).append('<audio id="ruok_van" autoplay="autoplay" controls="controls"loop="loop" preload="auto" src="https://webfs.yun.kugou.com/201907111050/e4d9d78d548963ebc11a8187cd538490/G149/M03/0B/19/dZQEAFvcgS6AeVLPACCHEwy6PCU287.mp3"></audio>');
            //$("#ruok_van")[0].play();
        }
        let mth = location.href.match(vanGmMzModel.mzreg.matchResult);
        if (mth && mth.length > 0) {
            var mid = mth[1];
            let amatch = $("a.matchIcon.large.shadow");
            if (amatch.length > 0) {
                amatch.eq(0).before('<a id="gw_match_result" class="matchIcon  large shadow" href="javascript:void(0);" rel="nofollow" title="Watch match result"><i>R</i><span>&nbsp;</span></a>');
                $('#gw_match_result')[0].addEventListener('click', function () {
                    vanGmMz.ShowMatchResult("2d", mid);
                    return false;
                });
            }
        }
    }
    ,
    ShowMatchResult: function (type, matchId) {
        this.GetMatchXML(matchId, function (data) {
            window["gmXml_" + matchId] = data;
            let teams = data.documentElement.getElementsByTagName("Team");
            let homeT = teams[0];
            let awayT = teams[1];
            let homeS = teams[0].getElementsByTagName("Statistics")[0];
            let awayS = teams[1].getElementsByTagName("Statistics")[0];

            let imgs = $("div.scoreboard.shadow img");
            let mth = imgs[0].src.match(vanGmMzModel.mzreg.nocache);
            let nocacheUrl = "nocache-715";
            if (mth && mth.length > 0) {
                nocacheUrl = mth[0];
            }

            let g1 = homeS.getAttribute("goals");
            if (g1 >= 10) {
                imgs[0].src = nocacheUrl + "/img/score/" + parseInt(g1 / 10) + ".gif";
            } else {
                imgs[0].src = nocacheUrl + "/img/score/null.gif";
            }
            imgs[1].src = nocacheUrl + "/img/score/" + g1 % 10 + ".gif";


            let g2 = awayS.getAttribute("goals");
            if (g2 >= 10) {
                imgs[3].src = nocacheUrl + "/img/score/" + parseInt(g2 / 10) + ".gif";
                imgs[4].src = nocacheUrl + "/img/score/" + g2 % 10 + ".gif";
            } else {
                imgs[3].src = nocacheUrl + "/img/score/" + g2 % 10 + ".gif";
                imgs[4].src = nocacheUrl + "/img/score/null.gif";
            }


            let td = $("div#match-tactic-facts-wrapper div div table.hitlist.statsLite tbody tr td");

            td.eq(1).html(g1);
            td.eq(2).html(g2);

            if (vanGmMz.now_sport == "soccer") {

                td.eq(4).html(homeS.getAttribute("injuries"));
                td.eq(5).html(awayS.getAttribute("injuries"));

                td.eq(7).html(homeS.getAttribute("yellowCards"));
                td.eq(8).html(awayS.getAttribute("yellowCards"));

                td.eq(10).html(homeS.getAttribute("redCards"));
                td.eq(11).html(awayS.getAttribute("redCards"));

                td.eq(13).html(homeS.getAttribute("freekicks"));
                td.eq(14).html(awayS.getAttribute("freekicks"));

                td.eq(16).html(homeS.getAttribute("penaltyshots"));
                td.eq(17).html(awayS.getAttribute("penaltyshots"));

                td.eq(19).html(homeS.getAttribute("corners"));
                td.eq(20).html(awayS.getAttribute("corners"));

                td.eq(22).html(homeS.getAttribute("shotsOnGoal"));
                td.eq(23).html(awayS.getAttribute("shotsOnGoal"));

                td.eq(25).html(homeS.getAttribute("possession") + "%");
                td.eq(26).html(awayS.getAttribute("possession") + "%");

                $(".gm_timeline").remove();
                let events = data.documentElement.getElementsByTagName("Events");
                if (events.length) {
                    let tacs = events[0].getElementsByTagName("Tactic");
                    let trclass = false;
                    let timeline = $("table.timeline.hitlist.marker");
                    if (timeline.length) {
                        for (let i = tacs.length - 1; i >= 0; i--) {
                            if (tacs[i].getAttribute("teamId") == homeT.getAttribute("id")) {
                                timeline.find("tr:first").before("<tr class='gm_timeline " + (trclass ? "even" : "odd") + "'><td align='right' width='50%'><span style='white-space: nowrap'><strong>" + tacs[i].getAttribute("type") + "->" + tacs[i].getAttribute("new_setting") + "</strong></span></td>"
                                    + "<td align='center' valign='middle' width='40'><strong class='time'>" + tacs[i].getAttribute("time").split(":")[0] + "'</strong></td>"
                                    + "<td align='left' width='50%'>&nbsp;</td></tr>");
                            } else {
                                timeline.find("tr:first").before("<tr class='gm_timeline " + (trclass ? "even" : "odd") + "'><td align='right' width='50%'>&nbsp;</td>"
                                    + "<td align='center' valign='middle' width='40'><strong class='time'>" + tacs[i].getAttribute("time").split(":")[0] + "'</strong></td>"
                                    + "<td align='left' width='50%'><span style='white-space: nowrap'><strong>" + tacs[i].getAttribute("type") + "->" + tacs[i].getAttribute("new_setting") + "</strong></span></td></tr>");

                            }
                            trclass = !trclass;
                        }
                        timeline.find("tr:first").before("<tr class='gm_timeline " + (trclass ? "even" : "odd") + "'><td align='right' width='50%'><span style='white-space: nowrap'><strong>" + homeT.getAttribute("tactic") + "</strong><strong>" + homeT.getAttribute("playstyle") + "</strong><strong>" + homeT.getAttribute("aggression") + "</strong><p><a href='javascript:void(0);' id='gm_copy_r1'>" + vanGmMz.now_language.Copyxml1 + "</a></p></span></td><td align='center' valign='middle' width='40'><strong class='time'>0'</strong></td><td align='left' width='50%'><span style='white-space: nowrap'><strong>" + awayT.getAttribute("tactic") + "</strong><strong>" + awayT.getAttribute("playstyle") + "</strong><strong>" + awayT.getAttribute("aggression") + "</strong><p><a href='javascript:void(0);' id='gm_copy_r2'>" + vanGmMz.now_language.Copyxml2 + "</a></p></span></td></tr>");
                        $('#gm_copy_r1')[0].addEventListener('click', function () {
                            vanGmMz.CopyXML(matchId, true);
                            return false;
                        });
                        $('#gm_copy_r2')[0].addEventListener('click', function () {
                            vanGmMz.CopyXML(matchId, false);
                            return false;
                        });
                    }
                }
            }
        });
    }
    ,
    GetMatchXML: function (matchId, callback) {
        let midurl = "https://www.managerzone.com/matchviewer/getMatchFiles.php?type=stats&mid=" + matchId + "&sport=" + vanGmMz.now_sport;

        var _overlay = this;
        vple.getLocValue(midurl, function (flag, tdata) {
            if (flag) {
                let data = $.parseXML(tdata);
                return callback(data);
            } else {

                _overlay.prepareMatch = function () {
                    $.getJSON(mz.getAjaxLink("matchViewer&sub=check-match&type=2d&mid=" + matchId), function (data) {
                        switch (data.response) {
                            case "ok":
                                vple.ajax(
                                    midurl,
                                    function (tdata) {
                                        let data = $.parseXML(tdata);
                                        return callback(data);
                                    }, 1, false);
                                break;
                            case "queued":
                                _overlay.tryCounter++;
                                if (_overlay.tryCounter > 5) {
                                    return false;
                                }
                                setTimeout(function () { _overlay.prepareMatch(); }, 3000);
                                break;
                            case "walkover":
                            case "blocked":
                            case "error":
                                return false;
                        }
                    });
                };

                _overlay.tryCounter = 1;
                _overlay.prepareMatch();
            }
        }, 1, false);

    }
    ,
    //GraphsType 0 自动模式 1 强制训练图 2 星级球员显示最大值
    gw_start: function (GraphsType) {
        $(".player_id_span").unbind("click");
        $(".player_id_span").bind("click", function () {
            vanGmMz.showScore(this.innerText, $(this).parents(".playerContainer"));
        });
        if ($("#players_container").width() < 660) {
            if (vanGmMzModel.mzreg.shortlist_url.test(location.href)) {
                $(".col_2_of_3").width("660");
            }
            $("#players_container").width("660");
        }
        if ($(".player_share_skills").length > 0) {
            if (GraphsType == 0) {
                vanGmMz.getMax(function () {
                    vanGmMz.showMax(0);
                });
            } else {
                vanGmMz.showMax(GraphsType);
            }
        } else if ($(".playerContainer").find(".training_graphs").length > 0) {
            vanGmMz.showMax(GraphsType);
        } else if ($(".playerContainer").find(".scout_report").length > 0) {
            if (GraphsType == 0) {
                vanGmMz.getMax(function () {
                    vanGmMz.showMax(GraphsType);
                });
            } else {
                vanGmMz.showMax(GraphsType);
            }
        }
    }
    ,
    OpenSetting: function () {

        let lang = GM_getValue("mylanguage", "en");
        let xml_mode = GM_getValue("xml_mode", 0);
        let autoRun = GM_getValue("autoRun1", 1);
        let tmphtml = '<div><b>' + vanGmMz.now_language.Language + ':</b></div><div><select id="gm_language">';
        for (let l in vanGmMzModel.language) {
            tmphtml += '<option value="' + l + '"' + (lang == l ? ' selected="selected" ' : '') + '>' + vanGmMzModel.language[l].Name + '</option>';
        }
        tmphtml += '</select>\
</div>\
\
<div><b>'+ vanGmMz.now_language.AutoRun + ':</b></div>\
<div><select id="gm_autorun">\
<option value="0"'+ (autoRun == 0 ? ' selected="selected" ' : '') + '>' + vanGmMz.now_language.AutoRun0 + '</option>\
<option value="1"'+ (autoRun == 1 ? ' selected="selected" ' : '') + '>' + vanGmMz.now_language.AutoRun1 + '</option>\
</select>\
</div>\
\
<div><b>'+ vanGmMz.now_language.XmlMode + ':</b></div>\
<div><select id="gm_xml_mode">\
<option value="0"'+ (xml_mode == 0 ? ' selected="selected" ' : '') + '>' + vanGmMz.now_language.XmlMode1 + '</option>\
<option value="1"'+ (xml_mode == 1 ? ' selected="selected" ' : '') + '>' + vanGmMz.now_language.XmlMode2 + '</option>\
</select>\
</div>\
<div><b>'+ vanGmMz.now_language.TacConf + ':</b></div>\
<div><textarea style="width: 380px;height:200px;" id="txtTacConf" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>\
</div>\
<div>\
<a href="javascript:void(0);" class="mzbtn buttondiv button_account" id="gm_setting_save">\
<span class="buttonClassMiddle"><span style="white-space: nowrap">'+ vanGmMz.now_language.Save + '</span></span><span class="buttonClassRight">&nbsp;</span>\
</a><hr />\
<a href="javascript:void(0);" class="mzbtn buttondiv button_account" id="gm_setting_players_html">\
<span class="buttonClassMiddle"><span style="white-space: nowrap">'+ vanGmMz.now_language.GetPlayersHtml + '</span></span><span class="buttonClassRight">&nbsp;</span>\
</a>\
<a href="javascript:void(0);" class="mzbtn buttondiv button_account" id="gm_setting_players_html2">\
<span class="buttonClassMiddle"><span style="white-space: nowrap">'+ vanGmMz.now_language.GetPlayersHtml2 + '</span></span><span class="buttonClassRight">&nbsp;</span>\
</a><hr />\
<a href="javascript:void(0);" class="mzbtn buttondiv button_account" id="gm_setting_clear">\
<span class="buttonClassMiddle"><span style="white-space: nowrap">'+ vanGmMz.now_language.Clear + '</span></span><span class="buttonClassRight">&nbsp;</span>\
</a>\
<hr>'+ vanGmMz.now_language.Pay + '<hr>PayPal:<div><a href="https://www.paypal.me/vanjoge">paypal.me/vanjoge</a> or <b>wjj58201@163.com</b></div>\
<hr>\
支付宝扫码:   \
<img style="width: 150px;" src="https://sgj.x2x.fun:851/img/zfb.png">\
</div>\
';

        showHelpLayer(tmphtml, vanGmMz.now_language.Setting + " v" + GM_info.script.version + vanGmMz.vv, true);
        this.D_OpenSetting();
        $("#txtTacConf").val(GM_getValue("TacConf", ""));
        $("#gm_setting_save")[0].addEventListener('click', function () {
            vanGmMz.setLanguage($("#gm_language").val());
            GM_setValue("xml_mode", $("#gm_xml_mode").val());
            GM_setValue("autoRun1", $("#gm_autorun").val());
            let tmpTacConf = $("#txtTacConf").val();
            GM_setValue("TacConf", tmpTacConf);
            if (tmpTacConf && tmpTacConf.trim() != "") {
                vanGmMz.tacCof = JSON.parse(tmpTacConf);
            } else {
                vanGmMz.tacCof = vpleModel.tacCof;
            }

            $('#gw_run')[0].title = vanGmMz.now_language.ManualColorTitle;
            $('#gw_run').html("<b>" + vanGmMz.now_language.ManualColor + "</b>");
            $('#gw_run2')[0].title = vanGmMz.now_language.SettingTitle;
            $('#gw_run2').html("<b>" + vanGmMz.now_language.Setting + "</b>");

            $('#gw_jijing').html(vanGmMz.now_language.Jijing);
            $('#gw_dongzuo').html(vanGmMz.now_language.dongzuo);
            $('#gw_copyxml1').html(vanGmMz.now_language.Copyxml1);
            $('#gw_copyxml2').html(vanGmMz.now_language.Copyxml2);
            $('#gw_test').html(vanGmMz.now_language.Test);


            powerboxCloseAll();
        });
        $("#gm_setting_clear")[0].addEventListener('click', function () {
            vple.cacheItem.clearAll();
        });

        $("#gm_setting_players_html")[0].addEventListener('click', function () {
            vanGmMz.GetPlayerHtml(true);
        });
        $("#gm_setting_players_html2")[0].addEventListener('click', function () {
            vanGmMz.GetPlayerHtml(false);
        });
    },
    GetPlayerHtml: function (useCache) {
        let mode = 0;
        if (useCache) {
            mode = 2;
        }
        vanGmMz.GetPlayerHtmlByEn(mode, false, function (data) {
            GM_setClipboard(data);
            alert(vanGmMz.now_language.CopyXml);
        });
    },
    GetPlayerHtmlByEn: function (mode, Cjson, callback) {
        var plang = $("meta[name=language]").attr("content");
        if (plang != "en") {
            $.get("/ajax.php?p=settings&sub=lang&sport=" + vanGmMz.now_sport + "&lang=en", function (data, status) {
            });
        }
        vple.ajax(
            "/?p=players&sport=" + vanGmMz.now_sport,
            function (data) {
                callback(data);
            }, mode, Cjson);
        if (plang != "en") {
            $.get("/ajax.php?p=settings&sub=lang&sport=" + vanGmMz.now_sport + "&lang=" + plang, function (data, status) {
            });
        }
    }
    ,

    mEvent: undefined, mStaticEventHome: undefined, mStaticEventAway: undefined,
    out_of_play: undefined,
    dit_bypid: {},
    dit_player: {},
    m_koFrame: 0, m_htFrame: 0, m_ko2Frame: 0, m_ht2Frame: 0, m_ko3Frame: 0, m_ht3Frame: 0, m_ko4Frame: 0, m_ht4Frame: 0,

    Advanced2D: function () {

        if (vanGmMz.OK_2D) {
            if ($("#canvas").length > 0) {

                let home = MyGame.prototype.mzlive.m_match.getHomeTeam();
                let away = MyGame.prototype.mzlive.m_match.getAwayTeam();

                if (home != null && away != null) {
                    window["gmXml_" + MyGame.prototype.mzlive.m_match.m_matchId] = $.parseXML(window.matchLoader.matchXml.xmlText);
                    let nl = window.matchLoader.matchXml.documentElement.evaluate('Periods/*');
                    let p;
                    while (p = nl.iterateNext()) {
                        if (p.getAttribute('name') == 'half1') {
                            vanGmMz.m_koFrame = MyGame.prototype.mzlive.m_match.timeToFrame(p.getAttribute('start'));
                            vanGmMz.m_htFrame = MyGame.prototype.mzlive.m_match.timeToFrame(p.getAttribute('end'));
                        }
                        else if (p.getAttribute('name') == 'half2') {
                            vanGmMz.m_ko2Frame = MyGame.prototype.mzlive.m_match.timeToFrame(p.getAttribute('start'));
                            vanGmMz.m_ht2Frame = MyGame.prototype.mzlive.m_match.timeToFrame(p.getAttribute('end'));
                        }
                        else if (p.getAttribute('name') == 'extra1') {
                            vanGmMz.m_ko3Frame = MyGame.prototype.mzlive.m_match.timeToFrame(p.getAttribute('start'));
                            vanGmMz.m_ht3Frame = MyGame.prototype.mzlive.m_match.timeToFrame(p.getAttribute('end'));
                        }
                        else if (p.getAttribute('name') == 'extra2') {
                            vanGmMz.m_ko4Frame = MyGame.prototype.mzlive.m_match.timeToFrame(p.getAttribute('start'));
                            vanGmMz.m_ht4Frame = MyGame.prototype.mzlive.m_match.timeToFrame(p.getAttribute('end'));
                        }
                    }

                    let players = window.matchLoader.matchXml.documentElement.evaluate('Player');
                    let re1;
                    vanGmMz.dit_bypid = {};
                    vanGmMz.dit_player = {};
                    while (re1 = players.iterateNext()) {
                        let ttt = {
                            internalId: re1.getAttribute('internalId'),
                            name: re1.getAttribute('name'),
                            shirtno: re1.getAttribute('shirtno'),
                            teamId: re1.getAttribute('teamId'),
                            origin: re1.getAttribute('origin')
                        };
                        vanGmMz.dit_bypid[re1.getAttribute('id')] = ttt;
                        if (ttt.teamId == home.m_teamId) {
                            vanGmMz.dit_player[ttt.internalId] = home.getPlayerByPlayerId(ttt.internalId);
                        } else {
                            vanGmMz.dit_player[ttt.internalId] = away.getPlayerByPlayerId(ttt.internalId);
                        }
                    }

                    let events = window.matchLoader.matchXml.documentElement.evaluate('Events/*');

                    let re, begin, end;

                    let homeTc = new Array();
                    let awayTc = new Array();


                    vanGmMz.out_of_play = new vanGmMzModel.OutOfPlay();
                    vanGmMz.out_of_play.add(0, vanGmMz.m_koFrame);
                    vanGmMz.out_of_play.add(vanGmMz.m_htFrame, vanGmMz.m_ko2Frame);
                    if (vanGmMz.m_ko3Frame > 0) {
                        vanGmMz.out_of_play.add(vanGmMz.m_ht2Frame, vanGmMz.m_ko3Frame);
                    }
                    if (vanGmMz.m_ko4Frame > 0) {
                        vanGmMz.out_of_play.add(vanGmMz.m_ht3Frame, vanGmMz.m_ko4Frame);
                    }
                    while (re = events.iterateNext()) {
                        begin = re.getAttribute('intervalendframe');
                        end = re.getAttribute('startframe');
                        if (begin != undefined && end != undefined) {
                            vanGmMz.out_of_play.add(begin, end);
                        }

                        //战术变动
                        if (re.tagName == 'Tactic') {
                            let t_teamid = re.getAttribute('teamId');
                            let t_time = re.getAttribute('time');
                            let t_type = re.getAttribute('type');
                            let t_new_setting = re.getAttribute('new_setting');
                            if (t_teamid == home.m_teamId) {
                                homeTc.push({
                                    tag: 'Tactic',
                                    m_frame: MyGame.prototype.mzlive.m_match.timeToFrame(t_time),
                                    type: t_type,
                                    new_setting: t_new_setting,
                                    m_team: home
                                });
                            } else {
                                awayTc.push({
                                    tag: 'Tactic',
                                    m_frame: MyGame.prototype.mzlive.m_match.timeToFrame(t_time),
                                    type: t_type,
                                    new_setting: t_new_setting,
                                    m_team: away
                                });
                            }
                        }
                        //换人
                        else if (re.tagName == 'Substitution') {
                            let t_time = re.getAttribute('time');
                            let t_clock = re.getAttribute('clock');
                            let t_frame = re.getAttribute('frame');
                            let t_playerId = re.getAttribute('playerId');
                            let t_teamId = re.getAttribute('teamId');
                            let t_substitutedId = re.getAttribute('substitutedId');
                            let t_reason = re.getAttribute('reason');
                            let t_minute = re.getAttribute('minute');
                            let t_scorecondition = re.getAttribute('scorecondition');
                            let t_score = re.getAttribute('score');

                            let t_player, t_sub_player;
                            let p5 = vanGmMz.dit_bypid[t_playerId];
                            if (p5) {
                                t_player = vanGmMz.dit_player[p5.internalId];
                            }
                            p5 = vanGmMz.dit_bypid[t_substitutedId];
                            if (p5) {
                                t_sub_player = vanGmMz.dit_player[p5.internalId];
                            }

                            if (t_teamId == home.m_teamId) {
                                homeTc.push({
                                    tag: 'Sub',
                                    m_frame: t_frame,
                                    clock: t_clock,
                                    player: t_player,
                                    sub_player: t_sub_player,
                                    reason: t_reason,
                                    minute: t_minute,
                                    scorecondition: t_scorecondition,
                                    score: t_score,
                                    m_team: home
                                });
                            } else {
                                awayTc.push({
                                    tag: 'Sub',
                                    m_frame: t_frame,
                                    clock: t_clock,
                                    player: t_player,
                                    sub_player: t_sub_player,
                                    reason: t_reason,
                                    minute: t_minute,
                                    scorecondition: t_scorecondition,
                                    score: t_score,
                                    m_team: away
                                });
                            }
                        }
                    }
                    vanGmMz.out_of_play.Sort();




                    let lstEventHome = new vanGmMzModel.MatchEvent();
                    let lstEventAway = new vanGmMzModel.MatchEvent();
                    lstEventHome.setAllPlayerEvent(home, homeTc);
                    lstEventAway.setAllPlayerEvent(away, awayTc);

                    lstEventHome.Sort();
                    lstEventAway.Sort();

                    vanGmMz.mStaticEventHome = lstEventHome;
                    vanGmMz.mStaticEventAway = lstEventAway;

                    let lstEvent2 = new vpleModel.MatchEvent2();
                    lstEvent2.setData(MyGame.prototype.mzlive.m_match, vanGmMz);
                    vanGmMz.mEvent = lstEvent2;


                    if ($('.gw_div_left').length == 0) {
                        $('#canvas').parent().append('<div class="gw_div_left"></div>');
                        $('#canvas').parent().append('<div class="gw_div_right"></div>');
                        $('#canvas').parent().append(
                            '<div><b id="gw_jijing" class="gw_run" style="color: red;">' + vanGmMz.now_language.Jijing + '</b>'
                            + '    <b id="gw_dongzuo" class="gw_run" style="color: red;">' + vanGmMz.now_language.dongzuo + '</b>'
                            + '    <b id="gw_copyxml1" class="gw_run" style="color: red;">' + vanGmMz.now_language.Copyxml1 + '</b>'
                            + '    <b id="gw_copyxml2" class="gw_run" style="color: red;">' + vanGmMz.now_language.Copyxml2 + '</b>'
                            + '    <b id="gw_test" class="gw_run" style="color: red;">' + vanGmMz.now_language.Test + '</b>'
                            + '</div>');

                        $('#gw_jijing')[0].addEventListener('click', function () {
                            vanGmMz.ShowDiv(0);
                        });

                        $('#gw_dongzuo')[0].addEventListener('click', function () {
                            vanGmMz.ShowDiv(1);
                        });

                        $('#gw_copyxml1')[0].addEventListener('click', function () {
                            vanGmMz.CopyXML(MyGame.prototype.mzlive.m_match.m_matchId, true);

                        });
                        $('#gw_copyxml2')[0].addEventListener('click', function () {
                            vanGmMz.CopyXML(MyGame.prototype.mzlive.m_match.m_matchId, false);
                        });
                        $('#gw_test')[0].addEventListener('click', function () {

                        });

                    } else {
                        $('.gw_div_left').empty();
                        $('.gw_div_right').empty();
                    }
                }
            }
        }
    }
    ,
    ShowDiv: function (type) {
        $('.gw_div_left').empty();
        $('.gw_div_right').empty();
        if (type == 0) {
            let lstEventHome = vanGmMz.mStaticEventHome;
            let lstEventAway = vanGmMz.mStaticEventAway;

            let team = MyGame.prototype.mzlive.m_match.getHomeTeam();
            $('.gw_div_left').append("<div><b>" +
                team.getTactics() + " " + team.getPlayStyle() + " " + team.getAggression()
                + "</b></div>");
            for (let i = 0; i < lstEventHome.data.length; i++) {
                if (lstEventHome.data[i].tag == "Tactic") {
                    $('.gw_div_left').append('<div><b id="gw_eventH' + i + '" class="gw_run">'
                        + MyGame.prototype.mzlive.m_match.frameToMatchMinute(lstEventHome.data[i].m_frame) + "′ "
                        + lstEventHome.data[i].type + " -> "
                        + lstEventHome.data[i].new_setting + '</b></div>');
                } else if (lstEventHome.data[i].tag == "Sub") {
                    $('.gw_div_left').append('<div><b id="gw_eventH' + i + '" class="gw_run">'
                        + MyGame.prototype.mzlive.m_match.frameToMatchMinute(lstEventHome.data[i].m_frame) + "′ "
                        + lstEventHome.data[i].player.m_name + "(" + lstEventHome.data[i].player.m_shirtNo + ")↑ "
                        + lstEventHome.data[i].sub_player.m_name + "(" + lstEventHome.data[i].sub_player.m_shirtNo + ")↓<br/>"
                        + lstEventHome.data[i].reason + lstEventHome.data[i].minute + "′[" + lstEventHome.data[i].scorecondition + " " + lstEventHome.data[i].score + "]"
                        + '</b></div>');

                } else {
                    $('.gw_div_left').append('<div><b id="gw_eventH' + i + '" class="gw_run">'
                        + MyGame.prototype.mzlive.m_match.frameToMatchMinute(lstEventHome.data[i].m_frame) + "′ "
                        + lstEventHome.data[i].m_owner.m_name + "(" + lstEventHome.data[i].m_owner.m_shirtNo + ") "
                        + lstEventHome.data[i].m_description + '</b></div>');
                }

                let dom = $('#gw_eventH' + i)[0];
                dom.m_frame = lstEventHome.data[i].m_frame;
                dom.m_frame -= 45;
                if (dom.m_frame < 0) {
                    dom.m_frame = 0;
                }
                dom.addEventListener('click', function () { MyGame.prototype.mzlive.m_match.setCurrentFrame(this.m_frame); });
            }

            team = MyGame.prototype.mzlive.m_match.getAwayTeam();
            $('.gw_div_right').append("<div><b>" +
                team.getTactics() + " " + team.getPlayStyle() + " " + team.getAggression()
                + "</b></div>");
            for (let i = 0; i < lstEventAway.data.length; i++) {
                if (lstEventAway.data[i].tag == "Tactic") {
                    $('.gw_div_right').append('<div><b id="gw_eventA' + i + '" class="gw_run">'
                        + MyGame.prototype.mzlive.m_match.frameToMatchMinute(lstEventAway.data[i].m_frame) + "′ "
                        + lstEventAway.data[i].type + " -> "
                        + lstEventAway.data[i].new_setting + '</b></div>');
                } else if (lstEventAway.data[i].tag == "Sub") {
                    $('.gw_div_right').append('<div><b id="gw_eventA' + i + '" class="gw_run">'
                        + MyGame.prototype.mzlive.m_match.frameToMatchMinute(lstEventAway.data[i].m_frame) + "′ "
                        + lstEventAway.data[i].player.m_name + "(" + lstEventAway.data[i].player.m_shirtNo + ")↑ "
                        + lstEventAway.data[i].sub_player.m_name + "(" + lstEventAway.data[i].sub_player.m_shirtNo + ")↓<br/>"
                        + lstEventAway.data[i].reason + lstEventAway.data[i].minute + "′[" + lstEventAway.data[i].scorecondition + " " + lstEventAway.data[i].score + "]"
                        + '</b></div>');
                } else {
                    $('.gw_div_right').append('<div><b id="gw_eventA' + i + '" class="gw_run">'
                        + MyGame.prototype.mzlive.m_match.frameToMatchMinute(lstEventAway.data[i].m_frame) + "′ "
                        + lstEventAway.data[i].m_owner.m_name + "(" + lstEventAway.data[i].m_owner.m_shirtNo + ") "
                        + lstEventAway.data[i].m_description + '</b></div>');
                }
                let dom = $('#gw_eventA' + i)[0];
                dom.m_frame = lstEventAway.data[i].m_frame;
                dom.m_frame -= 45;
                if (dom.m_frame < 0) {
                    dom.m_frame = 0;
                }
                dom.addEventListener('click', function () { MyGame.prototype.mzlive.m_match.setCurrentFrame(this.m_frame); });
            }
        } else {

            for (let pid in vanGmMz.mEvent.dataByPlayer) {
                let divname;
                if (vanGmMz.mEvent.dataByPlayer[pid].isHome) {
                    divname = '.gw_div_left';
                } else {
                    divname = '.gw_div_right';
                }
                let frame_count = 0;
                frame_count = vanGmMz.mEvent.dataByPlayer[pid].FoolCount;
                $(divname).append('<div><b id="gw_player_' + pid + '" class="gw_run">'
                    + vanGmMz.mEvent.dataByPlayer[pid].owner.m_name + "(" + vanGmMz.mEvent.dataByPlayer[pid].owner.m_shirtNo + ")"
                    + "[" + frame_count + "]</b></div>");
                let dom = $("#gw_player_" + pid)[0];
                dom.pid = pid;
                dom.divname = divname;
                dom.addEventListener('click', function () {
                    $(this.divname).empty();

                    $(divname).append('<div><b>'
                        + vanGmMz.mEvent.dataByPlayer[pid].owner.m_name + "(" + vanGmMz.mEvent.dataByPlayer[pid].owner.m_shirtNo + ")</b></div>");
                    let arr = vanGmMz.mEvent.dataByPlayer[this.pid].data;
                    for (let k = 0; k < arr.length; k++) {
                        let key = 'gw_player_' + pid + "_s_" + k;
                        $(this.divname).append('<div><b id="' + key + '" class="gw_run">'
                            + MyGame.prototype.mzlive.m_match.frameToMatchMinute(arr[k].m_frame_start) + "′["
                            + arr[k].m_frame_start + "+" + (arr[k].m_frame_end - arr[k].m_frame_start + 1)
                            + "]" + (arr[k].FoolCount == 0 ? "" : ("+" + arr[k].FoolCount)) + " "
                            + vanGmMz.getMatchStatusName(arr[k].status)
                            + "</b></div>");

                        let dom = $("#" + key)[0];
                        dom.m_frame = arr[k].m_frame_start;
                        dom.addEventListener('click', function () { MyGame.prototype.mzlive.m_match.setCurrentFrame(this.m_frame); });
                    }
                });





            }
        }
    }
    ,

    getMatchStatusName: function (status) {
        switch (status) {
            case MatchStatus.BA_NORMAL:
                return vanGmMz.now_language.BA_NORMAL;
            case MatchStatus.BA_WALL:
                return vanGmMz.now_language.BA_WALL;
            case MatchStatus.BA_HOLD:
                return vanGmMz.now_language.BA_HOLD;
            case MatchStatus.BA_DOWN:
                return vanGmMz.now_language.BA_DOWN;
            case MatchStatus.BA_HOLD_THROWIN:
                return vanGmMz.now_language.BA_HOLD_THROWIN;
            case MatchStatus.BA_THROWIN:
                return vanGmMz.now_language.BA_THROWIN;
            case MatchStatus.BA_LEFT_FOOT_SHOT_FWD:
                return vanGmMz.now_language.BA_LEFT_FOOT_SHOT_FWD;
            case MatchStatus.BA_LEFT_FOOT_SHOT_BACK:
                return vanGmMz.now_language.BA_LEFT_FOOT_SHOT_BACK;
            case MatchStatus.BA_LEFT_FOOT_SHOT_RIGHT:
                return vanGmMz.now_language.BA_LEFT_FOOT_SHOT_RIGHT;
            case MatchStatus.BA_LEFT_FOOT_SHOT_LEFT:
                return vanGmMz.now_language.BA_LEFT_FOOT_SHOT_LEFT;
            case MatchStatus.BA_RIGHT_FOOT_SHOT_FWD:
                return vanGmMz.now_language.BA_RIGHT_FOOT_SHOT_FWD;
            case MatchStatus.BA_RIGHT_FOOT_SHOT_BACK:
                return vanGmMz.now_language.BA_RIGHT_FOOT_SHOT_BACK;
            case MatchStatus.BA_RIGHT_FOOT_SHOT_RIGHT:
                return vanGmMz.now_language.BA_RIGHT_FOOT_SHOT_RIGHT;
            case MatchStatus.BA_RIGHT_FOOT_SHOT_LEFT:
                return vanGmMz.now_language.BA_RIGHT_FOOT_SHOT_LEFT;
            case MatchStatus.BA_LEFT_FOOT_PASS_FWD:
                return vanGmMz.now_language.BA_LEFT_FOOT_PASS_FWD;
            case MatchStatus.BA_LEFT_FOOT_PASS_BACK:
                return vanGmMz.now_language.BA_LEFT_FOOT_PASS_BACK;
            case MatchStatus.BA_LEFT_FOOT_PASS_RIGHT:
                return vanGmMz.now_language.BA_LEFT_FOOT_PASS_RIGHT;
            case MatchStatus.BA_LEFT_FOOT_PASS_LEFT:
                return vanGmMz.now_language.BA_LEFT_FOOT_PASS_LEFT;
            case MatchStatus.BA_RIGHT_FOOT_PASS_FWD:
                return vanGmMz.now_language.BA_RIGHT_FOOT_PASS_FWD;
            case MatchStatus.BA_RIGHT_FOOT_PASS_BACK:
                return vanGmMz.now_language.BA_RIGHT_FOOT_PASS_BACK;
            case MatchStatus.BA_RIGHT_FOOT_PASS_RIGHT:
                return vanGmMz.now_language.BA_RIGHT_FOOT_PASS_RIGHT;
            case MatchStatus.BA_RIGHT_FOOT_PASS_LEFT:
                return vanGmMz.now_language.BA_RIGHT_FOOT_PASS_LEFT;
            case MatchStatus.BA_PICK_UP_BALL:
                return vanGmMz.now_language.BA_PICK_UP_BALL;
            case MatchStatus.BA_DROP_BALL:
                return vanGmMz.now_language.BA_DROP_BALL;
            case MatchStatus.BA_HEADER:
                return vanGmMz.now_language.BA_HEADER;
            case MatchStatus.BA_TRIP:
                return vanGmMz.now_language.BA_TRIP;
            case MatchStatus.BA_CELEBRATE:
                return vanGmMz.now_language.BA_CELEBRATE;
            case MatchStatus.BA_GK_READY:
                return vanGmMz.now_language.BA_GK_READY;
            case MatchStatus.BA_GK_ACRO_LEFT:
                return vanGmMz.now_language.BA_GK_ACRO_LEFT;
            case MatchStatus.BA_GK_ACRO_LEFT_HOLD:
                return vanGmMz.now_language.BA_GK_ACRO_LEFT_HOLD;
            case MatchStatus.BA_GK_ACRO_RIGHT:
                return vanGmMz.now_language.BA_GK_ACRO_RIGHT;
            case MatchStatus.BA_GK_ACRO_RIGHT_HOLD:
                return vanGmMz.now_language.BA_GK_ACRO_RIGHT_HOLD;
            case MatchStatus.BA_GK_SIDESTEP_LEFT:
                return vanGmMz.now_language.BA_GK_SIDESTEP_LEFT;
            case MatchStatus.BA_GK_SIDESTEP_RIGHT:
                return vanGmMz.now_language.BA_GK_SIDESTEP_RIGHT;
            case MatchStatus.BA_GK_KICK:
                return vanGmMz.now_language.BA_GK_KICK;
            case MatchStatus.BA_GK_THROW_BALL:
                return vanGmMz.now_language.BA_GK_THROW_BALL;
            case MatchStatus.BA_GK_STRETCH_LEFT:
                return vanGmMz.now_language.BA_GK_STRETCH_LEFT;
            case MatchStatus.BA_GK_STRETCH_LEFT_HOLD:
                return vanGmMz.now_language.BA_GK_STRETCH_LEFT_HOLD;
            case MatchStatus.BA_GK_STRETCH_RIGHT:
                return vanGmMz.now_language.BA_GK_STRETCH_RIGHT;
            case MatchStatus.BA_GK_STRETCH_RIGHT_HOLD:
                return vanGmMz.now_language.BA_GK_STRETCH_RIGHT_HOLD;
            case MatchStatus.BA_BALL_OWNER:
                return vanGmMz.now_language.BA_BALL_OWNER;
            case MatchStatus.BA_TACKLE:
                return vanGmMz.now_language.BA_TACKLE;
            case MatchStatus.BA_SLIDING_TACKLE:
                return vanGmMz.now_language.BA_SLIDING_TACKLE;
            case MatchStatus.BA_SLIDING_TACKLE_STAND:
                return vanGmMz.now_language.BA_SLIDING_TACKLE_STAND;
            case MatchStatus.BA_MAX:
                return vanGmMz.now_language.BA_MAX;
            case 1001:
                return vanGmMz.now_language.BA_MY_1001;
            case 1002:
                return vanGmMz.now_language.BA_MY_1002;
            case 1003:
                return vanGmMz.now_language.BA_MY_1003;
            case 1011:
                return vanGmMz.now_language.BA_MY_1011;
            case 1012:
                return vanGmMz.now_language.BA_MY_1012;
            default:
                return vanGmMz.now_language.Unknown;
        }
    }
    ,
    StatsToPos_X: function (i, IsLocal) {
        let ret = IsLocal ? Math.round(-.255800462 * i + 199.8228530689) : Math.round(.2555000556 * i + 8.3741302936);
        return ret;
    }
    ,
    StatsToPos_Y: function (i, IsLocal) {
        let ret = IsLocal ? Math.round(-.3073207154 * i + 315.9278777381) : Math.round(.3070644902 * i + 9.2794889414);
        return ret;
    }
    ,
    CopyXML: function (mid, ishome) {

        let xml_mode = GM_getValue("xml_mode", 0);
        if (xml_mode == 0) {
            vanGmMz.getMax(function () {
                let tmpXML = vanGmMz.Stats2XML(mid, ishome, vanGmMz.pmax);
                GM_setClipboard(tmpXML);
                alert(vanGmMz.now_language.CopyXmlMsg);
            });
        } else {
            let tmpXML = vanGmMz.Stats2XML(mid, ishome);
            vanGmMz.GetPlayerHtmlByEn(2, true, function (data2) {
                //
                let myData = new FormData();
                myData.append("xml", "9" + base64js.fromByteArray(pako.gzip(tmpXML)));
                myData.append("html", data2);
                myData.append("tacConf", GM_getValue("TacConf", ""));
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://sgj.x2x.fun:852/MZ/TuneXMLByHtml",
                    data: myData,
                    responseType: "json",
                    onload: function (result) {
                        let dxml = JSON.parse(result.responseText);
                        if (dxml.ErrorCode == 0) {
                            GM_setClipboard(dxml.data);
                            alert(vanGmMz.now_language.CopyXmlMsg);
                        } else {
                            alert(vanGmMz.now_language.CopyXmlMsgError);
                        }
                    },
                    onerror: function (result) {
                        alert(vanGmMz.now_language.CopyXmlMsgError);
                    }
                });
            });
        }
    }
    ,
    Stats2XML: function (mid, ishome, players) {


        let data = window["gmXml_" + mid];
        if (!data) {
            return "";
        }
        let teams = data.documentElement.getElementsByTagName("Team");
        let team = ishome ? teams[0] : teams[1];

        let pidArr = new Array();
        if (players) {
            for (let pid in players) {
                pidArr.push(pid);
            }
        }
        while (pidArr.length < 11) {
            pidArr.push(0);
        }

        let tmpXML = "<?xml version=\"1.0\" ?>" + "\r\n<SoccerTactics>\r\n\t<Team tactics=" + "\"" + team.getAttribute("tactic") + "\" playstyle=\"" + team.getAttribute("playstyle") + "\" aggression=\"" + team.getAttribute("aggression") + "\" />\r\n"
            + "\t<Pos pos=\"goalie\" pid=\"" + pidArr.shift() + "\" x=\"103\" y=\"315\" x1=\"103\" y1=\"315\" x2=\"103\" y2=\"315\" pt=\"15\" fk=\"15\" />\r\n";

        let players_xml = data.documentElement.getElementsByTagName('Player');
        for (var i = 0; i < players_xml.length; i++) {
            let pl = players_xml[i];
            let origin = pl.getAttribute('origin');
            let teamId = pl.getAttribute("teamId");
            if (origin != "" && origin != "375,0" && origin != "375,1000") {
                let arr = origin.split(",");
                if (team.getAttribute("id") == teamId) {
                    let x = vanGmMz.StatsToPos_X(arr[0], ishome);
                    let y = vanGmMz.StatsToPos_Y(arr[1], ishome);
                    tmpXML += "\t<Pos pos=\"normal\" pid=\"" + pidArr.shift() + "\" x=\"" + x + "\" y=\"" + y + "\" x1=\"" + x + "\" y1=\"" + y + "\" x2=\"" + x + "\" y2=\"" + y + "\" pt=\"1\" fk=\"1\" />\r\n";
                }

            }
        }
        tmpXML += "</SoccerTactics>\r\n";
        return tmpXML;
    }
    ,
    _open: undefined, _prepareTransferData: undefined, _centerPowerbox: undefined, _ajaxSubmit: undefined, _getPlayerInfo: undefined,
    finalInitAfterLoading: undefined, processButtonPresses: undefined, Load010SetupMainSceneInstance: undefined,
    OK_2D: false,

    run_Tac: function (playerid) {
        vanGmMz.getMax(function () {
            let players = $("#playerInfoWindow");
            if (players.length > 0) {
                let pdom = players.eq(0);
                let pid = pdom.html().match(vanGmMzModel.mzreg.playerId_tac)[1];
                if (pid != playerid) {
                    return;
                }
                let player = vanGmMz.pmax[pid];
                let imgs = pdom.find("img.skill");

                if (player) {
                    vanGmMz.setPlayerImgs(imgs, player);

                    let p_age = teamTactic.tacticsData.TeamPlayers.Player[teamTactic.tacticsData.playerIndexReference[pid]]["@attributes"].age;
                    if (mz.season - p_age >= 52) {
                        vanGmMz.getScoutReport(pid, pdom);
                    }
                    let sp = $("span.clippable.bold");
                    sp.unbind("click");
                    sp.bind("click", function () {
                        vanGmMz.showScore(pid, pdom);
                    });
                }
            }
        });
    }
    ,
    run_Training: function (pid) {
        vanGmMz.getMax(function () {
            let players = $("div.tooltip.shadow");
            if (players.length > 0) {
                let pdom = players.eq(0);
                let player = vanGmMz.pmax[pid];
                if (player) {
                    let imgs = pdom.find("img.skill");
                    vanGmMz.setPlayerImgs(imgs, player);
                    let p_age = players.find(".box_dark").find("p").eq(0).html().match(/\d+/)[0]
                    if (mz.season - p_age >= 52) {
                        vanGmMz.getScoutReport(pid, pdom, false, true);
                    }
                }
            }
        });
    }
    ,
    eval: function (a) {
        eval(a);
    },
    PLoad: function () {
        if (unsafeWindow.ajaxSport) {
            vanGmMz.PLoadInternal();
        } else {
            setTimeout(function () { vanGmMz.PLoad(); }, 1000);
        }
    },
    PLoadInternal: function () {

        if ($(".fa").css("font-family") != "FontAwesome") {
            var style = document.createElement('link');
            style.href = 'https://cdnjs.loli.net/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
            style.rel = 'stylesheet';
            style.type = 'text/css';
            document.getElementsByTagName('HEAD').item(0).appendChild(style);
        }

        if (ajaxSport && ajaxSport == "soccer") {
            let vgm = this;
            vgm.initgw();
            vgm._open = window.XMLHttpRequest.prototype.open;
            window.XMLHttpRequest.prototype.open = function () {
                if (vanGmMzModel.mzreg.data2d_url.test(arguments[1])) {
                    vgm.OK_2D = false;
                    if (MyGame.prototype.mzlive.R_GW == undefined) {
                        MyGame.prototype.mzlive.R_GW = true;

                        vgm.finalInitAfterLoading = MyGame.prototype.mzlive.finalInitAfterLoading;
                        MyGame.prototype.mzlive.finalInitAfterLoading = function () {
                            vgm.finalInitAfterLoading.apply(this);
                            vgm.OK_2D = true;
                            vgm.Advanced2D();
                        };
                        vgm.Load010SetupMainSceneInstance = MyGame.prototype.Load010SetupMainSceneInstance;
                        MyGame.prototype.Load010SetupMainSceneInstance = function () {
                            window.matchLoader = arguments[0];
                            vgm.Load010SetupMainSceneInstance.apply(this, arguments);
                        };

                    }
                }
                return vgm._open.apply(this, arguments);
            };

            if (unsafeWindow.prepareTransferData != undefined) {
                vgm._prepareTransferData = unsafeWindow.prepareTransferData;
                unsafeWindow.prepareTransferData = function (readyState, response, responseParameter) {

                    vgm._prepareTransferData.apply(this, arguments);
                    if (GM_getValue("autoRun1", 1) == 1) {
                        if (typeof (responseParameter) === "undefined" || !responseParameter) {
                            vgm.gw_start(0);
                        }
                    }
                };
            }

            if (unsafeWindow.centerPowerbox != undefined) {
                vgm._centerPowerbox = unsafeWindow.centerPowerbox;
                unsafeWindow.centerPowerbox = function () {

                    vgm._centerPowerbox.apply(this, arguments);
                    if (GM_getValue("autoRun1", 1) == 1) {
                        vgm.gw_start(0);
                    }
                };
            }

            if ($.fn.ajaxSubmit != undefined) {
                vgm._ajaxSubmit = $.fn.ajaxSubmit;
                $.fn.ajaxSubmit = function (options) {
                    if (options.gm_success_is == undefined) {
                        options.gm_success_is = true;
                        options.gm_success = options.success;
                        options.success = function () {
                            options.gm_success.apply(this, arguments);
                            if (GM_getValue("autoRun1", 1) == 1) {
                                vgm.gw_start(0);
                            }
                        };
                    }
                    vgm._ajaxSubmit.apply(this, arguments);
                };
            }

            if (location.href == "https://www.managerzone.com/?p=tactics") {
                if (unsafeWindow.teamTactic.getPlayerInfo != undefined) {
                    vgm._getPlayerInfo = unsafeWindow.teamTactic.getPlayerInfo;
                    unsafeWindow.teamTactic.getPlayerInfo = function () {

                        vgm._getPlayerInfo.apply(this, arguments);
                        if (GM_getValue("autoRun1", 1) == 1) {
                            vgm.run_Tac(arguments[0]);
                        }
                    };
                }
            }
            else if (location.href == "https://www.managerzone.com/?p=training") {
                if (unsafeWindow.displayAndAdjustTooltipPositions != undefined) {
                    vgm._displayAndAdjustTooltipPositions = unsafeWindow.displayAndAdjustTooltipPositions;
                    unsafeWindow.displayAndAdjustTooltipPositions = function () {

                        vgm._displayAndAdjustTooltipPositions.apply(this, arguments);
                        if (GM_getValue("autoRun1", 1) == 1) {
                            vgm.run_Training(arguments[3]);
                        }
                    };
                }
            }
            vple.report(this);
            vgm.gw_start(0);
            vple.autoclearCache();
        }
        else if (ajaxSport == "hockey") {
            let vgm = this;
            vgm.now_sport = "hockey";
            vgm.initgw();

            if (unsafeWindow.prepareTransferData != undefined) {
                vgm._prepareTransferData = unsafeWindow.prepareTransferData;
                unsafeWindow.prepareTransferData = function (readyState, response, responseParameter) {

                    vgm._prepareTransferData.apply(this, arguments);
                    if (GM_getValue("autoRun1", 1) == 1) {
                        if (typeof (responseParameter) === "undefined" || !responseParameter) {
                            vgm.gw_start(0);
                        }
                    }
                };
            }

            if (unsafeWindow.centerPowerbox != undefined) {
                vgm._centerPowerbox = unsafeWindow.centerPowerbox;
                unsafeWindow.centerPowerbox = function () {

                    vgm._centerPowerbox.apply(this, arguments);
                    if (GM_getValue("autoRun1", 1) == 1) {
                        vgm.gw_start(0);
                    }
                };
            }

            if ($.fn.ajaxSubmit != undefined) {
                vgm._ajaxSubmit = $.fn.ajaxSubmit;
                $.fn.ajaxSubmit = function (options) {
                    if (options.gm_success_is == undefined) {
                        options.gm_success_is = true;
                        options.gm_success = options.success;
                        options.success = function () {
                            options.gm_success.apply(this, arguments);
                            if (GM_getValue("autoRun1", 1) == 1) {
                                vgm.gw_start(0);
                            }
                        };
                    }
                    vgm._ajaxSubmit.apply(this, arguments);
                };
            }
            if (location.href == "https://www.managerzone.com/?p=tactics") {
                if (unsafeWindow.teamTactic.getPlayerInfo != undefined) {
                    vgm._getPlayerInfo = unsafeWindow.teamTactic.getPlayerInfo;
                    unsafeWindow.teamTactic.getPlayerInfo = function () {

                        vgm._getPlayerInfo.apply(this, arguments);
                        if (GM_getValue("autoRun1", 1) == 1) {
                            vgm.run_Tac(arguments[0]);
                        }
                    };
                }
            }



            vgm.gw_start(0);
            vple.autoclearCache();
        }
    }
    ,

    D_GetNowSeasonInfo: function (xPlotLines) {
        return undefined;
    },
    D_FillTraining: function (type, playerTS, g, NowSeasonInfo) {
        if (type == "") {
            vanGmMz.fillTrainingLevel("itc", vanGmMzModel.mzreg.bar_itc, playerTS, g.marker.symbol);
            vanGmMz.fillTrainingLevel("ycc", vanGmMzModel.mzreg.bar_ycc, playerTS, g.marker.symbol);
            vanGmMz.fillTrainingLevel("pos", vanGmMzModel.mzreg.bar_pos, playerTS, g.marker.symbol);
            vanGmMz.fillTrainingLevel("neg", vanGmMzModel.mzreg.bar_neg, playerTS, g.marker.symbol, true);
        } else {
            vanGmMz.fillTrainingLevel(type, vanGmMzModel.mzreg.bar_itc, playerTS, g.marker.symbol);
            vanGmMz.fillTrainingLevel(type, vanGmMzModel.mzreg.bar_ycc, playerTS, g.marker.symbol);
            vanGmMz.fillTrainingLevel(type, vanGmMzModel.mzreg.bar_pos, playerTS, g.marker.symbol);
            vanGmMz.fillTrainingLevel(type, vanGmMzModel.mzreg.bar_neg, playerTS, g.marker.symbol, true);
        }
    },
    D_NowSeasonText: function (pid, NowSeasonInfo, pdom) {

    },
    D_ShowScoutText: function (strSus, pid, pdom, HS, HPids, LS, LPids) {
        showHelpLayer(strSus, vanGmMz.now_language.scoutReport, true);
        return strSus;
    },
    D_ShowMaybeSkill: function (pdom, HStar, HP1, HP2, LStar, LP1, LP2) {

    },
    D_OpenSetting: function () {

    },
    D_SetMaybeSkill: function (pdom, HStar, HP1, HP2, LStar, LP1, LP2) {
        let imgs = pdom.find("img.skill");
        let LMax = 10, Nmin = 4, NMax = 10, Hmin = 7;
        if (LStar == 1) {
            Nmin = 4;
            LMax = 6;
        }
        else if (LStar == 2) {
            Nmin = 5;
            LMax = 8;
        } else if (LStar == 3) {
            Nmin = 7;
            LMax = 10;
        }
        if (HStar < 4) {
            NMax = 9;
        }
        let tmpMSkills = {};
        for (let i = 0; i < 11; i++) {
            if (imgs[i].skill == undefined) {
                return;
            }
            let mskill = imgs[i].skill;
            if (imgs[i].maxed == "green") {
                mskill += 1;
            }
            tmpMSkills[i] = mskill;
            if (i == LP1 - 1 || i == LP2 - 1) {
                if (Nmin < mskill) {
                    Nmin = mskill;
                }
            } else if (i == HP1 - 1 || i == HP2 - 1) {
                //高星
                if (imgs[i].maxed == "red") {
                    if (mskill < NMax) {
                        NMax = mskill;
                    }
                }
            } else {
                if (Hmin < mskill) {
                    Hmin = mskill;
                }
                if (imgs[i].maxed == "red") {
                    if (mskill < LMax) {
                        LMax = mskill;
                    }
                }
            }
        }
        for (let i = 0; i < 11; i++) {
            let mbskill = 4;
            let mbmax = 10;
            if (i == HP1 - 1 || i == HP2 - 1) {
                //高星
                if (imgs[i].maxed != "red") {
                    mbmax = 10;
                }

                if (HStar == 3) {
                    mbskill = 8;
                } else if (HStar == 4) {
                    mbskill = 9;
                    //h4 9死 另一个一定10
                    let ahp;
                    if (i == HP1 - 1) {
                        ahp = HP2 - 1;
                    } else {
                        ahp = HP1 - 1;
                    }
                    if (imgs[ahp].maxed == "red" && imgs[ahp].skill == 9) {
                        mbskill = 10;
                    }
                }
                if (mbskill < Hmin) {
                    mbskill = Hmin;
                }
                if (mbskill < Nmin) {
                    mbskill = Nmin;
                }
            } else if (i == LP1 - 1 || i == LP2 - 1) {
                //低星
                if (imgs[i].maxed != "red") {
                    mbmax = LMax;
                }
            } else {
                if (imgs[i].maxed != "red") {
                    mbmax = NMax;
                }
                if (mbskill < Nmin) {
                    mbskill = Nmin;
                }
            }
            if (mbskill < tmpMSkills[i]) {
                mbskill = tmpMSkills[i];
            }
            if (imgs[i].maxed == "red") {
                mbmax = imgs[i].skill;
            }
            imgs[i].mbskill = mbskill;
            imgs[i].mbmax = mbmax;
        }

    },
    radarOption: function (tacPlayer, option, text) {
        let CFScore = this.GetScore(tacPlayer, vanGmMz.tacCof["CF"]);
        let WFScore = this.GetScore(tacPlayer, vanGmMz.tacCof["LWF"]);
        //let WMFScore = this.GetScore(tacPlayer, vanGmMz.tacCof["LMF"]);
        let CMFScore = this.GetScore(tacPlayer, vanGmMz.tacCof["CMF"]);
        let WMScore = this.GetScore(tacPlayer, vanGmMz.tacCof["LM"]);
        let CDMScore = this.GetScore(tacPlayer, vanGmMz.tacCof["CDM"]);
        let WBScore = this.GetScore(tacPlayer, vanGmMz.tacCof["LSB"]);
        let CBScore = this.GetScore(tacPlayer, vanGmMz.tacCof["CB"]);
        let GKScore = this.GetScore(tacPlayer, vanGmMz.tacCof["GK"]);
        option.legend.data.push(text);
        option.series[0].data.push({
            value: [CFScore, WFScore, CDMScore, WBScore, CBScore, GKScore, WMScore, CMFScore],
            name: text
        });
    },
    getRadarOption: function (tacPI, pdom) {
        let option = {
            title: {
                text: vanGmMz.now_language.PosScores
            },
            tooltip: {},
            legend: {
                data: []
            },
            radar: {
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [3, 5]
                    }
                },
                indicator: [
                    { name: vanGmMz.now_language.Pos56, max: 100 },
                    { name: vanGmMz.now_language.Pos10, max: 100 },
                    { name: vanGmMz.now_language.Pos21, max: 100 },
                    { name: vanGmMz.now_language.Pos22, max: 100 },
                    { name: vanGmMz.now_language.Pos9, max: 100 },
                    { name: vanGmMz.now_language.Pos7, max: 100 },
                    { name: vanGmMz.now_language.Pos4, max: 100 },
                    { name: vanGmMz.now_language.Pos23, max: 100 }
                ]
            },
            series: [{
                name: vanGmMz.now_language.Scores,
                type: 'radar',
                data: []
            }]
        };
        this.radarOption(tacPI.tacPlayer, option, vanGmMz.now_language.now);

        let imgs = pdom.find("img.skill");
        if (tacPI.tacPlayerMB.InitByImgs(imgs, "mbskill", 100, 100)) {
            this.radarOption(tacPI.tacPlayerMB, option, vanGmMz.now_language.future);
        }
        if (tacPI.tacPlayerMax.InitByImgs(imgs, "mbmax", 100, 100)) {
            this.radarOption(tacPI.tacPlayerMax, option, vanGmMz.now_language.max);
        }

        return option;
    },
    showScore: function (pid, pdom) {

        let tacPI = this.tacP[pid];
        if (tacPI == undefined) {
            tacPI = { tacPlayer: new vpleModel.TacPlayer(), tacPlayerMB: new vpleModel.TacPlayer(), tacPlayerMax: new vpleModel.TacPlayer() };

            this.tacP[pid] = tacPI;
        }
        if (tacPI.tacPlayer.InitByTds(pdom.find("td.skillval"))) {
            let content = "<div class='clearfix'><div id='ldchart' style='height: 400px; width: 400px'></div>";
            let pname = pdom.find(".player_name").html();
            if (pname == undefined) {
                pname = pdom.find(".player_link").html();
            }
            showHelpLayer(content, pname + "(" + pid + ")", true);
            let radar_chart = echarts.init(document.getElementById("ldchart"));
            radar_chart.setOption(this.getRadarOption(tacPI, pdom));
        }
    },
    GetScore: function (player, tacConfItem) {
        var Speed = this.GetScoreItem(player.Speed, tacConfItem.Speed);
        var Stamina = this.GetScoreItem(player.Stamina, tacConfItem.Stamina);
        var Gameintelligence = this.GetScoreItem(player.Gameintelligence, tacConfItem.Gameintelligence);
        var Passing = this.GetScoreItem(player.Passing, tacConfItem.Passing);
        var Shooting = this.GetScoreItem(player.Shooting, tacConfItem.Shooting);
        var Heading = this.GetScoreItem(player.Heading, tacConfItem.Heading);
        var Goalkeeping = this.GetScoreItem(player.Goalkeeping, tacConfItem.Goalkeeping);
        var Technique = this.GetScoreItem(player.Technique, tacConfItem.Technique);
        var Tackling = this.GetScoreItem(player.Tackling, tacConfItem.Tackling);
        var Highpassing = this.GetScoreItem(player.Highpassing, tacConfItem.Highpassing);
        var Situations = this.GetScoreItem(player.Situations, tacConfItem.Situations);
        var Experience = this.GetScoreItem(player.Experience, tacConfItem.Experience);
        var Form = this.GetScoreItem(player.Form, tacConfItem.Form);

        var score = player.Speed * Speed
            + player.Stamina * Stamina
            + player.Gameintelligence * Gameintelligence
            + player.Passing * Passing
            + player.Shooting * Shooting
            + player.Heading * Heading
            + player.Goalkeeping * Goalkeeping
            + player.Technique * Technique
            + player.Tackling * Tackling
            + player.Highpassing * Highpassing
            + player.Situations * Situations
            + player.Form * Form
            + player.Experience * Experience;
        var sum = Speed
            + Stamina
            + Gameintelligence
            + Passing
            + Shooting
            + Heading
            + Goalkeeping
            + Technique
            + Tackling
            + Highpassing
            + Situations
            + Form
            + Experience;
        return (score / sum).toFixed(2);
    },
    GetScoreItem: function (attrVal, prop) {
        var lastVal = 0;
        $.each(prop, function (key, values) {
            lastVal = values;
            if (attrVal < key) {
                return false;
            }
        });
        return lastVal;
    }
};

(function () {
    'use strict';
    vanGmMz.PLoad();
})();
