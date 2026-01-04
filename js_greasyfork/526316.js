// ==UserScript==
// @name        Multiset
// @namespace   Data Structures
// @grant       none
// @version     0.0.1
// @author      Gemini 2.0
// @description Multiset data structure
// ==/UserScript==

// Changelog
// 0.0.1 - January 8, 2025
// - Initial release

const Multiset = (function() {
	'use strict';

	// LLM: Multiset written by Gemini 2.0 Flash Thinking Experimental 01-21.
	/**
	* Represents a Multiset (or Bag) data structure.
	* A multiset is like a set, but it allows duplicate elements.
	*/
	class Multiset {
		constructor(iterable = []) {
			/**
			* Internal storage for the multiset.
			* Uses a Map where keys are elements and values are their counts.
			* @private
			* @type {Map<any, number>}
			*/
			this._counts = new Map();

			/**
			* The total number of elements in the multiset (including duplicates).
			* @private
			* @type {number}
			*/
			this._size = 0;

			// Initialize from an iterable if provided
			for (const element of iterable) {
				this.add(element);
			}
		}

		/**
		* Adds an element to the multiset.
		* If the element already exists, increments its count.
		* @param {any} element The element to add.
		* @param {number} [count=1] The number of times to add the element.
		* @returns {this} The Multiset instance (for chaining).
		*/
		add(element, count = 1) {
			if (typeof count !== 'number') {
				throw new TypeError("Count must be a number.");
			}

			if (count <= 0) {
				return this; // No-op for non-positive counts
			}

			const currentCount = this._counts.get(element) || 0;
			this._counts.set(element, currentCount + count);
			this._size += count;
			return this;
		}

		/**
		* Deletes a specific element from the multiset.
		* If the element exists, decrements its count.
		* If the count becomes zero after deletion, the element is removed entirely.
		* @param {any} element The element to delete.
		* @param {number} [count=1] The number of times to delete the element.
		* @returns {boolean} True if the element was present (and potentially deleted), false otherwise.
		*/
		delete(element, count = 1) {
			if (typeof count !== 'number') {
				throw new TypeError("Count must be a number.");
			}

			if (count <= 0) {
				return false; // No-op for non-positive counts
			}

			if (!this.has(element)) {
				return false; // Element not present
			}

			const currentCount = this._counts.get(element);
			if (count >= currentCount) {
				this._counts.delete(element);
				this._size -= currentCount;
			} else {
				this._counts.set(element, currentCount - count);
				this._size -= count;
			}
			return true;
		}

		/**
		* Checks if the multiset contains a specific element (at least once).
		* @param {any} element The element to check for.
		* @returns {boolean} True if the element is in the multiset, false otherwise.
		*/
		has(element) {
			return this._counts.has(element);
		}

		/**
		* Returns the count of a specific element in the multiset.
		* @param {any} element The element to get the count for.
		* @returns {number} The count of the element. Returns 0 if the element is not in the multiset.
		*/
		count(element) {
			return this._counts.get(element) || 0;
		}

		/**
		* Clears the multiset, removing all elements.
		* @returns {void}
		*/
		clear() {
			this._counts.clear();
			this._size = 0;
		}

		/**
		* Returns the total number of elements in the multiset (including duplicates).
		* @returns {number} The size of the multiset.
		*/
		get size() {
			return this._size;
		}

		/**
		* Returns an array representation of the multiset.
		* The array will contain each element as many times as it appears in the multiset.
		* The order of elements in the array is not guaranteed to be specific.
		* @returns {any[]} An array of elements in the multiset.
		*/
		toArray() {
			const result = [];
			for (const [element, count] of this._counts.entries()) {
				for (let i = 0; i < count; i++) {
					result.push(element);
				}
			}
			return result;
		}

		/**
		* Executes a provided function once for each element in the multiset.
		* The function is called with the element and the multiset itself as arguments.
		* Elements are iterated over as many times as they appear in the multiset.
		* @param {function(any, Multiset): void} callbackFn The function to execute for each element.
		* @param {any} [thisArg] Value to use as `this` when executing `callbackFn`.
		* @returns {void}
		*/
		forEach(callbackFn, thisArg) {
			for (const [element, count] of this._counts.entries()) {
				for (let i = 0; i < count; i++) {
					callbackFn.call(thisArg, element, this);
				}
			}
		}

		/**
		* Returns an iterator that yields each element in the multiset, respecting duplicates.
		* Elements are iterated over as many times as they appear in the multiset.
		* The order of elements is not guaranteed to be specific.
		* @returns {Iterator<any>} An iterator for the multiset elements.
		*/
		*[Symbol.iterator]() {
			for (const [element, count] of this._counts.entries()) {
				for (let i = 0; i < count; i++) {
					yield element;
				}
			}
		}

		/**
		* Returns an iterator that yields [element, count] pairs for each unique element in the multiset.
		* @returns {Iterator<[any, number]>} An iterator for the multiset entries.
		*/
		entries() {
			return this._counts.entries();
		}

		/**
		* Returns an iterator that yields the unique elements in the multiset (keys).
		* @returns {Iterator<any>} An iterator for the unique elements (keys).
		*/
		keys() {
			return this._counts.keys();
		}

		/**
		* Returns an iterator that yields the counts of each unique element in the multiset (values).
		* @returns {Iterator<number>} An iterator for the element counts (values).
		*/
		values() {
			return this._counts.values();
		}

		/**
		* Checks if another Multiset is equal to this Multiset.
		* Two multisets are equal if they contain the same elements with the same counts.
		* @param {Multiset} otherMultiset The Multiset to compare with.
		* @returns {boolean} True if the multisets are equal, false otherwise.
		*/
		equals(otherMultiset) {
			if (!(otherMultiset instanceof Multiset)) {
				return false;
			}
			if (this.size !== otherMultiset.size) {
				return false;
			}
			if (this._counts.size !== otherMultiset._counts.size) {
				return false; // Different number of unique elements
			}

			for (const [element, count] of this._counts.entries()) {
				if (otherMultiset.count(element) !== count) {
					return false;
				}
			}
			return true;
		}

		/**
		* Returns a new Multiset containing elements present in this multiset but not in the other multiset.
		* For elements present in both, the count in the resulting multiset is the count in this multiset minus the count in the other multiset, or zero if the count in the other multiset is greater or equal.
		* @param {Multiset} otherMultiset The other multiset to compute the difference with.
		* @returns {Multiset} A new Multiset representing the difference.
		*/
		difference(otherMultiset) {
			const resultMultiset = new Multiset();
			for (const [element, count] of this._counts.entries()) {
				const otherCount = otherMultiset.count(element);
				const diffCount = Math.max(0, count - otherCount); // Ensure count is not negative
				if (diffCount > 0) {
					resultMultiset.add(element, diffCount);
				}
			}
			return resultMultiset;
		}

		/**
		* Returns a new Multiset containing elements present in both this multiset and the other multiset.
		* For elements present in both, the count in the resulting multiset is the minimum of their counts in both multisets.
		* @param {Multiset} otherMultiset The other multiset to compute the intersection with.
		* @returns {Multiset} A new Multiset representing the intersection.
		*/
		intersection(otherMultiset) {
			const resultMultiset = new Multiset();
			for (const [element, count] of this._counts.entries()) {
				const otherCount = otherMultiset.count(element);
				const intersectionCount = Math.min(count, otherCount);
				if (intersectionCount > 0) {
					resultMultiset.add(element, intersectionCount);
				}
			}
			return resultMultiset;
		}

		/**
		* Checks if this multiset is disjoint from another multiset.
		* Two multisets are disjoint if they have no elements in common (their intersection is empty).
		* @param {Multiset} otherMultiset The other multiset to check for disjointness.
		* @returns {boolean} True if the multisets are disjoint, false otherwise.
		*/
		isDisjointFrom(otherMultiset) {
			return this.intersection(otherMultiset).size === 0;
		}

		/**
		* Checks if this multiset is a subset of another multiset.
		* This multiset is a subset of the other multiset if for every element in this multiset, its count is less than or equal to its count in the other multiset.
		* @param {Multiset} otherMultiset The other multiset to check if this multiset is a subset of.
		* @returns {boolean} True if this multiset is a subset of the other multiset, false otherwise.
		*/
		isSubsetOf(otherMultiset) {
			for (const [element, count] of this._counts.entries()) {
				if (otherMultiset.count(element) < count) {
					return false;
				}
			}
			return true;
		}

		/**
		* Checks if this multiset is a superset of another multiset.
		* This multiset is a superset of the other multiset if for every element in the other multiset, its count is less than or equal to its count in this multiset.
		* @param {Multiset} otherMultiset The other multiset to check if this multiset is a superset of.
		* @returns {boolean} True if this multiset is a superset of the other multiset, false otherwise.
		*/
		isSupersetOf(otherMultiset) {
			return otherMultiset.isSubsetOf(this); // Reusing isSubsetOf for efficiency
		}

		/**
		* Returns a new Multiset containing all elements from both this multiset and the other multiset.
		* For elements present in both, the count in the resulting multiset is the maximum of their counts in both multisets.
		* Note: This is often referred to as "set-like" union for multisets. For "disjoint" union, you would sum the counts instead.
		* @param {Multiset} otherMultiset The other multiset to compute the union with.
		* @returns {Multiset} A new Multiset representing the union.
		*/
		setUnion(otherMultiset) {
			const resultMultiset = new Multiset();
			// Add all elements from this multiset
			for (const [element, count] of this._counts.entries()) {
				resultMultiset.add(element, count);
			}
			// Add elements from the other multiset, taking the maximum count if already present
			for (const [element, otherCount] of otherMultiset._counts.entries()) {
				const currentCount = resultMultiset.count(element);
				resultMultiset.add(element, Math.max(0, otherCount - currentCount)); // Add the difference to reach the max count
			}
			return resultMultiset;
		}

		// HUMAN: Modified from setUnion to use sum of counts from both multisets instead of maximum.
		disjointUnion(otherMultiset) {
			const resultMultiset = new Multiset();
			// Add all elements from this multiset
			for (const [element, count] of this._counts.entries()) {
				resultMultiset.add(element, count);
			}
			// Add elements from the other multiset, summing the counts
			for (const [element, otherCount] of otherMultiset._counts.entries()) {
				const currentCount = resultMultiset.count(element);
				resultMultiset.add(element, otherCount);
			}
			return resultMultiset;
		}

		/**
		* Returns a new Multiset containing elements that are in either this multiset or the other multiset, but not in both.
		* For elements present in both, the count in the resulting multiset is the absolute difference of their counts in the two multisets.
		* @param {Multiset} otherMultiset The other multiset to compute the symmetric difference with.
		* @returns {Multiset} A new Multiset representing the symmetric difference.
		*/
		symmetricDifference(otherMultiset) {
			const resultMultiset = new Multiset();
			const allKeys = new Set([...this.keys(), ...otherMultiset.keys()]); // Unique keys from both multisets

			for (const element of allKeys) {
				const count1 = this.count(element);
				const count2 = otherMultiset.count(element);
				const diffCount = Math.abs(count1 - count2);
				if (diffCount > 0) {
					resultMultiset.add(element, diffCount);
				}
			}
			return resultMultiset;
		}
	}

	function main() {
	}
	main();

	return Multiset;

})();
