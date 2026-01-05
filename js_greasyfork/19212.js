
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
// ==UserScript==
// @name         Bubble.am - CaSiNo KinGsS
// @namespace    http://bubble.am/
// @version      0.1
// @description  Full splite full
// @author       Derii Solter
// ==/UserScript==

(function() {
    var amount = 4;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 160) { // KEY_T
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 160}); // KEY_SPACE
                    window.onkeyup({keyCode: 160});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

(function() {
    var amount = 4;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 120) { // KEY_E
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 100}); // KEY_W
                    window.onkeyup({keyCode: 100});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

(function() {
    var amount = 2;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 100) { // KEY_G
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 100}); // KEY_SPACE
                    window.onkeyup({keyCode: 100});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();
