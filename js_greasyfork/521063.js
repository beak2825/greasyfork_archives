// ==UserScript==
// @name          Auto Page Loader
// @namespace     Beginner.2023.AutoPageLoader
// @version       1.0.3
// @description   A script for auto-loading gallery pages on SankakuComplex.
// @author        Beginner(2023)
// @match         *://chan.sankakucomplex.com/*
// @match         *://idol.sankakucomplex.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @homepage      https://greasyfork.org/en/scripts/521063-loading-page
// @license       MIT
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/521063/Auto%20Page%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/521063/Auto%20Page%20Loader.meta.js
// ==/UserScript==

(function() {


let stopLoading = false;
let Gallerycontent = document.querySelector('#post-list > div.content')
let Paginator = document.getElementById('paginator');
let pagination = document.querySelector("#paginator > div")

let limitReach = [
    'Browsing Limit Reached | Sankaku Channel',
    'Request limit exceeded'
]

function loadingPage(rawhtmlContent) {
		let parser = new DOMParser();
		let doc = parser.parseFromString(rawhtmlContent, "text/html");
    
		// GET SANKAKU PLUS
		if (limitReach.includes(doc.title)) { 
			alert("Next page: GET SANKAKU PLUS\nTo proceed to the next page, click the >> manual button.");
			stopLoading = true;
			return;
		}

		let imgCon = doc.querySelector("#post-list > div.content > div:nth-child(2)");
		let paginationDoc = doc.querySelector("#paginator > div")

		if (paginationDoc) {
			if (pagination) {
				Paginator.replaceChild(paginationDoc.cloneNode(true), Paginator.querySelector('div.pagination'))
			} else {
				Paginator.appendChild(paginationDoc.cloneNode(true))
			}
		}

		Gallerycontent.insertBefore(imgCon.cloneNode(true), Paginator);
}

const WorkerState = {
    isRunning: false,
    currentTask: null,
    cancelRequested: false,
};

async function fetchURLNextPage(array) {
    console.groupCollapsed('fetchURLNextPage');
    
    if (!Array.isArray(array)) {
        console.log("fetchURLNextPage got wrong type of parameter:", typeof array, array);
        console.groupEnd();
        return; 
    }

    console.log('array: ', array);
    let latest_urlList = array[array.length - 1];
    console.log('latest_urlList: ', latest_urlList);
    
    try {
        const response = await fetch(latest_urlList);
        console.log('response: ',response);
        if (response.redirected) {
            console.group('response is redirected')
            console.log(response)
            console.groupEnd();
        }
        
        if (response.status === 429) {
            console.log("Too many requests. Retrying after delay...");
            console.groupEnd();
            return null;
        }
        
        const rawHTMLContent = await response.text();
        if (rawHTMLContent) {
            console.log('rawHTMLContent: ', true);
            let urlNextpage = undefined;
            let parser = new DOMParser();
            let doc = parser.parseFromString(rawHTMLContent, "text/html");
            let curPage_element = doc.querySelector("#paginator > div > span");
            console.log('fetchDocumunet: ',doc);
            
            if (limitReach.includes(doc.title)) {
                console.groupEnd();
                return 'limitReached';
            }
            
            if (curPage_element.nextElementSibling === null) {
                urlNextpage = null;
            } else {
                urlNextpage = curPage_element.nextElementSibling.href;
            }

            console.log('nextPageURL: ',urlNextpage);
            console.groupEnd();
            let datapacker = {
                urlHTMLContent: response.url,
                rawHTMLContent: rawHTMLContent,
                nextURl: urlNextpage
            }

            return datapacker;
        } else {
            console.group('fetch Else');
            console.log({
                response,
                rawHTMLContent
            });
            console.groupEnd();
        }
    } catch (error) {
        console.error('Error fetching URL:', error);
    }
    
    console.log('fetch out try:', array);
    console.log('here????');
    console.groupEnd();
}

let workCode = `
let queue = [];
self.onmessage = function(e) {
    let eData = e.data;
    let queueID = eData.queueID
    let data = eData.data;

    // console.log('event: ', e);
    // console.log('eventData: ', e.data);
    // console.log('data: ', data);
    
    if (queue.length>0) {
        if (queue[queue.length-1].queueID !== queueID) {
            console.groupEnd();
            return;
        }
    }

    queue.push(eData);
    self.postMessage(queue);
    queue = [];
};
`;

function createWorker(workCode) {
    let newBlob = new Blob([workCode], { type: "application/javascript" });
    let blobURL = URL.createObjectURL(newBlob)
    return new Worker(blobURL);
}
const worker = createWorker(workCode);
worker.onmessage = function(e) {
    const eData = e.data;
    if (eData.length > 0){
        for (let i = 0; i < eData.length; i++) {
            let data = eData[i].data;
            for (let i = 0; i < data.length; i++) {
                window.history.pushState({}, '', data[i].urlHTMLContent)
                loadingPage(data[i].rawHTMLContent);
            }
        }
        
    }
}

async function manager_loading_page(value_page) {
    console.groupCollapsed('AutoPageLoader Script')
	let curPage_element = document.querySelector("#paginator > div > span");
    let curPage_number = parseInt(curPage_element.innerText.trim());
    let nextPage_element = curPage_element.nextElementSibling;
    
	let [method, num] = value_page.split('_');
	let number = parseInt(num);
	let limit = 100;
	let combinedPages = curPage_number + number;
    const queueID = Date.now().toString();
	stopLoading = false;

	if (combinedPages > limit) {
		number = limit+=1 - curPage_number;
	}
	if (method == 'TO') {
		number = number - curPage_number;
	}
    if (stopLoading) {
        return;
    }
    
    let urlList = [nextPage_element.href]
    let datapck =  [];
    let isTooManyRequests = false;
    let isReachedLimit = false;

    console.group('manager_loading_page: ', number)
    for (let i = 0; i < number; i++) {
        let round = i+1;
        const stringPadding = [
            45,
            '-'
        ]
        console.groupCollapsed('MLP-'+ round +' ('+ i +')');
        console.log('MLP '+ round +': starting'.padEnd(stringPadding[0],stringPadding[1]))
    
        while (isTooManyRequests) {
            console.log("Waiting due to Too Many Requests...");
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        if (isReachedLimit) {
            console.log(">> Limit reached. Stopping.");
            console.groupEnd();
            break;
        }
    
        let fdata = await fetchURLNextPage(urlList)
        console.log('fetchURLNextPage Return: ',fdata);
        if (fdata == null) {
            isTooManyRequests = true;
            await new Promise(resolve => setTimeout(resolve, 2000));
            isTooManyRequests = false;
            i--; 
            continue;
        } else if (fdata === 'limitReached') {
            isReachedLimit = true;            
			alert("Next page: GET SANKAKU PLUS\nTo proceed to the next page, click the >> manual button.");
            console.log('>> limit Reached');
            console.groupEnd();
            continue;
        }

        if (fdata.nextURl !== null) {urlList.push(fdata.nextURl);}
        datapck.push(fdata);
        console.log('datapck: ',datapck);

        console.log('MLP '+ round +': end'.padEnd(stringPadding[0],stringPadding[1]))
        console.groupEnd();

        if (i%3 === 0 || i === number-1 || fdata.nextURl === null) {
            console.log('POP!!')
            worker.postMessage({
                queueID: queueID,
                data: datapck});
            datapck = []
            if (fdata.nextURl === null) {break;}
        }
    };
    console.groupEnd();
    console.groupEnd();
    
}

function createButton(label, classname, value_page) {
	let button = document.createElement('button');
	button.innerHTML = label;
	button.className = classname;
	button.setAttribute('type', 'button');

	button.addEventListener('click', () => {
		manager_loading_page(value_page);
	});

	return button;
}

function injectStyles() {
	const styleSheet = document.createElement("style");
	styleSheet.setAttribute("type", "text/css");
	styleSheet.textContent = `
	#LoadingPage {
		margin: 3px 1em 3px 0;
		padding: 7px;
		border: 1px solid #ccc;
		background-color: transparent;
	}
	#LoadingPage div {
		display: flex;
		gap: 2px;
		margin-bottom: 7px;
		// border-bottom: 2px solid #222;
		padding-bottom: 3px;
	}
	#LoadingPage > div > button.LoadingPage_submit_add  {
			padding: 0 10px;
			margin: 0;
	}
	#LoadingPage > div > button.LoadingPage_submit_to  {
			padding: 0px 8px;
			margin: 0;
	}
	#LoadingPage button {
		padding: 5px 10px;
		font-size: 14px;
		background-color: var(--sankaku-orange);
		color: #fff;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		margin-bottom: 2px;
	}
	#LoadingPage button:hover {
		background-color: #ff9b30;
	}
	#LoadingPage input {
		width: 100%;
		margin: 0;
		padding: 4px;
		font-size: 14px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
`;
	document.head.appendChild(styleSheet);
}


function setup_widget() {
	// create parent element
	let sidebar = document.querySelector("#sticky > div")
	let mainParent = document.createElement("div");
	mainParent.setAttribute('id','LoadingPage');
	mainParent.className = 'LoadingPage';

	// create input section
	let inputSection = document.createElement('div')
	let input = document.createElement('input')
	// input.innerHTML = 'sumbit'
	input.setAttribute('type', 'number')
	input.className = 'LoadingPage_input';

	let submit_add = document.createElement('button')
	submit_add.innerHTML = '+'
	submit_add.setAttribute('type', 'submit')
	submit_add.className = 'LoadingPage_submit_add';
	submit_add.addEventListener('click', () => {
		let inputForm = document.querySelector("#LoadingPage > div > input")

		if (inputForm.value != '') {
			manager_loading_page('ADD_'+inputForm.value);
			inputForm.value = null;
		}
	});

	let submit_to = document.createElement('button')
	submit_to.innerHTML = 'to'
	submit_to.setAttribute('type', 'submit')
	submit_to.className = 'LoadingPage_submit_to';
	submit_to.addEventListener('click', () => {
		let inputForm = document.querySelector("#LoadingPage > div > input")

		if (inputForm.value != '') {
			manager_loading_page('TO_'+inputForm.value);
			inputForm.value = null;
		}
	});

	inputSection.append(input, submit_add, submit_to);
	mainParent.append(inputSection);

	let five_page = createButton('+5', 'loading_add_5_page', 'ADD_5')
	let ten_page = createButton('+10', 'loading_add_10_page', 'ADD_10')
	let limit_page = createButton('to limit', 'loading_to_limit_page', 'TO_100')
	mainParent.append(five_page, ten_page, limit_page);

	// add element to sidebar
	sidebar.append(mainParent);
	injectStyles();
}

window.onload = function() {
    setTimeout(setup_widget, 300);
}

// setup_widget()
// clear();

})();