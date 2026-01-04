// ==UserScript==
// @namespace  ATGT
// @name     Passmark CPU/GPU Filter
// @version  5
// @description  Passmark CPU/GPU Filter by Brand, Model or Inputed Text. @ cpubenchmark, videocardbenchmark.
// @author   StrongOpx
// @match    https://www.cpubenchmark.net/*
// @match    https://www.videocardbenchmark.net/*
// @grant    none
// @icon     https://www.cpubenchmark.net/favicon.ico
// @run-at   document-end
// @downloadURL https://update.greasyfork.org/scripts/397132/Passmark%20CPUGPU%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/397132/Passmark%20CPUGPU%20Filter.meta.js
// ==/UserScript==


console.log(`=== cpu benchmark filter on '${location.href}' ===`);

const active_bg_color = 'bisque';
const inactive_bg_color = 'slategray';
const active_fg_color = 'black';
const inactive_fg_color = 'lightgray';

function gen_filter_keyword(kw_regex, prod_map) {
	let regex = new RegExp(kw_regex, 'i');
	let products = document.querySelectorAll('ul.chartlist .prdname');
	for (let prod of products) {
		let m = prod.innerText.match(regex);
		if (m && m.length >= 2) {
			let kw = m[1];
			kw = kw.replace(/(AMD|Intel)\s+/i, '').replace('-', '').replace(/\s+/, '\\s+');
			//console.log(`gen filter m ${m} kw ${kw}`);
			if (!(kw in prod_map))
				prod_map[kw] = {};
		}
	}
	return prod_map;
}

function gen_filter_map(filter_map) {
	let products = document.querySelectorAll('ul.chartlist .prdname');
	for (let k of Object.keys(filter_map)) {
		let regex = filter_map['regex'];
		if (!regex) {
			regex = filter_map[k]['regex'] = new RegExp(k);
		}
		filter_map[k]['products'] = [];
		for (let prod of products) {
			//console.log('prod', prod.innerText);
			if (regex.test(prod.innerText)) {
				//console.log('Add prod', prod.innerText);
				filter_map[k]['products'].push(prod.parentNode.parentNode);
			}
		}
	}
}

function gen_filter_toolbar(toolbar, filter_map) {
	function filter_action(event) {
		let tool = event.target;
		if (tool.className.indexOf('filter_tool') < 0) {
			tool = tool.parentNode;
			if (tool.className.indexOf('filter_tool') < 0) {
				return;
			}
		}

		let active = tool.attributes['active'];
		// console.log('event on ', event.target, 'active', active);
		active = !active;
		tool.attributes['active'] = active;
		let display = active ? '' : 'none';
		for (let node of tool.attributes['map']) {
			// console.log('node of map ', node);
			node.style.display = display;
		}
		//tool.style.backgroundColor = active ? active_bg_color : inactive_bg_color;
		//tool.style.color = active ? active_fg_color : inactive_fg_color;
		//tool.style.border = active ? '1px solid black' : '1px dotted lightgray';
		tool.innerHTML = tool.attributes[active && 'activeName' || 'inactiveName']
		if (node.className.indexOf('filter_all') >= 0) {
			for (let node of document.querySelectorAll('.filter_tool.filter_part')) {
				//console.log('alter', node);
				node.attributes['active'] = active;
				//node.style.background = active ? active_bg_color : inactive_bg_color;
				//node.style.color = active ? active_fg_color : inactive_fg_color;
				//node.style.border = active ? '1px solid black' : '1px dotted lightgray';
				node.innerHTML = node.attributes[active && 'activeName' || 'inactiveName']
			}
		}
	}

	let container = document.createElement('DIV');
	container.className = 'filter_container';
	container.style.borderTop = '6px dotted white';
	container.style.textAlign = 'left';
	toolbar.appendChild(container);

	let node;
	for (let k of Object.keys(filter_map).sort()) {
		node = document.createElement('DIV');
		let name = k.replace(/^\.\*$/, 'All').replace(/(\\\w\+?|\.)+/i, ' ');  // replace non-readable chars
		let prod_cnt = filter_map[k]['products'].length;
		if (prod_cnt == 0)
			continue;
		name += ` <span style='color: slateblue;'>(${prod_cnt})</span>`
		node.style.border = '1px solid black';
		node.style.borderRadius = '4px';
		node.style.padding = '2px 4px';
		node.style.margin = '4px';
		node.style.cursor = 'pointer';
		node.style.textAlign = 'left';
		node.style.background = active_bg_color;
		node.style.color = active_fg_color;
		//node.style.float = 'left';
		node.addEventListener('click', filter_action, { capture: true });
		node.attributes['active'] = true;
		node.attributes['activeName'] = '✔️ ' + name;
		node.attributes['inactiveName'] = '&emsp; ' + name;
		node.innerHTML = node.attributes['activeName'];
		node.attributes['map'] = filter_map[k]['products'];
		//console.log('k ', k)
		if (/^\s*\.\*\s*/.test(k))
			node.className = 'filter_tool filter_all';
		else
			node.className = 'filter_tool filter_part';
		container.appendChild(node);
	}
	return container;
}

function gen_input_filter(header, all_cpu_map) {
	function update_filter(e) {
		let flt = e.target.value;
		try {
			flt = flt.replace(/\s+/, '.*');
			let regex = new RegExp(flt, 'i');
			let products = all_cpu_map[Object.keys(all_cpu_map)[0]]['products'];
			for (let node of products) {
				node.style.display = regex.test(node.innerText) ? '' : 'none';
			}
		} catch (e) {
			console.log('update filter for input error', e);
		}
	}
	let input = document.createElement('INPUT');
	input.type = 'text';
	input.style.margin = '2px 4px 6px 4px';
	input.style.width = '90%';
	input.addEventListener('input', update_filter);
	header.appendChild(input);
}

function create_filter_toolbar() {
	let toolbar = document.createElement('DIV');
	//toolbar.innerText = 'Filter: ';
	toolbar.style.borderRadius = '4px';
	toolbar.style.lineHeight = '1em';
	toolbar.style.position = 'fixed';
	toolbar.style.right = '8px';
	toolbar.style.top = '120px';
	toolbar.style.backgroundColor = inactive_bg_color;
	toolbar.style.color = active_fg_color;
	toolbar.style.zIndex = '10000';
	toolbar.style.fontSize = 'small';
	toolbar.style.padding = '4px';
	toolbar.style.maxWidth = '10rem';
	toolbar.style.maxHeight = '80%';

	function fold_filters(event) {
		console.log('Fold Filters');
		let target = event.target;
		target.attributes['fold'] = !target.attributes['fold'];
		for (let node of document.querySelectorAll('.filter_container')) {
			node.style.display = target.attributes['fold'] ? 'none' : 'block';
		}
	}

	let header_sub_div = document.createElement('DIV');
	toolbar.appendChild(header_sub_div);

	let label = document.createElement('DIV');
	label.innerHTML = 'FILTERS';
	label.style.borderRadius = '4px';
	label.style.textAlign = 'center';
	label.style.padding = '2px';
	label.style.margin = '2px 2px 10px';
	label.style.cursor = 'pointer';
	label.style.fontWeight = 'bold';
	label.style.background = 'white';
	label.attributes['fold'] = false;
	label.onclick = fold_filters;
	header_sub_div.appendChild(label);

	let tool_sub_div = document.createElement('DIV');
	tool_sub_div.className = 'filter_container';
	tool_sub_div.style.maxWidth = '100%';
	tool_sub_div.style.maxHeight = '30rem';
	tool_sub_div.style.overflowY = 'scroll';
	//tool_sub_div.style.scrollbarWidth = '4px';
	//tool_sub_div.style.scrollbarColor = 'rebeccapurple green;';

	toolbar.appendChild(tool_sub_div);

	document.body.appendChild(toolbar);

	return [header_sub_div, tool_sub_div];
}

function filter_cpus() {
	if (!/cpu/i.test(location.href)) {
		console.log('not cpu page');
		return;
	}
	if (document.querySelectorAll('ul.chartlist .prdname').length == 0) {
		return;
	}

	let [header, tools] = create_filter_toolbar();

	let all_cpu_map = {
		'.*': {}
	};

	let apple_cpu_map = {
	};

	let intel_cpu_map = {
		'Intel': {},
	};

	let amd_cpu_map = {
		'AMD': {},
	};

	gen_filter_map(all_cpu_map);
	let container = gen_filter_toolbar(header, all_cpu_map);
	gen_input_filter(container, all_cpu_map);

	gen_filter_keyword('(Apple)\\s+([a-zA-Z0-9]+)', apple_cpu_map);
	gen_filter_map(apple_cpu_map);
	gen_filter_toolbar(tools, apple_cpu_map);

	gen_filter_keyword('(Intel\\s+(?:[a-zA-Z]+\\s+)(?:[a-zA-Z][\\d-]|\\d|[a-zA-Z]{2,}))', intel_cpu_map);
	gen_filter_map(intel_cpu_map);
	gen_filter_toolbar(tools, intel_cpu_map);

	gen_filter_keyword('(AMD\\s+(?:[a-zA-Z]+\\s+)(?:[a-zA-Z][\\d-]|\\d|[a-zA-Z]{2,}))', amd_cpu_map);
	gen_filter_map(amd_cpu_map);
	gen_filter_toolbar(tools, amd_cpu_map);

	/*
  for (let k of Object.keys(cpu_map)) {
		console.log('k', k, cpu_map[k]);
	}
  */

}

function filter_gpus() {
	if (!/video/i.test(location.href)) {
		console.log('not gpu page');
		return;
	}
	if (document.querySelectorAll('ul.chartlist .prdname').length == 0) {
		return;
	}

	let [header, tools] = create_filter_toolbar();

	let all_gpu_map = {
		'.*': {}
	};

	let intel_gpu_map = {
	};

	//let apple_gpu_map = {
	//};

	let nvidia_gpu_map = {
	};

	let amd_gpu_map = {
	};

	gen_filter_map(all_gpu_map);
	let container = gen_filter_toolbar(header, all_gpu_map);
	gen_input_filter(container, all_gpu_map);

	gen_filter_keyword('((?:Intel)\\s+(?:[a-zA-Z]+\\s+)?(?:[a-zA-Z][\\d-]|\\d|[a-zA-Z]{2,}))', intel_gpu_map);
	gen_filter_map(intel_gpu_map);
	gen_filter_toolbar(tools, intel_gpu_map);

	gen_filter_keyword('((?:Nvidia|Geforce|TITAN|Quadro|Tesla)\\s+(?:[a-zA-Z]+\\s+)?(?:[a-zA-Z][\\d-]|\\d+(?=\\d\\d\\s)|[a-zA-Z]{2,}))', nvidia_gpu_map);
	gen_filter_map(nvidia_gpu_map);
	gen_filter_toolbar(tools, nvidia_gpu_map);

	gen_filter_keyword('(Apple)\\s+([a-zA-Z0-9]+)', apple_gpu_map);
	gen_filter_map(apple_gpu_map);
	gen_filter_toolbar(tools, apple_gpu_map);

	gen_filter_keyword('((?:AMD|Radeon|FirePro)\\s+(?:[a-zA-Z]+\\s+)?(?:[a-zA-Z][\\d-]|\\d|[a-zA-Z]{2,}))', amd_gpu_map);
	gen_filter_map(amd_gpu_map);
	gen_filter_toolbar(tools, amd_gpu_map);

	/*
	  for (let k of Object.keys(gpu_map)) {
			console.log('k', k, gpu_map[k]);
		}
	*/

}

function refine_layout(e) {
	let container = document.querySelector('#block_content > .container') || document.querySelector('.block_content > .container')
	let marginLeft = (container.parentNode.clientWidth - container.clientWidth) / 2 - 20;
	container.style.marginLeft = marginLeft + 'px';
}

try {
	refine_layout();
} catch (e) {
	console.log('refine_layout error', e);
}
window.addEventListener('resize', refine_layout);

filter_cpus();

filter_gpus();

console.log(`=== /cpu benchmark filter on '${location.href}' ===`);


/*
let intel_cpu_map = {
	'Atom': {},
	'Celeron': {},
	'Core\\s+i3': {},
	'Core\\s+i5': {},
	//'Core\\s+i7': {},
	//'Core\\s+i9': {},
	'Core': {},
	'Pentium': {},

	//'Xeon\\s+X': {},
	'Xeon\\s+D': {},
	'Xeon\\s+E3': {},
	'Xeon\\s+E5': {},
	'Xeon\\s+W': {},
	'Xeon\\s+Silver': {},
	'Xeon\\s+Gold': {},
	//'Xeon\\s+Platinum': {},

	'Xeon': {},
};

let amd_cpu_map = {
	'Athlon': {},

	'FX': {},

	'Opteron': {},

	'Ryzen\\s+3': {},
	'Ryzen\\s+5': {},
	'Ryzen\\s+7': {},

	'EPYC\\s+3': {},
	'EPYC\\s+7': {},
	'Threadripper': {},
};
*/
