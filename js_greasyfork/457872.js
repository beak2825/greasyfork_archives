// ==UserScript==
// @name         2011 - memories
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  DM me on Discord for any suggestions or early-updates, lol - yoshi.#0069
// @author       melo, edited by yoshi :))
// @match        *://*.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457872/2011%20-%20memories.user.js
// @updateURL https://update.greasyfork.org/scripts/457872/2011%20-%20memories.meta.js
// ==/UserScript==

function GetCurrentUser() {
    let UserElement = document.getElementsByName("user-data")[0];
    if (UserElement) {
        return UserElement.getAttribute("data-name");
    }

    return "N/A";
}

(function() {

document.querySelector('link[rel="icon"]').href= 'data:image/x-icon;base64,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+P8AAPj/AAD4/wAA+f8AAP3/AAD+/wAA//8HBP//Dwr//xYR9v8tIe//RTPo/0Qz495INePGb1HazLaHwa7/xLMaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//1UM//eZGc6bu2+MZs/UYEbn/6B2yfv//5kM/92iHnRW1+sAAP3/ISH5/93d/v//////+vr///Dw///g4P7/wsL9/6Sk/P98e/v/WFj6/zw8+f8gIPn/EA/4/wQE+P8AAPj/AAD5/wAA+/8AAP3/AAD9/wAA//8AAP//VT/1/8KQvb3//0gGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAD/92iJ/OzriiugMQruYbAdYhj05B5WdTcVD7h8DEl9v8DAv//AAD//4Bf0K///wACw5DAlSYb9/8AAPn/h4f8//////////////////////////////////////////////////n5///m5v7/09L+/76+/f+lpf3/d3f7/xMT+P8AAPj/AAD4/wEB/v9YQuH90Zu9cv//VQwAAAAAAAAAAAAAAAAAAAAAAAAAAKp/yCGCYNN8i2bRonpb0p9qTti3a07X9Ecz4/UrHur2Ihf4/w0H//8AAP//AAD//wAA/P8AAPn/Ixr7/7GCxHj//3cLb1HW8QAA/P8uLvn/5+f+///////////////////////////////////////////////////////////////////////5+f//YGD7/wQE+P8AAPn/BAP+/15G3vnRnbdq/9GiNgAAAAAAAAAAAAAAAAAAAAAAAAAA/9GqJ3JU1vsAAP7/AAD5/wUG+f86O/r/c3P7/6Oj/P++vv3/2Nj+/+np/v//////i4v8/wEB9/8AAPz/cVTW5v//iB9tUNjeAAD+/zMy+v/s7P//////////////////////////////////////////////////////////////////+fn//1tb+v8AAPj/AAD6/xEN/P+BX9Pz7LWuUv//Zg0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8iuJWNJ2vMAAPz/AAD4/zc3+v/q6v7////////////////////////////8/P//Skr6/wAA+P8UD/7/nXPKjNedt3UoHff/AQH6/5+f/f/////////////////////////////////////////////////////////////////8/P//cHD6/wAA+P8AAPz/KB78/592zOz/yqZFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8iuJWNJ2/MAAPz/AAD4/01N+v/+/v/////////////////////////////R0f7/GBj5/wAA+v89Lez/9bWueHdX1N8AAP3/ODj6//T0/v////////////////////////////////////////////////////////////Pz//9ra/v/AAD5/wAA//9DMu7/r4DGpf/imTIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8ymJW1R2PMAAPz/AAD4/1VV+v/9/f////////////////////////////+fn/z/AQH4/wAA/P9yVNbn4qS1byQZ8fsAAPr/oaH8////////////////////////////////////////////////////////////39/+/1RU+v8AAPn/CQb//1c/4eXRm7mEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9WmJXFT1vMAAPz/AAD4/2Vl+//+/v////////////////////////////9tbfv/AAD4/xQP+f+4iMG2iGTPzgAA/v86Ovn/9PT////////////////////////////////////////////////////////Kyv3/NTX5/wAA+/8cFfz/eVrU1eKqqi0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8imJWdN2fMAAPz/AAD4/3l5+/////////////////////////////Ly//89Pfn/AAD6/0Aw5vbhp7WzNyfq/AAA+/+pqf3//////////////////////////////////////////////////////7e3/f8hIfn/AAD8/zYn/P+id8jL/+adIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/7uzJV5G3PMAAPz/AAD4/5OT/P///////////////////////////8rK/f8SE/n/AAD6/41ozeKWbsvABAL7/zg4+v/4+P//////////////////////////////////////////////////paX9/xMU+f8AAP3/OCnt/7GDxpT//4gYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6q6zJVhB3vMAAPz/BQX4/6qq/P///////////////////////////5OS/P8AAPn/IRjw/82Xu9xFMuP5AAD7/6en/P////////////////////////////////////////////z8//+Ojvz/Bgf6/wAA//9VPu3/z5i6rgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4q6zJVQ+4PMAAPz/Dw/4/76+/f//////////////////////+/v//1RU+/8AAPr/ZEra/8KQw/8IBvb/Kiv6//T0////////////////////////////////////////9PT//3d3+/8AAPr/DAj8/2BH3+7Tm7mW//+IDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1Z27JU054vMAAPz/GRn5/87O/f//////////////////////3Nz+/yQj+f8DAvb/qXzG/2hM2P8AAPr/kJD8///////////////////////////////////////q6v//Y2P6/wAA+v8UDvv/hGDS5PG1rkUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzJm7JUk24/MAAPz/JCX5/93d/v//////////////////////tbT9/wcH+f8rH+v/r4HE/xcQ8P8eH/r/5ub//////////////////////////////////+vr/v9WV/r/AAD8/yIY+/+Yb8ve+7uqOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyJHAJUQy5fMAAPv/NjX5/+7u/v//////////////////////hYX7/wAA+f9pTdj/eVrU/wAA+f94ePv/////////////////////////////////5+f+/05O+v8AAPv/IBby/5Bqzsf/zJ0qAAAAAAAAAAAAAAAAAAAAAAAAAAD//4EF/+WeBdqeswUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqoDEHz0t5vIAAPv/R0f6//n5///////////////////4+P7/UlL6/wAA9/9POuH/HhXt/xka+v/X1/7////////////////////////////g4P7/Rkb6/wAA+P8+Lej9l27MeAAAAAAAAAAAAAAAAIplzCpmS9cqWkLbKn9qxT6Vc8hidFfUY1Y+3GJlTNuJZUzbif/CrGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyJW5QTws5/gAAPv/VVX7//z8///////////////////X1/7/GRn5/wAA9/8AAPj/AAD5/4eH/P/+/v///////////////////////87O/v89Pfn/AAD4/yQa8P+QaszmmW7GV7KCxIGxgsWneVnUpllC3aZOOuGjVkDgxlxE3fhBMeX3LiLq9icd8v8ZEvv/AAD3/2VM24n/wqxlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1Z25kT0t8P8AAPn/aGj7///////////////////////i4v7/ZWX7/0pK+v9PT/v/eHj8/+7u/v//////////////////////3d3+/y0t+f8AAPf/AAD3/wAA9P8EAfL7CALy+hoP+P8ZD/3/CAL//wAA//8AAP//AAD//wAA//8AAP//AAD+/wAA/P8AAPj/AAD3/wAA+P9lTNuJ/8KsZQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwY29ky0h9f8AAPn/fX37//////////////////////////////////v7///7+///////////////////////////////////09P+/2Zm+/9cXPv/WVn6/1BQ+v9ERfz/Pj/+/zk7/f82OPz/Nzj6/zc4+v83OPr/ODn6/zw9+v8/P/r/RUX6/1JS+v81Nfr/AAD4/wAA9/8SEvj/ZUzbif/CrGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsILDkSQb9/8AAPn/lJT8///////////////////////////////////////////////////////////////////////////////////////////////////////8/P//+vr///n5///4+P//9/f///f3///39///9/f///j4///5+f//+/v////////r6/7/WFj6/wAA+P8AAPf/Cwv4/1ZA4Mb/wqxlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlG3MkRUP+/8ICfn/t7f9//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Hx//9bW/r/AQH4/wAA9/8zM/n//8KsZQAAAAAAAAAAAAAAAAAAAAAAAAAAhGLRjxEM/P8ICfn/tLT9///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////d3f7/Hh75/wAA9/83Nvn/26C3bgAAAAAAAAAAAAAAAAAAAAD/qqoCelzTlgwJ/f8NDfn/vb39////////////////////////////5OT+/5KS/P+fn/z/x8f+//Hx/v/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////IyP3/FBP4/wAA+v8+Lu3/26C3bgAAAAAAAAAAAAAAAAAAAAD/3aIcl2/K6AEB+f8VFvn/y8v9////////////////////////////fX37/wAA+P8AAPv/Bgf7/ygp+v9aWvv/lZX9/8DA/f/n5/7//Pz///////////////////////////////////////////////////////////////////////////////////////////////////////+Jifz/AAD3/wAA+v9xVNz+/8KsZQAAAAAAAAAAAAAAAAAAAAD/1aYghGLQ9QAA+v8fH/n/2dn+///////////////////////9/f//Tk/7/wQC9f82J+3/JRr1/wwG//8AAP//AAD9/wAA+/8dHvr/RUb7/4CA/f+2tv3/3Nz+//////////////////////////////////////////////////////////////////////////////////f3//9ISPr/AAD4/yUb8v/Ol7zM//+RBgAAAAAAAAAAAAAAAAAAAAD/zKIfcVLW8gAA+/8pKfn/4+P+///////////////////////7+///R0j8/xoR7/mXbspxqoDEfIpm0rlsTtjaVj7g/jYn7v8hFvz/CQT//wIA/v8EBPj/Pj76/+jo/v///////////////////////////////////////////////////////////////////////////9fX/v8WFvn/AAD4/1lB5f/srLN2AAAAAAAAAAAAAAAAAAAAAAAAAAD/xKofbVDX8gAA+/81Nfn/7Oz+///////////////////////6+v//QkL9/yIY6vVEM90aAAAAAAAAAAD/7pke87OzQMiVvXS2hsene1vVomhM2dEMBvX/FRX5/9PT/v///////////////////////////////////////////////////////////////////////////5qa/P8AAPj/AAD4/39d2v//wqptAAAAAAAAAAAAAAAAAAAAAAAAAAD/xKofZ0zZ8gAA+/88PPn/8PD+///////////////////////6+v//Pz/8/yEW8fqugMRcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANGZvUEVDfL4ERH7/8PD/f///////////////////////////////////////////////////////////////////////Pz//1lZ+/8AAPj/AAD4/5Rtzez/1ZkmAAAAAAAAAAAAAAAAAAAAAAAAAAD/u6ofW0Lc8gAA/P9AQPn/8vL+///////////////////////6+v//PD37/yMZ9v/SnLud//+AFP//mR7//5Ee//eRHf/AriXTm7l4mnDMjXpZ1OAWEPD+AwP5/7Cw/f//////////////////////////////////////////////////////////////////////7Oz//ygo+f8AAPj/AAD4/86XvMz//5EGAAAAAAAAAAAAAAAAAAAAAAAAAADmqrMfSzfh8gAA/P9PT/r/+Pj////////////////////////7+///SEn7/yMZ7v+YcMranHXJ4YJf0/KEYdDybU/Y8Uk24vU9LPf/Fg7//wAA/f8AAPf/KSn5/8nJ/f//////////////////////////////////////////////////////////////////////vLz9/wcH+P8AAPj/f13a///Cqm0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACzgMQfOivm8gAA/P9dXfv//f3////////////////////////8/P//W1v7/wAA9f8GAvn/AAD9/wAA/v8AAP7/AAD//wAA//8AA/v/GRr6/zEy+v9sbPv/1NT+//39////////////////////////////////////////////////////////////////////////eHf7/wAA+P8GBfb/lG3N7P/VmSYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzKu4XIRft8QAA+/9sbPv////////////////////////////9/f//fX38/xob+f8qK/r/REX7/1lZ+/9vb/z/i4v8/6Gh/P+3t/3/1dX+/+vr/v/////////////////////////////////////////////////////////////////////////////////39///PDz5/wAA+P8lHO7/zpe8zP//kQYAAAAAAAAAAAAAAAAAAAAAAAAAAP//iAuxgsROHRX0+AAA+v99ffz/////////////////////////////////7e3//9zc/v/q6v7/+Pj////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////W1v7/ERH4/wAA+f9TPuD87KyzdgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/3kR2vg8SSGxP8/wAA+f+UlPz///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+bm/3/AAD4/wMC+/9+XtHa/8KqbQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPe7sxp0V9SKDgr+/wUG+P+qqvz///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9aWvv/AAD5/xUP9/+yhMO6/8iiLwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMSIxB1bQ9yMCQb//xAQ+P9sbPv//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+vr/v8hIfj/AAD6/z4u7f/boLduAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANefuW2AXdLYAAD8/xUV+f8rLf7/Njj+/1VW/v91dv3/mpv+/7m5/v/W1/7/6ur//+fn/v/4+P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7a2/f8DA/j/AAD6/3FU3P7/wqxlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMSOu0uofMWvkmvb/2NJ2vlWPdz+MiHl3ywd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+wCAX9aPBgL3/52e/Pz///7++/v9///////////////////////7+////f3+//7+/v/9/f////////7+/v/8/P/++fr//Pf4/vz29/38+Pj+/Pj4/v34+P3+/v7+/uvr/f5ycvr8GRr5/x4W8fKNctGPinPJDl1J2wEQC/wFCAT/AF9G4IoDAvn/sLD8+//////7+/7+/v7+/v////////7+/////v////7////+/f3+//39/v7+/v7+/v7//////v7///7+//////////7////////////////////////+/v////+8vPz7AAD5/zQv8/3/0qYz//+DAA0K+wIAAP4BZUvapwIB+f+3t/v8//////r6/v//////sbH8/11e+/+Gh/z/wcP9/Onq/vv///38///+/f////7///7//v7+/v7+///+/v///v7+//7+/v/+/v7//v7+//7+///7+/3++/v+/ri3+/0AAPn+TDnm9P//ijP//2cAAAD/AAAA/wdtUdXbBAX4/8rK/P3/////+/v+/v////5JSfn/CQHw/RcN9f8PC/r/KCb6/0FD/f90d///s7P+/+jo/f/+/v///v7+/v7+/v/////////////////+/v///v7+//z8/v/////+aGj6/AMA9v6ZcM7DGhn0DFtF3wJRT7UAAAD/CFY+3NYOD/r/2dn9/P/////9/f79////+0hG+P8vHeCOa0/QVI1ty5JaPtrDPinp5CIV8esEAPT8ZWX6/////v78/P3//v7+/////////////////////v/9/f7////+//Lx/f8hI/r7KRvs/tedvn15VeAAYkfiBP//AQAAAAAHUDre1hYW+f/h4fz9//////39/v7///77RUL5/zci4YsAAPkADBP4AP//jwD//3Ya/8ynMiYW6NA9Pvv//Pz9/P7+/v79/f7//////////////////v7///v7/v/+/v/+wsH8/gAB/P0/LeT/78GqUdunuACZcc0D//8BAAAAAAhBLeLXHBz6/+fn/f3//////f3+/v///v1CQvv/dlTV0sGSxGqQdsl0eFvObW9P3pBNNubBDQTt9zY3+f/39/7+/////v39/f/////////////////9/f7/+/v9/////v+IiPr8AAD5/nhZ1uD//34W//+CAM+YugGPZpcA+8atBSYZ6NUpKfv/8fH+/f7+///8/P7//////kpK+f8HAe77KBzt/yIX8f8iGvP/GBb5/yAh/f9RUvv/xMT8//7+/v/9/f7//v7+//////////////////39/f/+/v7/+/v9/j9B+/sQCu//uYvDmEsc9QAuBv4B1p23ABkA/wD//5QPEAjw2jQ0+v/4+P38//////z8/v////7/oqL8/2Vn/P+KjP/8oaP/+7m7/vvR0v387u78/f///v7//////v7+/v7+/v7+/v/////////////+/v7//Pz+///////g4P39CQv6/T8u5Pviq7NX1J65AMuTvQLOl7wAWgD8ANaqtk8XDfP2R0n7/v7+/f39/f7++/v9//39/v7////////+/v///v7////+///+/v////7//////////v39/v///////////////v///////v7////////7+/3//v7//qen/P0AAPr/a1HY4f//aS///xoA/8inAQAAAAADAPcAi2nQTQIA+fRKTPv7///++v////v///38///+/v///v7///7////+/v39///7+///+vr+//v7///7+/7/+/z+//39/v/9/v7//v7+//7+/v/+/v7//v7+//v7/v////7/X2D6/AQC9/6Vbs+fJhv4CS8i8gD/AAAAAAAAAAAA+hedc8iXIhjy/yYj9v9bWfr/dXT8/5SV//+4uv//0tP//9ze//zx8v/8/f79/P///vz///79///+/f////3///7+/////v///v7////+/////v39///8/P3+/f3//uvq/P4cHvv8LB7r/9aouGuGZ9UAbVHcAuysswAAAAAAAAD6CLiHvkewiMetfmDOq0ky1Iw9JuKyNCPs0y4i7e8rI/H8JR/1/y0r+v9IRv7/ZWX+/3+B//+Ljf//oqT//7S2/v/T1P//7e7//v3+//v////7///9/P///P7///3+i4r5/QAA+f97W9jh//+FG///fQDmqLQBAAAAAAAAAAAAAPkAuIe/AP//AAAAAP8AAAD/AAAA/wD/4oMSfBH0IppyvkNqSNNlRi7cdUsy3qcmFOasOyfh3ScY6OYaEO7pJBr1/ich+f0yL/r/RED4/0hI/P9OTv3/TE79/1RX/f8YG/r7BAP1/p11zbwAAP8GAAD/AP2/qwAAAAAAAAAAAAAAAAC1hcAC//8AAP//AAAAAP8C//8AAP23nACBhKoAPCLVACEO5QAAAPgAAAD/AAAA/wD//3kU//uTGNSZsyCoe8NPblLMT0g21WA3Id6PNiLjpSoa7scpG+vlJhjr+RwT9fo6KvH/uoy+i29C4QBvROEB/8ulAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAgAAAAAAAAACiWPNBP8A/wU3JuMFJhntBgoE9wUIBP8EDAr+Av//bgD/44gAw4SvAJluxQAAAP8AAAD/ABgI5gAdFv8A//9iLOazr2yyhcGYhmLXup113czorbFV/+KZAP/ykgIAAAAAAAAAAAAAAAD//z////8D///+AA//9gAB/wQAA+AEAAfgAAAf4AAAP+AAAH/gAAD/4AAD/+AAB//gAA//4AAf/8AAAA/AAAAHwAAAA8AAAAPAAAADwAAAA8AgAAPAPgAHwAAAB8AAAAfAAAAPwAAAD8AAAA+AAAAPwAAAH/+AAB///8Af///8PygAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAA7KeYAY0vbAVxE3QWAT80Hw3q9BwAA/wCqfb4A3KWwBl1C38VdP9Zy/+2eEv//TAAAAPUAKB3wAEYy5gD/5p0AUjrgAGlQ2QA7K+cAjlbIALJsvwBwVdIIbFPZHlM73FIgHvj/Kyr5/xYS9vAjFu3RHxPtpDMm7X1IN+No/8ioLGhN2wB7XtYUSDTgTWBL4mx0WuiTQTbs2FI83544LOzEysr+/vz9/vrT1P3/wsP+/3J0/f8TDvb/PC3qvDYl7SIiEOYASjLbbTIu9f/d3P3/6+3//z48+f00Hd+5kpP8//////37+v7+////+b/B//9DOfDqYU7aWVE95QBMN+cAEAHlADwl22tGRPf9////9dHT//s1JuflVUfr6uvt//7///79////+5WW/f83KOnTPSTiKl1G3wBTPuABAAD/AQEA6QAmEuBsWFb4/v39/vmfn/z+OSLc96Ce+v3///7+/////oSE/P9CLeO5ak/XDEUv5wCygsQCQjLmAXhb0gAAAOwAEgPkanJx+f/////6VU7y/Tgq6P/p7P/+9PX+/HNw+Po+ItuSMiHhCGxcxRc4JeMs/9mwB0w54gBMOeIBAADzAC8a4YeIh/r/////+nl5+f6nqPz9///+/o6P/P8lIPH2WUnrvTMu9tM7NvTtJiP2+jUl4qYuJO0IKh/uAgAA+wAhEeqSmZn8//////n///////////////z///79+Pn//+fp///o6P7/7u///+Pk//1maPv/OSznsg4L+wAAAP4AKRvmq6Wm/P/////7bm35+VRP9vqMifv/vb7+//z8/v7///78///+/f7+/f7////6lpb8/DQh5MQCAPcAAAD/AC8h57m3t/z//////11V8tjHs90qNCDZXgwA6LuYmPz+/v7//Pn5/f79/f7+/v7++UtI9v9fPNN0US/VAAME/gAfFu60v7/9/v7+/vtZVPT4QDHiw0lB8MJNSPTqxcX8/v7+/v76+v7+///+/ePl//01K+371KWmLduvmQAAAP8LHhn1ydrb//7////45+j++9vc///s7f////////////z+/v799/f9/vv7//ykpv7/MyLkzk1U2gEDB/YB/+mUQUIz6eB+evb7qKX6/7++/P/R0f7/5+f//+7v///3+P///////////v/////7Y2H4/00w2YMKAvIAMSPvBt2ixgvjtq4oKQTEKUIe50YjE+VuPy7njk9D7K5US/DFYlv31Xd0+OSDgPn0dXX7/C8l7/25h705nnHGAIRh1QPurr4As4zBABgAzwApGeQAFAvvAAAA/wAeMf8AJJn/AAAAAAwAAMQuMQ/TfB8K4NQxD9N8/8uoGOCpuQDDkL0B/z8AAP8BAADgAQAAgAcAAIAPAACAHwAAgD8AAIADAACAAQAAgAEAAIYBAACAAwAAgAMAAIADAADwBwAA/8cAAA=='


    // CONTAINER

    var legacyMasterContainer = document.getElementById("wrap")
    var container = document.createElement("div")
    container.id = "Container"
    legacyMasterContainer.appendChild(container)

    // HEADER


    var HeaderContainer = document.createElement("div")
    HeaderContainer.id = "HeaderContainer"
    container.appendChild(HeaderContainer)

    var Header = document.createElement("div")
    Header.id = "Header"
    HeaderContainer.appendChild(Header)

    var Banner = document.createElement("div")
    Banner.id = "Banner"
    Header.appendChild(Banner)

    var Navigation = document.createElement("div")
    Navigation.className = "Navigation"
    Header.appendChild(Navigation)

    var navButtons = document.createElement("ul")
    navButtons.id = "ctl00_Menu_MenuUL"
    Navigation.appendChild(navButtons)

    // EXTRA HEADER STUFF

    var AdvertisingLeaderboard = document.createElement("div")
    AdvertisingLeaderboard.id = "AdvertisingLeaderboard"
    HeaderContainer.appendChild(AdvertisingLeaderboard)

    var AdPanel = document.createElement("div")
    AdPanel.id = "ctl00_cphBannerAd_BannerAds_OutsideAdPanel"
    AdPanel.className = "AdPanel"
    AdvertisingLeaderboard.appendChild(AdPanel)

    var Ad = document.createElement("iframe")
    Ad.id = "ctl00_cphBannerAd_BannerAds_AsyncAdIFrame"
    Ad.src = "/user-sponsorship/1"
    Ad.scrolling = "no"
    Ad.width = "728"
    Ad.height = "90"
    Ad.style = "border: none;"
    AdPanel.appendChild(Ad)

    var Logo = document.createElement("a")
    Logo.id = "Logo"
    Logo.href = "/Default.aspx"
    Banner.appendChild(Logo)

    var Optionz = document.createElement("div")
    Optionz.id = "Options"
    Banner.appendChild(Optionz)

    var Authentication = document.createElement("div")
    Authentication.id = "Authentication"
    Optionz.appendChild(Authentication)

    var AuthenticationBannerSpan = document.createElement("span")
    AuthenticationBannerSpan.id = "AuthenticationBannerSpan"
    Authentication.appendChild(AuthenticationBannerSpan)

        var Namey = document.createElement("span")
        Namey.id = "ctl00_ctl00_BannerOptionsLoginView_BannerOptions_Authenticated_lnLoginName"

    if(GetCurrentUser() === "N/A")
    {
        Namey.innerHTML = "You're logged out!"
        AuthenticationBannerSpan.appendChild(Namey)

        var LogIn = document.createElement("a")
        LogIn.id = "ctl00_ctl00_BannerOptionsLoginView_BannerOptions_Authenticated_lsLoginStatus"
        LogIn.className = "rbx-menu-item logout-menu-item"
        LogIn.innerHTML = "Log-In"
        LogIn.href = "https://www.roblox.com/login"
        AuthenticationBannerSpan.appendChild(LogIn)
    } else {
     Namey.innerHTML = "Hello, " + GetCurrentUser() + "!"
        AuthenticationBannerSpan.appendChild(Namey)

        var Loogout = document.createElement("a")
        Loogout.id = "ctl00_ctl00_BannerOptionsLoginView_BannerOptions_Authenticated_lsLoginStatus"
        Loogout.className = "rbx-menu-item logout-menu-item"
        Loogout.innerHTML = "Logout"
        Loogout.href = "#"
        Loogout.onclick = function() {
            $.ajax({
                method: "POST",
                url: "https://auth.roblox.com/v2/logout",
                contentType: "application/json",
                data: JSON.stringify({})
            });
        }
        AuthenticationBannerSpan.appendChild(Loogout)
    }



    //

    var Alerts = document.createElement("div")
    Alerts.id = "Alerts"
    Banner.appendChild(Alerts)

    var Table1 = document.createElement("table")
    Table1.id = "CoolTable"
    Alerts.appendChild(Table1)

    var Table2 = document.createElement("tbody")
    Table1.appendChild(Table2)

    var Table3 = document.createElement("tr")
    Table2.appendChild(Table3)

    var Table4 = document.createElement("td")
    Table3.appendChild(Table4)

    var BannerAlerts = document.createElement("div")
    BannerAlerts.id = "Banctl00_ctl00_BannerAlertsLoginView_BannerAlerts_Authenticated_rbxBannerAlert_rbxAlerts_AlertSpacePaneln"
    Table4.appendChild(BannerAlerts)

    var AlertSpace = document.createElement("div")
    AlertSpace.className = "AlertSpace"
    BannerAlerts.appendChild(AlertSpace)

    var MessageAlert = document.createElement("div")
    MessageAlert.className = "MessageAlert"
    AlertSpace.appendChild(MessageAlert)

    var FriendsAlert = document.createElement("div")
    FriendsAlert.className = "FriendsAlert"
    AlertSpace.appendChild(FriendsAlert)

    var RobuxAlert = document.createElement("div")
    RobuxAlert.className = "RobuxAlert"
    AlertSpace.appendChild(RobuxAlert)

    var TicketsAlert = document.createElement("div")
    TicketsAlert.className = "TicketsAlert"
    AlertSpace.appendChild(TicketsAlert)

    var Tix = document.createElement("a")
    Tix.id = "ctl00_ctl00_BannerAlertsLoginView_BannerAlerts_Authenticated_rbxBannerAlert_rbxAlerts_TicketsAlertCaptionHyperLink"
    Tix.className = "TicketsAlertCaption tooltip-right"
    Tix.innerHTML = "0"
    TicketsAlert.appendChild(Tix)

    // BODY & SUBMENU

    var Body = document.createElement("div")
    container.appendChild(Body)
    Body.id = "Body"

    var subMenu = document.createElement("div")
    subMenu.id = "ctl00_ctl00_cphRoblox_subMenu"
    subMenu.className = "subMenu"
    Body.appendChild(subMenu)

    var subButtons = document.createElement("ul")
    subMenu.appendChild(subButtons)

    // APPEND CONTENT

    var contentLegacy = document.getElementsByClassName("content")
    Body.appendChild(contentLegacy[0])

    // HEADER "ROBLOX" LINK

    var homepage = document.createElement("a")
    HeaderContainer.appendChild(homepage)
    homepage.href = "https://www.roblox.com/home"
    homepage.id = "Homepage"

    // HEADER ACCOUNT INFO

    var accountinfo = document.createElement("div")
    HeaderContainer.appendChild(accountinfo)
    accountinfo.id = "AccountInfo"
    var robuxinfo = document.getElementById("navbar-robux")
    RobuxAlert.appendChild(robuxinfo)

    // FRIEND REQUESTS

    var requestslegacy = document.getElementById("nav-friends")


    var friendrequests = document.createElement("p")
    accountinfo.appendChild(friendrequests)
    friendrequests.id = "FriendRequests"
    FriendsAlert.appendChild(requestslegacy)

    // MESSAGES

    var messgylegacy = document.getElementById("nav-message")


    var messgy = document.createElement("p")
    accountinfo.appendChild(messgy)
    messgy.id = "messgy"
    MessageAlert.appendChild(messgylegacy)


    // BELOW ARE NAV BUTTONS

    // MY ROBLOX

    var myRoblox = document.createElement("li")
    navButtons.appendChild(myRoblox)
    var myRobloxHref = document.createElement("a")
    myRoblox.appendChild(myRobloxHref)
    myRobloxHref.href = "https://www.roblox.com/user.aspx"
    myRobloxHref.innerHTML = "My ROBLOX"

    // GAMES

    var gamesLink = document.createElement("li")
    gamesLink.className = ("gamesLink")
    navButtons.appendChild(gamesLink)
    gamesLink.href = "https://www.roblox.com/Games.aspx"
    var gamesLinkHref = document.createElement("a")
    gamesLink.appendChild(gamesLinkHref)
    gamesLinkHref.href = "https://www.roblox.com/Games.aspx"
    gamesLinkHref.innerHTML = "Games"

    var gamesMenuToggle = document.createElement("a")
    gamesMenuToggle.id = "gamesMenuToggle"
    gamesMenuToggle.onclick = "toggleDropDownNav();"
    gamesLink.appendChild(gamesMenuToggle)


    // CATALOG

    var catalog = document.createElement("li")
    navButtons.appendChild(catalog)
    var catalogHref = document.createElement("a")
    catalog.appendChild(catalogHref)
    catalogHref.href = "https://www.roblox.com/Catalog.aspx"
    catalogHref.innerHTML = "Catalog"

    // PEOPLE

    var people = document.createElement("li")
    navButtons.appendChild(people)
    var peopleHref = document.createElement("a")
    people.appendChild(peopleHref)
    peopleHref.href = "https://www.roblox.com/search/users"
    peopleHref.innerHTML = "People"

    // BUILDERS CLUB

    var builderclub = document.createElement("li")
    navButtons.appendChild(builderclub)
    var builderclubHref = document.createElement("a")
    builderclub.appendChild(builderclubHref)
    builderclubHref.href = "https://www.roblox.com/premium/membership"
    builderclubHref.innerHTML = "Builders Club"

    // TRADE

    var trade = document.createElement("li")
    navButtons.appendChild(trade)
    var tradeHref = document.createElement("a")
    trade.appendChild(tradeHref)
    tradeHref.href = "https://www.roblox.com/trades"
    tradeHref.innerHTML = "Trades"

    // 'FORUM'

    var forum = document.createElement("li")
    navButtons.appendChild(forum)
    var forumHref = document.createElement("a")
    forum.appendChild(forumHref)
    forumHref.href = "https://www.reddit.com/r/roblox"
    forumHref.innerHTML = "Forum"

    // BLOG

    var blog = document.createElement("li")
    navButtons.appendChild(blog)
    var blogHref = document.createElement("a")
    blog.appendChild(blogHref)
    blogHref.id = "hlNews"
    blogHref.href = "http://blog.roblox.com/"
    blogHref.innerHTML = "News"

    var Blogimg = document.createElement("a")
    blog.appendChild(Blogimg)
    Blogimg.className = "icons rss_icon"
    Blogimg.id = "hlNewsFeed"
    Blogimg.href = "http://blog.roblox.com/?feed=rss"

    // PARENTS

    var papa = document.createElement("li")
    navButtons.appendChild(papa)
    var mama = document.createElement("a")
    papa.appendChild(mama)
    mama.href = "https://www.roblox.com/Parents.aspx"
    mama.innerHTML = "Parents"

    // HELP

    var help = document.createElement("li")
    navButtons.appendChild(help)
    var helpHref = document.createElement("a")
    help.appendChild(helpHref)
    helpHref.href = "https://www.roblox.com/Help/Builderman.aspx"
    helpHref.innerHTML = "Help"


    //SUBMENU BUTTONS

    // HOOOME

    var home = document.createElement("li")
    subButtons.appendChild(home)
    var homehref = document.createElement("a")
    home.appendChild(homehref)
    homehref.href = "https://www.roblox.com/My/Home.aspx"
    homehref.innerHTML = "Home"

    // BUILD PAGE

    var create = document.createElement("li")
    subButtons.appendChild(create)
    var createsHref = document.createElement("a")
    create.appendChild(createsHref)
    createsHref.href = "https://create.roblox.com"
    createsHref.innerHTML = "Places"

    // INBOX

    var inbux = document.createElement("li")
    subButtons.appendChild(inbux)
    var inbuxhref = document.createElement("a")
    inbux.appendChild(inbuxhref)
    inbuxhref.href = "https://www.roblox.com/my/messages/#!/inbox"
    inbuxhref.innerHTML = "Inbox"

    // INBOX

    var account = document.createElement("li")
    subButtons.appendChild(account)
    var accounthh = document.createElement("a")
    account.appendChild(accounthh)
    accounthh.href = "https://www.roblox.com/My/Profile.aspx"
    accounthh.innerHTML = "Account"

    // PROFILE .. AGAIN

    var profil = document.createElement("li")
    subButtons.appendChild(profil)
    var profily = document.createElement("a")
    profil.appendChild(profily)
    profily.href = "https://www.roblox.com/User.aspx"
    profily.innerHTML = "Profile"

    // FRIENDS

    var friend = document.createElement("li")
    subButtons.appendChild(friend)
    var friendhtm = document.createElement("a")
    friend.appendChild(friendhtm)
    friendhtm.href = "https://www.roblox.com/My/EditFriends.aspx"
    friendhtm.innerHTML = "Friends"

    // CHARACTER

    var Character = document.createElement("li")
    subButtons.appendChild(Character)
    var Characte = document.createElement("a")
    Character.appendChild(Characte)
    Characte.href = "https://www.roblox.com/My/Character.aspx"
    Characte.innerHTML = "Character"

    // STUFF

    var Stuff = document.createElement("li")
    subButtons.appendChild(Stuff)
    var Stuf = document.createElement("a")
    Stuff.appendChild(Stuf)
    Stuf.href = "https://www.roblox.com/My/Stuff.aspx"
    Stuf.innerHTML = "Stuff"

    // SETS

    var Sets = document.createElement("li")
    subButtons.appendChild(Sets)
    var Setshref = document.createElement("a")
    Sets.appendChild(Setshref)
    Setshref.style = "cursor: not-allowed;"
    Setshref.innerHTML = "Sets"

     // GROUPS

    var groups = document.createElement("li")
    subButtons.appendChild(groups)
    var groupsHref = document.createElement("a")
    groups.appendChild(groupsHref)
    groupsHref.href = "https://www.roblox.com/My/Groups.aspx"
    groupsHref.innerHTML = "Groups"


    // STUFF

    var AccountBalance = document.createElement("li")
    subButtons.appendChild(AccountBalance)
    var AccountBalanc = document.createElement("a")
    AccountBalance.appendChild(AccountBalanc)
    AccountBalanc.href = "https://www.roblox.com/My/AccountBalance.aspx"
    AccountBalanc.innerHTML = "Money"

    // AD INV

    var AdInventory = document.createElement("li")
    subButtons.appendChild(AdInventory)
    var eee = document.createElement("a")
    AdInventory.appendChild(eee)
    eee.href = "https://www.roblox.com/My/AdInventory.aspx"
    eee.innerHTML = "Advertising"

    // SHARE

    var share = document.createElement("li")
    subButtons.appendChild(share)
    var shareHref = document.createElement("a")
    share.appendChild(shareHref)
    shareHref.style = "cursor: not-allowed;"
    shareHref.innerHTML = "Share"

    // AD INV

    var ElSetink = document.createElement("li")
    subButtons.appendChild(ElSetink)
    var set = document.createElement("a")
    ElSetink.appendChild(set)
    set.href = "https://www.roblox.com/my/account#!/info"
    set.innerHTML = "Settings"

})();
