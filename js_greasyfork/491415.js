document.addEventListener('DOMContentLoaded', function () {
    function createElementHome() {
        var homeElement = document.createElement('section');

        homeElement.classList.add('bodyHome');

        homeElement.setAttribute('id', 'bodyHome');

        homeElement.innerHTML = `
    <div class="CT HTC" id="CT">
        <video id="CTVideo" class="BackgroundVideo HTC" style="z-index: -1;"><source src="../static/videos/BGS.mp4" type="video/mp4"></video>
        <table>
            <tr id="CTHeader" class="HeaderIndex HTC"><td class="HeaderIndex Content HTC"> THE TAX LABYRINTH </td></tr>
            <tr id="CTText" class="TextIndex HTC"><td class="TextIndex Content HTC">Are you ready to rewrite your financial history and unlock the potential for greater impact? Let's embark on a journey that transcends numbers and transforms lives like yours and others. Imagine this: you're navigating the labyrinth of tax brackets, inching closer to the edge of a higher tax rate. The looming specter of increased taxation threatens to erode your hard-earned income. But fear not, for there's a beacon of hope amidst the fiscal maze.</td></tr>
        </table>
    </div>
    <form class="Containers Home" id="Home">
        <table id="TC" class="FEDORA TC">
            <tbody>
                <tr id="TextTC" class="T TC">
                    <td class="Text TC">Maybe if you take 2024 tax rates and compare</td>
                </tr>
            </tbody>
        </table>
        <table id="LC" class="Containers Container LC" onclick="LC()">
            <tbody>
                <tr id="HeaderLC" class="H LC">
                    <td class="Header LC">Canada :</td>
                </tr>
                <tr id="TextLC" class="T LC">
                    <td class="Text LC 1">15% for incomes over $15,705,00</td>
                    <td class="Text LC 2">20.5% for incomes over $53,359.01</td>
                    <td class="Text LC 3">26% for incomes over $106,717.01</td>
                    <td class="Text LC 4">29% for incomes over $165,430.01</td>
                    <td class="Text LC 5">33% for incomes over $235,675.01</td>
                </tr>
            </tbody>
        </table>
        <table class="Containers Container C">
            <tbody>
                <tr id="TexTC" class="T C">
                    <td class="Text C">It's easy to find all these information through a simple Google research. Just type: inflation adjustments for tax with the year, the desired country and here you go!</td>
                </tr>
            </tbody>
        </table>
        <div id="L" class="Containers IMGContainer L">
            <img src="../static/pictures/HomeLeft.jpg" height="26vw" width="32vw" alt="IMGL" class="IMG L" id="IMGL"></img>
        </div>
        <table id="RC" class="Containers Container RC" onclick="RC()">
            <tbody>
                <tr id="HeaderRC" class="H RC">
                    <td class="Header RC">U.S.A. :</td>
                </tr>
                <tr class="Text RC">
                    <td class="Text RC 1">12% for incomes over $11,600.00</td>
                    <td class="Text RC 2">22% for incomes over $47,150.00</td>
                    <td class="Text RC 3">24% for incomes over $100,525.00</td>
                    <td class="Text RC 4">32% for incomes over $191,950.00</td>
                    <td class="Text RC 5">35% for incomes over $243,725.00</td>
                </tr>
            </tbody>
        </table>
        <div id="R" class="Containers IMGContainer R">
            <img src="../static/pictures/HomeRight.jpg" height="26" width="32vw" alt="IMGR" class="IMG R" id="IMGR"></img>
        </div>
        <table id="CB" class="Containers Container CB" onclick="CB()">
            <tbody>
                <tr id="HeaderCB" class="H CB" onclick="toggleLogin()" onabort="toggleRegister()">
                    <td class="Header CB">Donate with ease</td>
                </tr>
                <tr id="TextCB" class="T CB">
                    <td class="Text CB hover-effect">Now that we've got a little bit more into it, most of you already have their mindset and knows what they are gonna do out of that fructifiable knowledge. If you don't already have yourself to understand properly think about this : Let's say you made a little bit over $106,717.01, so you are gonna pay 26% tax in Canada but, if instead you find a way to save 5,5% in tax just by lowering your income to 106,717.00 with a simple donation. By giving a certain amount to any foundation, the given amount is reduced from your income. With plenty others benefits from giving, you might save money depending on your yearly incoming taxable amount. The website has just been launched, and we've uncovered an intriguing strategy that could potentially save you money. Did you know that you can make donations using undeclared income? By directing your gift through the bank, you could potentially reduce your taxable income without spending declared earnings. It's a clever way to maximize your impact while also benefiting from potential tax savings. Imagine the possibilities when your financial decisions align with your desire to make a difference.</td>
                </tr>
            </tbody>
        </table>
    </form>
        `;

        document.body.appendChild(homeElement);
    }

    createElementHome();
});