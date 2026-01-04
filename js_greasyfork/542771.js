// /*
// *********************
// 	***引导函数***
// *********************
// */
async function loadScriptAsync(scriptUrl) {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = scriptUrl + `?v=${Date.now()}`;
		script.onload = resolve;
		script.onerror = () => reject(new Error(`Failed to load: ${scriptUrl}`));
		document.head.appendChild(script);
	});
}

async function loadGlobalScriptsParallel(scripts) {
	await Promise.all(scripts.map(url => loadScriptAsync(url)));
}

async function LoadGlobalAllScripts() {
	let vpsUrl = "https://drive.alittlesnowflake.uk/Tagsy/";
	let ExternalUrl = "https://cdn.jsdelivr.net/"; // 引用外部资源
	const scripts = [
		ExternalUrl + "npm/html2canvas@1.4.1/dist/html2canvas.min.js",
		ExternalUrl + "npm/marked/marked.min.js",
		vpsUrl + "Resource/Style/MarkDownStyle.js",
		vpsUrl + "Resource/Style/UIManagerStyle.js",
		vpsUrl + "Module/Common/Tagsy_CodeTest.js",
		vpsUrl + "Module/Common/Tagsy_LSTockDaily.js",
		vpsUrl + "Module/Common/Tagsy_W2TickRoo.js",
		vpsUrl + "Module/Common/Tagsy_QLTaskCount.js",
		vpsUrl + "Module/Common/Tagsy_WeComTable.js",
		vpsUrl + "Variable/Config.js",
		vpsUrl + "Variable/Setting.js",
		vpsUrl + "Utils/Common.js",
		vpsUrl + "Utils/Helper.js",
		vpsUrl + "Utils/Model.js",
		vpsUrl + "Utils/Tool.js",
		vpsUrl + "Utils/UIManager.js",
		vpsUrl + "Utils/Version.js",
		vpsUrl + "Core/Infra.js",
		vpsUrl + "Core/Base.js",
		vpsUrl + "Core/Core.js",
	];

	await loadGlobalScriptsParallel(scripts);
}