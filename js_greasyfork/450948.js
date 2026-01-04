class Reader {
    constructor(document, id) {
        this.attachedDiv = document.createElement('div');
        this.attachedDiv.id = id;
        document.documentElement.appendChild(this.attachedDiv);
        GM_addStyle(`
            html.ythReaderHTML,html.ythReaderHTML body{overflow: hidden;}
            #${id}{z-index: 99999999999;position: fixed;left: 0;top: 0;}`);
        this.root = this.attachedDiv.attachShadow({ mode: 'open' });
        this.root.innerHTML = `
<style>
#readerWrap{}
#readerWin {
	position: fixed;
	width: 600px;
        max-width: 90%;
	height: 90vh;
	z-index: 999999;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin: auto;
}
#reader{
    box-shadow: 1px 1px 3px 3px #333;
    width:100%;
    height:100%;
    font-family: Inter,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
    display: flex;
    flex-flow: column;
    text-align: left;
}
#titleBar{
    font-size:12px;
    background-color: #7f7f7f;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #000;
}

#reader pre {
    font-family: inherit;
    padding:5px;
    font-size:16px;
    height:100%;
    background-color: #ccc;
    overflow-y: scroll;
    white-space: pre-wrap;
    word-wrap: break-word;
    margin: 0px;
}

#overlay {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(140,140,125,0.9);
    z-index: 1;
}
#buttons{
    float: right;
    margin: 0px 5px 0px 0px;
    height: 100%;
    display: flex;
    align-items: center;
    flex-shrink: 0;
}
button{
    margin: 0px 0px 0px 5px;
    border: 1px solid #3e7615;
    border-radius: 5px;
    background-color: #b3c2a0;
}
button:hover{
    background-color: #79c819;
}
#title{
    font-size: 18px;
    padding: 0px 0px 0px 10px;
    margin: 0px;
    float: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
input{
    padding: 0px;
    width: 19px;
    height: 18px;
    border-radius: 5px;
    border: 1px solid #3e7615;
}
#fontSize,#lineHeight{
    width: 30px;
    font-size: 12px;
}
</style>            
<div id="readerWrap">
    <div id="overlay"></div>
    <div id="readerWin">
        <div id="reader">
            <div id="titleBar">
                <span id="title">tt</span>
                <span id="buttons">
                大小<input type="number" min=12 max=50 id="fontSize" />
                行距<input type="number" min=12 max=99 id="lineHeight" />
                文字<input type="color" id="color" />
                背景<input type="color" id="backgroundColor" />
                <button id="btn1"></button>
                <button id="btn2"></button>
                <button id="closeBtn">✕</button>
                </span>
            </div>
            <pre></pre>
        </div>
    </div>
</div>
            `
        this.pre = this.root.querySelector('pre');
        this.title = this.root.getElementById('title');
        this.closeBtn = this.root.getElementById('closeBtn');
        this.btn1 = this.root.getElementById('btn1');
        this.btn2 = this.root.getElementById('btn2');
        this.fontSize = this.root.getElementById('fontSize');
        this.fontSize.addEventListener('input', (e) => {
            this.style.fontSize = e.target.value;
            this.pre.style.fontSize = this.style.fontSize + 'px';
            this.saveStyle();
        })
        this.lineHeight = this.root.getElementById('lineHeight');
        this.lineHeight.addEventListener('input', (e) => {
            this.style.lineHeight = e.target.value;
            this.pre.style.lineHeight = this.style.lineHeight + 'px';
            this.saveStyle();
        })
        this.color = this.root.getElementById('color');
        this.color.addEventListener('input', (e) => {
            this.pre.style.color = this.style.color = e.target.value;
            this.saveStyle();
        })
        this.backgroundColor = this.root.getElementById('backgroundColor');
        this.backgroundColor.addEventListener('input', (e) => {
            this.pre.style.backgroundColor = this.style.backgroundColor = e.target.value;
            this.saveStyle();
        })
        this.btn1.style.display = 'none';
        this.btn2.style.display = 'none';
        this.setVisible(false);
        this.closeBtn.addEventListener('click', () => {
            this.setVisible(false);
        })
        this.setStyle();
    }
    setStyle() {
        this.style = GM_getValue('ReaderStyle') || {
            fontSize: 12,
            lineHeight: 20,
            color: "#000000",
            backgroundColor: "#cccccc"
        };
        this.pre.style.fontSize = this.style.fontSize + 'px';
        this.pre.style.lineHeight = this.style.lineHeight + 'px';
        this.pre.style.color = this.style.color;
        this.pre.style.backgroundColor = this.style.backgroundColor;
        this.fontSize.value = this.style.fontSize;
        this.lineHeight.value = this.style.lineHeight;
        this.color.value = this.style.color;
        this.backgroundColor.value = this.style.backgroundColor;
    }
    saveStyle() {
        GM_setValue('ReaderStyle', this.style);
    }
    setVisible(visible) {
        this.visible = visible;
        if (visible) {
            this.attachedDiv.style.display = '';
            document.documentElement.classList.add("ythReaderHTML");
        } else {
            this.attachedDiv.style.display = 'none';
            document.documentElement.classList.remove("ythReaderHTML");
        }
    }
    setReader(text, title, btn1Name, btn1Func, btn2Name, btn2Func) {
        this.pre.textContent = text;
        this.title.textContent = title;
        this.title.title = title;
        this.btn1.style.display = 'none';
        this.btn1.style.display = 'none';
        if (btn1Name && btn1Func) {
            this.btn1.innerText = btn1Name;
            this.btn1.onclick = btn1Func;
            this.btn1.style.display = '';
        }
        if (btn2Name && btn2Func) {
            this.btn2.innerText = btn2Name;
            this.btn2.onclick = btn2Func;
            this.btn2.style.display = '';
        }
        this.setVisible(true);
        this.pre.scrollTo(0, 0);
        return this;
    }
}
