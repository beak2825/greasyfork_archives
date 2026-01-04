    var wakamemocss = `
body {
	box-sizing: border-box;
}

#memoContainer {
	display: none;
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0px;
	left: 0px;
	background-color: rgba(127, 127, 127, 0.8);
	padding: 10px;
	box-sizing: inherit;
	overflow: auto;
}

#floatButtonArea {
	position: fixed;
	right: 10px;
	top: 10px;
}

#memoMenu {
	width: 100%;
	margin: 0 auto;
	font-size: 10px;
}

#memoMenu input, #memoMenu select, #buttonArea input {
	font-size: 11px;
}

#memoTab {
	margin-top: 15px;
}

#memoBody {
	width: 100%;
	height: calc(100%-68px);
	margin: 0 auto;
	overflow: auto;
}

#playerInfoArea {
	width: calc(100%-20px);
	overflow: auto;
	background-color: white;
	padding: 10px;
}

#buttonArea {
	background-color: white;
	padding: 10px;
	line-height: 24px;
	font-size: 9pt;
}

#discussLogArea {
	width: calc(100%-20px);
	background-color: white;
	padding: 10px;
}

#voteArea {
	width: 100%;
	margin: 0 auto;
	background-color: white;
	display: none;
	padding: 10px;
}

#messageArea {
	width: 400px;
	height: 40px;
	position: fixed;
	left: 50%;
	transform: translate(-50%, 0);
	top: 15px;
	display: none;
}

#messageArea {
	text-align: center;
	font-size: 14px;
	color: black;
	vertical-align: middle;
	padding-top: 5px;
}

#warningArea {
	width: 300px;
	height: 40px;
	position: fixed;
	right: 15px;
	bottom: 15px;
	display: none;
	background-color: red;
	border-radius: 5px;
	text-align: center;
	font-size: 36px;
	color: white;
	font-weight: bold;
}

#playerInfoTable {
	background-color: white;
	text-align: center;
	font-size: 8pt;
	border-collapse: collapse;
	color: black;
	margin: 0 auto;
}

#playerInfoTable td {
	border: #666 solid 1px;
	padding: 1px;
}

#playerInfoTable tr:first-child {
	height: 35px;
}

#playerInfoTable tr td:first-child {
	min-width: 50px;
}

#discussLogTable {
	border-collapse: collapse;
}

#discussLogTable td {
	text-align: left;
	vertical-align: top;
	color: black;
	word-break: break-all;
	font-size: 9pt;
	line-height: 130%;
	padding: 2px;
}

#discussLogTable font {
	font-size: 9pt;
}

#discussLogTable tr td:first-of-type {
	min-width: 150px;
}

#playerInfoTable a {
	text-decoration: underline;
	color: blue;
	cursor: pointer;
}

#voteTable, #deathTable {
	font-size: 11px;
	border-collapse: collapse;
	margin-bottom: 10px;
	color: black;
}

#voteArea table td {
	border: 1px solid #ccc;
	padding: 2px;
}

.death {
    background-color:pink;
}
.gray {
	background-color:#e3e3e3;
}
#discussLogTable tr.systemlog td {
	font-weight: bold;
	background-color: var(--theme-color) !important;
	color: white;
	text-align: center;
}

#floatButtonArea>div {
	margin: 0px 2px;
	display: inline-block;
	vertical-align: top;
	width: 110px;
	box-shadow: 0 3px 5px rgba(0, 0, 0, 0.4);
}

#toolArea_hid {
	display: none;
}

#setting {
	font-size: 13px;
	position: fixed;
	right: 10px;
	bottom: 10px;
	display: none;
	width: 400px;
	height: 300px;
	background-color: white;
}

#setting input[type=number], #setting input[type=text] {
	width: 60px;
}

.coloredit {
	display: none;
}

.voiceloud {
	padding: 0px 5px;
}

.voiceloud div:not(:first-of-type) {
	margin-top: 5px;
}

.voice {
	box-sizing: border-box;
	width: 30px;
	height: 30px;
	font-size: 16px;
	border: 1px solid black;
	border-radius: 2px;
	background-color: white;
	line-height: 28px;
	text-align: center;
	color: black;
	cursor: pointer;
}

.voice.voice_selected {
	border: 3px solid red;
	line-height: 24px;
}

#caspe {
	display: none;
	position: fixed;
	right: 10px;
	bottom: 10px;
	width: 400px;
	height: 300px;
	overflow: auto;
	font-size: 9pt;
}

#caspe input[type=text] {
	width: 100px;
}

#caspe input[type=number] {
	width: 50px
}

#caspe, #setting, #messageArea {
	box-shadow: 0 3px 5px rgba(0, 0, 0, 0.4);
	border-top: 16px solid var(--theme-color);
	background-color: #efefef;
	padding: 10px;
}

.themeparts{
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    box-sizing: border-box;
    display: inline-block;
    font-size: 12px;
    font-weight: bold;
    line-height: 24px;
    text-align: center;
}

#floatButtonArea a, .button {
	width: 110px;
	background-color: var(--theme-color);
}

div.button {
    width: 110px;
    background-color: var(--theme-color);
	margin: 0px 2px;
	box-shadow: 0 3px 5px rgba(0, 0, 0, 0.4);
	padding: 0px 3px;
}

.tab {
	width: 150px;
	background-color: black;
	cursor: pointer;
	border-radius: 8px 8px 0 0;
}

.tab.active {
	background-color: var(--theme-color);
}

.select {
	width: 100px;
	background-color: black;
}

.select.active {
	background-color: var(--theme-color);
}

#floatButtonArea a:hover, div.button:hover, .tab:hover {
	color: white;
}
`