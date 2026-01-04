// ==UserScript==
// @name         QuickSort Algorithm
// @description  Implements the QuickSort algorithm in Python
// @match        *://*/*
// @version 0.0.1.20240417150038
// @namespace https://greasyfork.org/users/1289520
// @downloadURL https://update.greasyfork.org/scripts/492769/QuickSort%20Algorithm.user.js
// @updateURL https://update.greasyfork.org/scripts/492769/QuickSort%20Algorithm.meta.js
// ==/UserScript==

function quicksort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const middle = [];
    const right = [];
    arr.forEach(element => {
        if (element < pivot) {
            left.push(element);
        } else if (element > pivot) {
            right.push(element);
        } else {
            middle.push(element);
        }
    });
    return quicksort(left).concat(middle, quicksort(right));
}

// Example usage:
const arr = [3, 6, 8, 10, 1, 2, 1];
console.log(quicksort(arr));