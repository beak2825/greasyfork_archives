// ==UserScript==
// @license MIT
// @name         自动数独游戏
// @namespace    https://greasyfork.org/users/433510
// @version      0.1.20240902
// @description  自动完成数独游戏
// @author       lingyer
// @match        http://www.1000qm.vip/forum.php?mod=viewthread&tid=439151&extra=page%3D1
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516346/%E8%87%AA%E5%8A%A8%E6%95%B0%E7%8B%AC%E6%B8%B8%E6%88%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/516346/%E8%87%AA%E5%8A%A8%E6%95%B0%E7%8B%AC%E6%B8%B8%E6%88%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

     const matrix_source = [ //此处存放初始的数字方阵，有数字处填数字，空白处填0
                             [0,0,0,0,0,0,0,1,0],
                             [0,0,0,0,6,4,5,3,0],
                             [0,0,3,0,0,9,0,4,7],
                             [0,8,0,0,0,0,6,9,1],
                             [0,3,1,2,0,0,0,0,0],
                             [4,0,0,0,0,0,0,0,5],
                             [0,0,0,0,0,5,0,6,0],
                             [0,0,8,0,0,0,0,0,0],
                             [0,6,9,0,0,7,0,0,4] ];

    var matrix_test = [ //此处存放计算中的数字方阵
                        [0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0] ];

    var i, j, k;
    var status;

    //变量初始化
    //计算方阵赋初始值
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            matrix_test[i][j] = matrix_source[i][j];
        }
    }

    //开始试填
    i = 0;
    j = -1;
    status = goto_next_grid(); //定位到第一个需要填数的方格
    if (status > 0) { //未能成功定位，出错了
        console.log("未能成功定位到第一个需要填数的方格，出错了");
        return;
    }
    do {
        k = matrix_test[i][j]; //取出当前格子里的数字
        k++;
        while (k <= 9) {
            // console.log("尝试在[", i, "][", j, "]格子填入", k);
            matrix_test[i][j] = k; //尝试在当前格子填入k
            status = trynum();
            if (status < 1) { //试填成功，前进到下一格
                status = goto_next_grid();
                break;
            } else { //试填不成功，k+1，再次试填
                k++;
            }
        }
        if (k > 9) { //9个数字均试过，当前格无解，回退到上一格需要填数的方格
            matrix_test[i][j] = 0;
            status = backto_last_grid();
        }
    } while (status < 1);

    if (status == 1) { //成功填完
        console.log(matrix_test[0]);
        console.log(matrix_test[1]);
        console.log(matrix_test[2]);
        console.log(matrix_test[3]);
        console.log(matrix_test[4]);
        console.log(matrix_test[5]);
        console.log(matrix_test[6]);
        console.log(matrix_test[7]);
        console.log(matrix_test[8]);
    } else { //出错了
        console.log("出错了!错误代码：", status);
        console.log("i = ", i, ", j = ", j, ", k = ", k);
        console.log(matrix_test[0]);
        console.log(matrix_test[1]);
        console.log(matrix_test[2]);
        console.log(matrix_test[3]);
        console.log(matrix_test[4]);
        console.log(matrix_test[5]);
        console.log(matrix_test[6]);
        console.log(matrix_test[7]);
        console.log(matrix_test[8]);
    }


    //sub_function area 以下为子函数定义区域
    function trynum() { //检查当前格子填入后是否存在冲突
        var m, n, x, y;
        //检查当前行
        for (n = 0; n < 9; n++) {
            if (n != j) {
                if (matrix_test[i][n] == matrix_test[i][j]) {
                    //存在重复，试填失败
                    return 3;
                }
            }
        }

        //检查当前列
        for (m = 0; m < 9; m++) {
            if (m != i) {
                if (matrix_test[m][j] == matrix_test[i][j]) {
                    //存在重复，试填失败
                    return 3;
                }
            }
        }

        //检查当前方块
        if (i < 3) {
            m = 0;
        } else {
            if (i < 6) {
                m = 3;
            } else {
                m = 6;
            }
        }

        if (j < 3) {
            n = 0;
        } else {
            if (j < 6) {
                n = 3;
            } else {
                n = 6;
            }
        }

        for (x = 0; x < 3; x++) {
            for (y = 0; y < 3; y++) {
                if (((m + x) != i) && ((n + y) != j)) {
                    if (matrix_test[m + x][n + y] == matrix_test[i][j]) {
                        //存在重复，试填失败
                        return 3;
                    }
                }
            }
        }

        //行、列、方块检查均通过，试填成功
        return 0;
    }

    function goto_next_grid() { //定位到下一个需要填数的方格
        do {
            j++;
            if (j >= 9) { //已经到达该行的末尾
                j = 0;
                i++;
                if (i >= 9) { //已经到达最后一行
                    return 1; //返回值1，已到达矩阵末端，没有需要填的方格
                }
            }
        } while (matrix_source[i][j] > 0) //原方阵此处有数据，不需要填数，继续找
        //console.log("下一个需要填数的方格为：[", i, "][", j, "]");
        return 0; //返回值0，下一个需要填数的方格为matrix_test[i][j]
    }

    function backto_last_grid() { //回退到上一格需要填数的方格
        do {
            j--;
            if (j < 0) { //已退回该行的开头
                j = 8;
                i--;
            }
            if (i < 0) { //已经退回矩阵开头，不能再回退
                return 2; //返回值2，已经退回矩阵开头，不能再回退
            }
        } while (matrix_source[i][j] > 0); //原方阵此处有数据，继续回退
        return 0; //返回值0，下一个需要填数的方格为matrix_test[i][j]
    }

})();