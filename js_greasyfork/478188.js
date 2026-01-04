// ==UserScript==
// ==UserLibrary==
// @name        NH_xunit
// @description xUnit style testing.
// @version     53
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0-standalone.html
// @homepageURL https://github.com/nexushoratio/userscripts
// @supportURL  https://github.com/nexushoratio/userscripts/issues
// @match       https://www.example.com/*
// ==/UserLibrary==
// ==/UserScript==

window.NexusHoratio ??= {};

window.NexusHoratio.xunit = (function xunit() {
  'use strict';

  /** @type {number} - Bumped per release. */
  const version = 53;

  /**
   * @type {object} - For testing support.
   */
  const testing = {
    enabled: false,
    missingDescriptionsAreErrors: true,
    testCases: [],
  };

  /** Data about a test execution. */
  class TestExecution {

    start = 0;
    stop = 0;

  }

  /** Accumulated results from running a TestCase. */
  class TestResult {

    /** Unexpected exceptions. */
    errors = [];

    /** Explicit test failures (typically failed asserts). */
    failures = [];

    /** Skipped tests. */
    skipped = [];

    /** Successes. */
    successes = [];

    /** All test executions. */
    tests = new Map();

    /**
     * Record an unexpected exception from a execution.
     * @param {string} name - Name of the TestCase.testMethod.
     * @param {Error} exception - Exception caught.
     */
    addError(name, exception) {
      this.errors.push({
        name: name,
        error: exception.name,
        message: exception.message,
      });
    }

    /**
     * Record a test failure.
     * @param {string} name - Name of the TestCase.testMethod.
     * @param {string} message - Message from the test or framework.
     */
    addFailure(name, message) {
      this.failures.push({
        name: name,
        message: message,
      });
    }

    /**
     * Record a test skipped.
     * @param {string} name - Name of the TestCase.testMethod.
     * @param {string} message - Reason the test was skipped.
     */
    addSkip(name, message) {
      this.skipped.push({
        name: name,
        message: message,
      });
    }

    /**
     * Record a successful execution.
     * @param {string} name - Name of the TestCase.testMethod.
     */
    addSuccess(name) {
      this.successes.push(name);
    }

    /**
     * Record the start of a test execution.
     * @param {string} name - Name of the TestCase.testMethod.
     */
    startTest(name) {
      const execution = new TestExecution();
      execution.start = Date.now();
      this.tests.set(name, execution);
    }

    /**
     * Record the stop of a test execution.
     * @param {string} name - Name of the TestCase.testMethod.
     */
    stopTest(name) {
      this.tests.get(name).stop = Date.now();
    }

    /** @returns {boolean} - Indicates success so far. */
    wasSuccessful() {
      return this.errors.length === 0 && this.failures.length === 0;
    }

    /**
     * Text summary of the results.
     *
     * Useful for test runners.
     * @param {boolean} [formatted=false] - Try to line things up columns.
     * @returns {string[]} - Summary, one line per entry in the array.
     */
    summary(formatted = false) {
      const fields = ['total', 'successes', 'skipped', 'errors', 'failures'];
      const numbers = new Map();
      const results = [];
      let maxFieldLength = 0;
      let maxCountLength = 0;
      for (const field of fields) {
        if (field === 'total') {
          // Double duty: renaming 'tests' to 'total', and using '.size'
          numbers.set(field, this.tests.size);
        } else {
          numbers.set(field, this[field].length);
        }
      }

      if (formatted) {
        maxFieldLength = Math.max(...Array.from(numbers.keys())
          .map(x => x.length));
        maxCountLength = String(Math.max(...numbers.values())).length;
      }

      for (const field of fields) {
        const f = field.padEnd(maxFieldLength);
        const v = `${numbers.get(field)}`.padStart(maxCountLength);
        results.push(`${f} : ${v}`);
      }
      return results;
    }

  }

  /**
   * Attempt to get the type of item.
   *
   * This is internal to xunit, so no need to make it equivalent to the
   * built-in `typeof` operator.  Hence, results are explicitly NOT
   * lower-cased in order to reduce chances of conflicts.
   *
   * This just needs to be good enough to find a comparator function.
   * @param {*} item - Item to inspect.
   * @returns {string} - The likely type of item.
   */
  function getType(item) {
    const builtInClasses = [
      'Array',
      'Date',
      'Error',
      'Map',
      'Set',
    ];
    let type = Object.prototype.toString.call(item)
      .replace(/^\[object (?<type>.*)\]$/u, '$<type>');
    if (type === 'Function') {
      if (String(item)
        .startsWith('class ')) {
        type = 'class';
      } else if (builtInClasses.includes(item.name)) {
        type = 'class';
      }
    }
    if (type === 'Object') {
      if (typeof item.constructor.name === 'string') {
        type = item.constructor.name;
      }
    }
    return type;
  }

  /**
   * An xUnit style test framework.
   *
   * Many expected methods exist, such as setUp, setUpClass, addCleanup,
   * addClassCleanup, etc.  No tearDown methods, however; use addCleanup.
   *
   * Assertion methods should always take a plain text string, typically named
   * `msg`, as the last parameter.  This string should be added to the
   * assertion specific error message in case of a failure.
   *
   * JavaScript does not have portable access to things like line numbers and
   * stack traces (and in the case of userscripts, those may be inaccurate
   * anyway).  So it can be difficult to track down a particular test failure.
   * The failure messages do include the name of the test class and test
   * method, but, if the method happens to have several assertions in it, it
   * may not be obvious which one failed.  These extra descriptive messages
   * can help with differentiation.  This system will emit a debug message if
   * any test method calls more than one assert method without a descriptive
   * message.
   *
   * While the *assertEqual()* method will handle many cases by looking up
   * special functions comparing by type.  There may be times when what it can
   * handle needs to be enhanced.  There are currently two ways to make such
   * enhancements.
   *
   * First, the method *addEqualFunc()* will allow the test method to register
   * an additional function for comparing two identical instances.
   *
   * Second, the property *defaultEqual* points to whatever *equalX()*
   * function should be used if one cannot be found, or if instances differ by
   * type.  This fallback defaults to *equalEqEqEq()* which uses the strict
   * equality (`===`) operator.  This can be explicitly set in the test
   * method.  The method *equalValueOf()* will use the instance's *valueOf()*
   * method to get comparable values, and may be useful in such cases.
   *
   * In many languages, order does not matter for some built-in container
   * types (e.g., Map, Set).  The JavaScript standard explicitly specifies
   * that order DOES matter for these types.  However, for this test library,
   * the default *equalX()* functions explicitly IGNORE order.
   *
   * Some built-in types (e.g., Map, Set), do not have good string
   * representations when showing up in error messages.  While user classes
   * can provide a *toString()* method, sometimes they may not be available.
   * To help with this situation, this class provides a registration system
   * similar to the one used for equality functions.
   *
   * The property *defaultRepr* points to *String()*, but may be overridden
   * for an invocation.
   *
   * The method *addReprFunc()* can allow users to register their own.
   *
   * Implementations for built-in types will be added as needed.
   *
   * All *assertX()* and *equalX()* methods should use *this.repr()* to turn
   * values into strings for these error messages.
   *
   * TestCases should run only one test method per instance.  The name of the
   * method is registered during instantiation and invoked by calling
   * *instance.run().*.  Generally, a system, like {@link TestRunner} is used
   * to register a number of TestCases, discover the test methods, and invoke
   * all of them in turn.
   *
   * @example
   * class FooTestCase extends TestCase {
   *   testMethod() {
   *     // Assemble - Act
   *
   *     // Assert
   *     this.assertEqual(actual, expected, 'extra message');
   *   }
   * }
   *
   * const test = new FooTestCase('testMethod');
   * const result = test.run();
   */
  class TestCase {

    /**
     * Instantiate a TestCase.
     * @param {string} methodName - The method to run on this instantiation.
     */
    constructor(methodName) {
      if (new.target === TestCase) {
        throw new TypeError('Abstract class; do not instantiate directly.');
      }

      this.#methodName = methodName;

      this.defaultRepr = String;
      this.addReprFunc('String', this.reprString);
      this.addReprFunc('Array', this.reprArray);
      this.addReprFunc('Object', this.reprObject);
      this.addReprFunc('Map', this.reprMap);
      this.addReprFunc('Set', this.reprSet);

      this.defaultEqual = this.equalEqEqEq;
      this.addEqualFunc('String', this.equalString);
      this.addEqualFunc('Array', this.equalArray);
      this.addEqualFunc('Object', this.equalObject);
      this.addEqualFunc('Map', this.equalMap);
      this.addEqualFunc('Set', this.equalSet);

      this.addCleanup(this.#checkAssertionCounts);
    }

    static Error = class extends Error {

      /** @inheritdoc */
      constructor(...rest) {
        super(...rest);
        this.name = `TestCase.${this.constructor.name}`;
      }

    };

    static Fail = class extends this.Error {}
    static Skip = class extends this.Error {}

    static classCleanups = [];

    /** Called once before any instances are created. */
    static setUpClass() {
      // Empty.
    }

    /**
     * Register a function with arguments to run after all tests in the class
     * have ran.
     * @param {function} func - Function to call.
     * @param {...*} rest - Arbitrary arguments to func.
     */
    static addClassCleanup(func, ...rest) {
      this.classCleanups.push([func, rest]);
    }

    /** Execute all functions registered with addClassCleanup. */
    static doClassCleanups() {
      while (this.classCleanups.length) {
        const [func, rest] = this.classCleanups.pop();
        func.call(this, ...rest);
      }
    }

    /** @type {string} */
    get id() {
      const methodName = this.#methodName;
      return `${this.constructor.name}.${methodName}`;
    }

    /**
     * Execute the test method registered upon instantiation.
     * @param {TestResult} [result] - Instance for accumulating results.
     * Typically, a test runner will pass in one of these to gather results
     * across multiple tests.
     * @returns {TestResult} - Accumulated results (one is created if not
     * passed in).
     */
    run(result) {
      const localResult = result ?? new TestResult();
      const klass = this.constructor.name;

      localResult.startTest(this.id);

      let stage = null;
      try {
        stage = `${klass}.setUp`;
        this.setUp();

        stage = this.id;
        this[this.#methodName]();

        stage = `${klass}.doCleanups`;
        this.doCleanups();

        localResult.addSuccess(this.id);
      } catch (e) {
        const inCleanup = stage.includes('.doCleanups');
        if (e instanceof TestCase.Skip && !inCleanup) {
          localResult.addSkip(stage, e.message);
        } else if (e instanceof TestCase.Fail && !inCleanup) {
          localResult.addFailure(stage, e.message);
        } else {
          localResult.addError(stage, e);
        }
      }

      localResult.stopTest(this.id);

      return localResult;
    }

    /** Called once before each test method. */
    setUp() {  // eslint-disable-line class-methods-use-this
      // Empty.
    }

    /**
     * Register a function with arguments to run after a test.
     * @param {function} func - Function to call.
     * @param {...*} rest - Arbitrary arguments to func.
     */
    addCleanup(func, ...rest) {
      this.#cleanups.push([func, rest]);
    }

    /** Execute all functions registered with addCleanup. */
    doCleanups() {
      while (this.#cleanups.length) {
        const [func, rest] = this.#cleanups.pop();
        func.call(this, ...rest);
      }
    }

    /**
     * Immediately skips a test method.
     * @param {string} [msg=''] - Reason for skipping.
     * @throws {TestCase.Skip}
     */
    skip(msg = '') {
      throw new this.constructor.Skip(msg);
    }

    /**
     * Immediately fail a test method.
     * @param {string} [msg=''] - Reason for the failure.
     * @throws {TestCase.Fail}
     */
    fail(msg = '') {
      throw new this.constructor.Fail(msg);
    }

    /**
     * Asserts that two arguments are equal.
     * @param {*} first - First argument.
     * @param {*} second - Second argument.
     * @param {string} [msg=''] - Text to complement the failure message.
     */
    assertEqual(first, second, msg = '') {
      this.#countAsserts(msg);
      this.#assertBase(first, second, true, msg);
    }

    /**
     * Asserts that two arguments are NOT equal.
     * @param {*} first - First argument.
     * @param {*} second - Second argument.
     * @param {string} [msg=''] - Text to complement the failure message.
     */
    assertNotEqual(first, second, msg = '') {
      this.#countAsserts(msg);
      this.#assertBase(first, second, false, msg);
    }

    /**
     * Asserts that the argument is a boolean true.
     * @param {*} arg - Argument to test.
     * @param {string} [msg=''] - Text to complement the failure message.
     */
    assertTrue(arg, msg = '') {
      this.#countAsserts(msg);
      if (!arg) {
        const failMsg = `${arg} is not true`;
        this.#failMsgs(failMsg, msg);
      }
    }

    /**
     * Asserts that the argument is a boolean false.
     * @param {*} arg - Argument to test.
     * @param {string} [msg=''] - Text to complement the failure message.
     */
    assertFalse(arg, msg = '') {
      this.#countAsserts(msg);
      if (arg) {
        const s1 = this.repr(arg);
        const failMsg = `${s1} is not false`;
        this.#failMsgs(failMsg, msg);
      }
    }

    /**
     * Asserts the expected exception is raised.
     * @param {function(): Error} exc - Expected Error class.
     * @param {function} func - Function to call.
     * @param {string} [msg=''] - Text to complement the failure message.
     */
    assertRaises(exc, func, msg = '') {
      this.assertRaisesRegExp(exc, /.*/u, func, msg);
    }

    /**
     * Asserts that no exception is raised.
     *
     * Useful for supplying descriptive text when verifying an error does not
     * occur.
     * @param {function} func - Function to call.
     * @param {string} [msg=''] - Text to complement the failure message.
     */
    assertNoRaises(func, msg = '') {
      this.#countAsserts(msg);
      try {
        func();
      } catch (e) {
        const failMsg = `Unexpected exception: ${e.name}: ${e.message}`;
        this.#failMsgs(failMsg, msg);
      }
    }

    /**
     * Asserts the expected exception is raised and the message matches the
     * regular expression.
     * @param {function(): Error} exc - Expected Error class.
     * @param {RegExp} regexp - Regular expression to match.
     * @param {function} func - Function to call.
     * @param {string} [msg=''] - Text to complement the failure message.
     */
    assertRaisesRegExp(exc, regexp, func, msg = '') {  // eslint-disable-line max-params
      this.#countAsserts(msg);
      let failMsg = `Expected ${exc.name}, caught nothing`;
      try {
        func();
      } catch (e) {
        if (e instanceof exc) {
          if (regexp.test(e.message)) {
            return;
          }
          failMsg = `Exception message:\n"${e.message}"\ndid not match ` +
            `regular expression:\n"${regexp}"`;
        } else {
          failMsg = `Expected ${exc.name}, caught ${e.name}`;
        }
      }
      this.#failMsgs(failMsg, msg);
    }

    /**
     * Asserts the target matches the regular expression.
     * @param {string} target - Target string to check.
     * @param {RegExp} regexp - Regular expression to match.
     * @param {string} [msg=''] - Text to complement the failure message.
     */
    assertRegExp(target, regexp, msg = '') {
      this.#countAsserts(msg);
      if (!regexp.test(target)) {
        const failMsg = `Target "${target}" did not match ` +
              `regular expression "${regexp}"`;
        this.#failMsgs(failMsg, msg);
      }
    }

    // TODO: Add assertions as needed.

    /**
     * Returns a string representation of the item using the registration
     * system.
     *
     * @param {*} item - Anything.
     * @returns {string} - String version of item.
     */
    repr(item) {
      const reprFunc = this.getReprFunc(item);
      return reprFunc(item);
    }

    /**
     * @callback ReprFunc
     * @param {*} item - Anything.
     * @returns {string} - String version of item.
     */

    /**
     * Find a ReprFunc for the given item.
     * @param {*} item - Item of interest.
     * @returns {ReprFunc} - Function for this item.
     */
    getReprFunc(item) {
      const type = getType(item);
      return this.#reprFuncs.get(type) ?? this.defaultRepr;
    }

    /**
     * @param {string} type - Type of interest.
     * @param {ReprFunc} func - Function for this type.
     */
    addReprFunc(type, func) {
      this.#reprFuncs.set(type, func);
    }

    /**
     * @implements {ReprFunc}
     * @param {string} item - String to wrap.
     * @returns {string} - Wrapped version of item.
     */
    reprString = (item) => {
      const str = `"${item}"`;
      return str;
    }

    /**
     * @implements {ReprFunc}
     * @param {[*]} array - Array of anything.
     * @returns {string} - String version of item.
     */
    reprArray = (array) => {
      const items = array.map(this.repr.bind(this));
      return `[${items.join(', ')}]`;
    }

    /**
     * @implements {ReprFunc}
     * @param {object} obj - Any object.
     * @returns {string} - String version of obj.
     */
    reprObject = (obj) => {
      const items = [];
      for (const [key, value] of Object.entries(obj)) {
        const strKey = this.repr(key);
        const strValue = this.repr(value);
        items.push(`${strKey}: ${strValue}`);
      }
      return `{${items.join(', ')}}`;
    }

    /**
     * @implements {ReprFunc}
     * @param {Map<*,*>} map - Any Map.
     * @returns {string} - String version of map.
     */
    reprMap = (map) => {
      const items = [];
      for (const [key, value] of map.entries()) {
        const strKey = this.repr(key);
        const strValue = this.repr(value);
        items.push(`[${strKey}, ${strValue}]`);
      }
      return `Map([${items.join(', ')}])`;
    }

    /**
     * @implements {ReprFunc}
     * @param {Set<*>} set - Any Set.
     * @returns {string} - String version of set.
     */
    reprSet = (set) => {
      const items = [];
      for (const value of set.values()) {
        const strValue = this.repr(value);
        items.push(`${strValue}`);
      }
      return `Set([${items.join(', ')}])`;
    }

    /**
     * @typedef {object} EqualOutput
     * @property {boolean} equal - Result of equality test.
     * @property {string} detail - Details appropriate to the test (e.g.,
     * where items differed).
     */

    /**
     * @callback EqualFunc
     * @param {*} first - First argument.
     * @param {*} second - Second argument.
     * @returns {EqualOutput} - Results of testing equality.
     */

    /**
     * Find an equality function appropriate for the arguments.
     * @param {*} first - First argument.
     * @param {*} second - Second argument.
     * @returns {EqualFunc} - Function that should be used to test equality.
     */
    getEqualFunc(first, second) {
      let equal = this.defaultEqual;
      const t1 = getType(first);
      const t2 = getType(second);
      if (t1 === t2) {
        equal = this.#equalFuncs.get(t1) ?? equal;
      }
      return equal;
    }

    /**
     * @param {string} type - As returned from {@link getType}.
     * @param {EqualFunc} func - Function to call to compare that type.
     */
    addEqualFunc(type, func) {
      this.#equalFuncs.set(type, func);
    }

    /**
     * @implements {EqualFunc}
     * @param {*} first - First argument.
     * @param {*} second - Second argument.
     * @returns {EqualOutput} - Results of testing equality.
     */
    equalEqEqEq = (first, second) => {
      const equal = first === second;
      return {
        equal: equal,
        details: '',
      };
    }

    /**
     * For those cases when '===' is too strict.
     * @implements {EqualFunc}
     * @param {*} first - First argument.
     * @param {*} second - Second argument.
     * @returns {EqualOutput} - Results of testing equality.
     */
    equalValueOf = (first, second) => {
      const val1 = first?.valueOf() ?? first;
      const val2 = second?.valueOf() ?? second;
      const equal = val1 === val2;
      return {
        equal: equal,
        details: 'Using valueOf()',
      };
    }

    /**
     * @implements {EqualFunc}
     * @param {*} first - First argument.
     * @param {*} second - Second argument.
     * @returns {EqualOutput} - Results of testing equality.
     */
    equalString = (first, second) => {
      let details = '';
      const equal = first === second;
      if (!equal) {
        let indicator = '';
        const len = Math.min(first.length, second.length);
        for (let idx = 0; idx < len; idx += 1) {
          const c1 = first.at(idx);
          const c2 = second.at(idx);
          if (c1 === c2) {
            indicator += ' ';
          } else {
            break;
          }
        }
        indicator += '|';
        details = `\n   1: ${first}\ndiff: ${indicator}\n   2: ${second}\n`;
      }
      return {
        equal: equal,
        details: details,
      };
    }

    /**
     * This currently only tests Object.entries().
     *
     * Order is ignored.
     *
     * Other tests, like frozen and sealed states may be implemented later.
     * @implements {EqualFunc}
     * @param {object} first - First argument.
     * @param {object} second - Second argument.
     * @returns {EqualOutput} - Results of testing equality.
     */
    equalObject = (first, second) => {
      const m1 = new Map(Object.entries(first));
      const m2 = new Map(Object.entries(second));
      return this.equalMap(m1, m2);
    }

    /**
     * @implements {EqualFunc}
     * @param {[*]} first - First argument.
     * @param {[*]} second - Second argument.
     * @returns {EqualOutput} - Results of testing equality.
     */
    equalArray = (first, second) => {
      let equal = true;
      const details = [];

      const len = Math.min(first.length, second.length);
      for (let idx = 0; idx < len; idx += 1) {
        const i1 = first.at(idx);
        const i2 = second.at(idx);
        const equalFunc = this.getEqualFunc(i1, i2);
        const result = equalFunc(i1, i2);
        if (!result.equal) {
          equal = false;
          details.push(
            '',
            `First difference at element ${idx}:`,
            this.repr(i1),
            this.repr(i2)
          );
          break;
        }
      }

      if (first.length !== second.length) {
        equal = false;
        const diff = Math.abs(first.length - second.length);
        const longest = first.length > second.length ? 'First' : 'Second';
        details.push(
          '',
          `${longest} array contains ${diff} more elements.`,
          `First additional element is at position ${len}:`,
          this.repr(first.at(len) ?? second.at(len))
        );
      }

      return {
        equal: equal,
        details: details.join('\n'),
      };
    }

    /**
     * Order is ignored.
     *
     * @implements {EqualFunc}
     * @param {Map<*,*>} first - First argument.
     * @param {Map<*,*>} second - Second argument.
     * @returns {EqualOutput} - Results of testing equality.
     */
    equalMap = (first, second) => {
      const m1 = this.#normalizeContainer(first);
      const m2 = this.#normalizeContainer(second);
      let equal = true;
      const differences = [];
      const missingFirst = [];
      const missingSecond = [];

      for (const [key, val1] of m1.entries()) {
        if (m2.has(key)) {
          const val2 = m2.get(key);
          if (val1 !== val2) {
            equal = false;
            differences.push(
              '',
              `Difference with key: ${key}`,
              `Value in first : ${val1}`,
              `Value in second: ${val2}`,
            );
          }
        } else {
          equal = false;
          missingSecond.push(
            '',
            `Key missing from second: ${key}`,
            `Value in first : ${val1}`,
          );
        }
      }
      for (const [key, val2] of m2.entries()) {
        if (!m1.has(key)) {
          equal = false;
          missingFirst.push(
            '',
            `Key missing from first : ${key}`,
            `Value in second: ${val2}`,
          );
        }
      }
      const details = [
        ...differences,
        ...missingFirst,
        ...missingSecond,
      ];

      return {
        equal: equal,
        details: details.join('\n'),
      };
    }

    /**
     * Order is ignored.
     *
     * @implements {EqualFunc}
     * @param {Set<*>} first - First argument.
     * @param {Set<*>} second - Second argument.
     * @returns {EqualOutput} - Results of testing equality.
     */
    equalSet = (first, second) => {
      const s1 = this.#normalizeContainer(first);
      const s2 = this.#normalizeContainer(second);

      let equal = true;
      const missingFirst = [];
      const missingSecond = [];

      for (const val of s1.values()) {
        if (!s2.has(val)) {
          equal = false;
          missingSecond.push(
            '',
            `Value missing from second: ${val}`,
          );
        }
      }
      for (const val of s2.values()) {
        if (!s1.has(val)) {
          equal = false;
          missingFirst.push(
            '',
            `Value missing from first : ${val}`,
          );
        }
      }
      const details = [
        ...missingFirst,
        ...missingSecond,
      ];

      return {
        equal: equal,
        details: details.join('\n'),
      };
    }

    #assertsCalled = 0;
    #assertsWithNoMsg = 0;
    #cleanups = [];
    #equalFuncs = new Map();
    #methodName
    #reprFuncs = new Map();

    /**
     * Count how many asserts are called per test method.
     *
     * Each *assertX()* method should call this first this along with its
     * optional *msg* parameter.
     * @param {string} msg - The message the assert method was given.
     */
    #countAsserts = (msg) => {
      this.#assertsCalled += 1;
      if (!msg) {
        this.#assertsWithNoMsg += 1;
      }
    }

    #checkAssertionCounts = () => {
      // How many asserts must exist in the test method before caring.
      const MIN_ASSERTS = 2;
      // How many asserts are allowed to be missing descriptions.
      const MAX_MISSING = 1;
      if (this.#assertsCalled >= MIN_ASSERTS &&
          this.#assertsWithNoMsg > MAX_MISSING) {
        // eslint-disable-next-line no-console
        console.debug('Too many asserts without descriptions!',
          this.id,
          this.#assertsWithNoMsg);
        if (testing.missingDescriptionsAreErrors) {
          this.fail(`Too many asserts without descriptions: ${this.id}`);
        }
      }
    }

    /**
     * Asserts that two arguments have the expected equality
     *
     * @param {*} first - First argument.
     * @param {*} second - Second argument.
     * @param {boolean} expected - Expectation of equality.
     * @param {string} [msg=''] - Text to complement the failure message.
     */
    #assertBase = (first, second, expected, msg) => {  // eslint-disable-line max-params
      const equal = this.getEqualFunc(first, second);
      const results = equal(first, second);
      const passed = results.equal === expected;
      if (!passed) {
        const badCmp = expected ? '!==' : '===';
        const s1 = this.repr(first);
        const s2 = this.repr(second);
        const failMsg = `${s1} ${badCmp} ${s2}`;
        if (!expected) {
          results.details = '';
        }
        this.#failMsgs(failMsg, results.details, msg);
      }
    }

    /**
     * Turn all keys and values in a container into a string via *repr()*.
     *
     * Containers must meet the following criteria:
     * + Have an *entries()* method that returns [key, value] pairs.
     * + Have at least one of *set(key, value)* or *add(value)* method.
     * + Support a constructor taking own type that results in a copy.
     *
     * @param {Map<*,*>|Set<*>} container - Or any type with similar
     * signatures.
     * @returns {Map<*,*>|Set<*>} - Clone of container with all keys and
     * values transformed into a string.
     */
    #normalizeContainer = (container) => {
      const clone = new (Object.getPrototypeOf(container)
        .constructor)(container);
      if (!clone.set) {
        clone.set = (k, v) => {
          clone.add(v);
        };
      }
      clone.clear();
      for (const [k, v] of container.entries()) {
        const newK = this.repr(k);
        const newV = this.repr(v);
        clone.set(newK, newV);
      }
      return clone;
    }

    /**
     * Immediately fail while combining messages.
     * @param {...string} messages - Messages to join.
     */
    #failMsgs = (...messages) => {
      const filtered = messages
        .filter(x => x)
        .map(x => String(x))
        .join(' : ');
      this.fail(filtered);
    }

  }

  /* eslint-disable no-array-constructor */
  /* eslint-disable no-new-wrappers */
  /* eslint-disable no-undef */
  /* eslint-disable no-undefined */
  /* eslint-disable require-jsdoc */
  class GetTypeTestCase extends TestCase {

    testPrimitives() {
      this.assertEqual(getType(0), 'Number', 'zero');
      this.assertEqual(getType(NaN), 'Number', 'Nan');
      this.assertEqual(getType('0'), 'String', '"0"');
      this.assertEqual(getType(true), 'Boolean', 'true');
      this.assertEqual(getType(false), 'Boolean', 'false');
      this.assertEqual(getType(BigInt('123')), 'BigInt', 'BigInt()');
      this.assertEqual(getType(456n), 'BigInt', '456n');
      this.assertEqual(getType(undefined), 'Undefined', 'undefined');
      this.assertEqual(getType(null), 'Null', 'null');
    }

    testBuiltInFunctionLike() {
      this.assertEqual(getType(String('xyzzy')), 'String', 'string-xyzzy');
      this.assertEqual(getType(new String('abc')), 'String', 'string-abc');
      this.assertEqual(getType(String), 'Function', 'bare String');
      this.assertEqual(getType(Symbol('xyzzy')), 'Symbol', 'symbol');
      this.assertEqual(getType(Symbol), 'Function', 'bare Symbol');
      this.assertEqual(getType(/abc123/u), 'RegExp', '/regexp/');
      this.assertEqual(getType(new Date()), 'Date', 'new Date');
      this.assertEqual(getType(Date()), 'String', 'Date()');
      this.assertEqual(getType(Date), 'class', 'bare Date');
      this.assertEqual(getType(Math.min), 'Function', 'math.min');
      this.assertEqual(getType(Math), 'Math', 'Math');
    }

    testBuiltinClasses() {
      this.assertEqual(getType({}), 'Object', '{}');
      this.assertEqual(getType([]), 'Array', '[]');
      this.assertEqual(getType(new Array()), 'Array', 'new array');
      this.assertEqual(getType(Array), 'class', 'bare Array');
      this.assertEqual(getType(new Map()), 'Map', 'map');
      this.assertEqual(getType(Map), 'class', 'bare Map');
      this.assertEqual(getType(new Set()), 'Set', 'set');
      this.assertEqual(getType(Set), 'class', 'bare Set');
      this.assertEqual(getType(new Error()), 'Error', 'error');
      this.assertEqual(getType(Error), 'class', 'bare Error');
    }

    testRegularClasses() {
      this.assertEqual(getType(TestCase), 'class', 'bare TestCase');
      this.assertEqual(getType(this), 'GetTypeTestCase', 'this');
      this.assertEqual(getType(getType), 'Function', 'bare getType');
      this.assertEqual(getType(TestCase.Skip), 'class', 'nested class');
    }

  }
  /* eslint-enable */

  testing.testCases.push(GetTypeTestCase);

  /* eslint-disable class-methods-use-this */
  /* eslint-disable no-magic-numbers */
  /* eslint-disable require-jsdoc */
  /**
   * For testing TestCase basic features.
   *
   * Do not use directly, but rather inside `TestCaseTestCase`.
   */
  class BasicFeaturesTestCase extends TestCase {

    static classCalls = [];

    /** Register cleanup functions.. */
    static setUpClassCleanups() {
      this.classCalls = [];
      this.addClassCleanup(this.one);
      this.addClassCleanup(this.two, 3, 4);
    }

    /** Capture that it was called. */
    static one() {
      this.classCalls.push('one');
    }

    /**
     * Capture that it was called with arguments.
     * @param {*} a - Anything.
     * @param {*} b - Anything.
     */
    static two(a, b) {
      this.classCalls.push('two', a, b);
    }

    testInstanceCleanups() {
      this.instanceCalls = [];
      this.addCleanup(this.three);
      this.addCleanup(this.four, 5, 6);
    }

    /** Capture that it was called. */
    three() {
      this.instanceCalls.push('three');
    }

    /**
     * Capture that it was called with arguments.
     * @param {*} a - Anything.
     * @param {*} b - Anything.
     */
    four(a, b) {
      this.instanceCalls.push('four', a, b);
    }

    testInstanceCleanupsWithError() {
      this.addCleanup(this.willError);
    }

    testInstanceCleanupsWithSkip() {
      this.addCleanup(this.willSkip);
    }

    testInstanceCleanupsWithFail() {
      this.addCleanup(this.willFail);
    }

    willError() {
      throw new Error('from willError');
    }

    willSkip() {
      this.skip('from willSkip');
    }

    willFail() {
      this.fail('from willFail');
    }

  }
  /* eslint-enable */

  /* eslint-disable max-lines-per-function */
  /* eslint-disable max-statements */
  /* eslint-disable no-array-constructor */
  /* eslint-disable no-empty-function */
  /* eslint-disable no-magic-numbers */
  /* eslint-disable no-new */
  /* eslint-disable no-new-wrappers */
  /* eslint-disable no-undef */
  /* eslint-disable no-undefined */
  /* eslint-disable no-unused-vars */
  /* eslint-disable require-jsdoc */
  class TestCaseTestCase extends TestCase {

    testCannotInstantiateDirectly() {
      this.assertRaises(TypeError, () => {
        new TestCase();
      });
    }

    testStaticSetUpClassExists() {
      this.assertNoRaises(() => {
        TestCase.setUpClass();
      });
    }

    testDoClassCleanups() {
      // Assemble
      BasicFeaturesTestCase.setUpClassCleanups();

      // Act
      BasicFeaturesTestCase.doClassCleanups();

      // Assert
      const actual = BasicFeaturesTestCase.classCalls;
      const expected = ['two', 3, 4, 'one'];
      this.assertEqual(actual, expected);
    }

    testId() {
      // Assemble
      const instance = new BasicFeaturesTestCase('testSomething');

      // Assert
      const actual = instance.id;
      const expected = 'BasicFeaturesTestCase.testSomething';
      this.assertEqual(actual, expected);
    }

    testDoInstanceCleanups() {
      // Assemble
      const method = 'testInstanceCleanups';
      const instance = new BasicFeaturesTestCase(method);

      // Act
      const result = instance.run();

      // Assert
      this.assertTrue(result.wasSuccessful(), 'success');
      // Next assert has timestamps in it.
      this.assertEqual(result.tests.size, 1, 'tests collected');
      const actual = instance.instanceCalls;
      const expected = ['four', 5, 6, 'three'];
      this.assertEqual(actual, expected, 'calls');
    }

    testDoInstanceCleanupsWithError() {
      // Assemble
      const method = 'testInstanceCleanupsWithError';
      const instance = new BasicFeaturesTestCase(method);

      // Act
      const result = instance.run();

      // Assert
      this.assertFalse(result.wasSuccessful(), 'success');
      // Next assert has timestamps in it.
      this.assertEqual(result.tests.size, 1, 'tests collected');
      this.assertEqual(
        result.errors,
        [
          {
            name: 'BasicFeaturesTestCase.doCleanups',
            error: 'Error',
            message: 'from willError',
          },
        ],
        'errors'
      );
    }

    testDoInstanceCleanupsWithSkip() {
      // Assemble
      const method = 'testInstanceCleanupsWithSkip';
      const instance = new BasicFeaturesTestCase(method);

      // Act
      const result = instance.run();

      // Assert
      this.assertFalse(result.wasSuccessful(), 'success');
      // Next assert has timestamps in it.
      this.assertEqual(result.tests.size, 1, 'tests collected');
      this.assertEqual(
        result.errors,
        [
          {
            name: 'BasicFeaturesTestCase.doCleanups',
            error: 'TestCase.Skip',
            message: 'from willSkip',
          },
        ],
        'errors'
      );
    }

    testDoInstanceCleanupsWithFail() {
      // Assemble
      const method = 'testInstanceCleanupsWithFail';
      const instance = new BasicFeaturesTestCase(method);

      // Act
      const result = instance.run();

      // Assert
      this.assertFalse(result.wasSuccessful(), 'success');
      // Next assert has timestamps in it.
      this.assertEqual(result.tests.size, 1, 'tests collected');
      this.assertEqual(
        result.errors,
        [
          {
            name: 'BasicFeaturesTestCase.doCleanups',
            error: 'TestCase.Fail',
            message: 'from willFail',
          },
        ],
        'errors'
      );
    }

    testCollectTests() {
      // Assemble
      const result = new TestResult();
      const methods = [
        'testInstanceCleanups',
        'testInstanceCleanupsWithError',
        'testInstanceCleanupsWithSkip',
        'testInstanceCleanupsWithFail',
      ];

      // Act
      for (const method of methods) {
        const instance = new BasicFeaturesTestCase(method);
        instance.run(result);
      }

      // Assert
      // Next assert has timestamps in it.
      this.assertEqual(result.tests.size, 4);
    }

    testSkip() {
      // Act/Assert
      this.assertRaisesRegExp(
        TestCase.Skip,
        /^$/u,
        () => {
          this.skip();
        },
        'basic skip'
      );

      // Act/Assert
      this.assertRaisesRegExp(
        TestCase.Skip,
        /a message/u,
        () => {
          this.skip('a message');
        },
        'with a message'
      );
    }

    testFail() {
      // Act/Assert
      this.assertRaisesRegExp(
        TestCase.Fail,
        /^$/u,
        () => {
          this.fail();
        },
        'no description'
      );

      // Act/Assert
      this.assertRaisesRegExp(
        TestCase.Fail,
        /for the masses/u,
        () => {
          this.fail('for the masses');
        },
        'with description'
      );
    }

    testGetReprFunc() {
      this.assertEqual(this.getReprFunc(null), String, 'null');
      this.assertEqual(this.getReprFunc(undefined), String, 'undefined');
      this.assertEqual(this.getReprFunc(1), String, 'number');
      this.assertEqual(this.getReprFunc(''), this.reprString, 'string');
      this.assertEqual(this.getReprFunc([]), this.reprArray, 'array');
      this.assertEqual(this.getReprFunc({}), this.reprObject, 'object');
      this.assertEqual(this.getReprFunc(new Map()), this.reprMap, 'map');
      this.assertEqual(this.getReprFunc(new Set()), this.reprSet, 'set');
    }

    testChangingDefaultRepr() {
      // Assemble
      function x() {}

      // Act
      this.defaultRepr = x;

      // Assert
      this.assertEqual(this.getReprFunc(null), x, 'null');
      this.assertEqual(this.getReprFunc(undefined), x, 'undefined');
      this.assertEqual(this.getReprFunc(1), x, 'number');
      this.assertEqual(this.getReprFunc(''), this.reprString, 'string');
      this.assertEqual(this.getReprFunc([]), this.reprArray, 'array');
      this.assertEqual(this.getReprFunc({}), this.reprObject, 'object');
      this.assertEqual(this.getReprFunc(new Map()), this.reprMap, 'map');
      this.assertEqual(this.getReprFunc(new Set()), this.reprSet, 'set');
    }

    testAddReprFunc() {
      // Assemble
      class C {}
      const c = new C();
      function reprC(item) {}

      this.assertNotEqual(this.getReprFunc(c), reprC, 'no reprC');

      // Act
      this.addReprFunc('C', reprC);

      // Assert
      this.assertEqual(this.getReprFunc(c), reprC, 'found reprC');
      this.assertEqual(this.getReprFunc(null), String, 'null');
      this.assertEqual(this.getReprFunc(undefined), String, 'undefined');
      this.assertEqual(this.getReprFunc(1), String, 'number');
      this.assertEqual(this.getReprFunc(''), this.reprString, 'string');
      this.assertEqual(
        this.getReprFunc(new String('str')), this.reprString, 'new string'
      );
      this.assertEqual(this.getReprFunc([]), this.reprArray, 'array');
      this.assertEqual(
        this.getReprFunc(new Array(1, 2, 3)), this.reprArray, 'new array'
      );
      this.assertEqual(this.getReprFunc({}), this.reprObject, 'object');
      this.assertEqual(this.getReprFunc(new Map()), this.reprMap, 'map');
      this.assertEqual(this.getReprFunc(new Set()), this.reprSet, 'set');
    }

    testReprPrimitives() {
      this.assertEqual(this.repr(1), '1', 'number');
      this.assertEqual(this.repr(null), 'null', 'null');
      this.assertEqual(this.repr(undefined), 'undefined', 'undefined');
      this.assertEqual(
        this.repr(Symbol('qwerty')),
        'Symbol(qwerty)',
        'symbol'
      );
    }

    testReprString() {
      this.assertEqual(this.repr('a. b'), '"a. b"', 'string');
      this.assertEqual(this.repr(new String('xyz')), '"xyz"', 'new string');
    }

    testReprArray() {
      this.assertEqual(this.repr(['b', 2]), '["b", 2]', 'mixed array');
      this.assertEqual(
        this.repr(['b', [1, '2']]),
        '["b", [1, "2"]]',
        'nested array'
      );
      this.assertEqual(
        this.repr(new Array(1, '2', 'three')),
        '[1, "2", "three"]',
        'new array'
      );
    }

    testReprObject() {
      this.assertEqual(this.repr({a: '1'}), '{"a": "1"}', 'simple');
      this.assertEqual(
        this.repr({b: {c: 'd', e: 1}}),
        '{"b": {"c": "d", "e": 1}}',
        'nested'
      );
    }

    testReprMap() {
      this.assertEqual(this.repr(new Map()), 'Map([])', 'empty');
      this.assertEqual(
        this.repr(new Map([])),
        'Map([])',
        'empty init'
      );
      this.assertEqual(
        this.repr(new Map([[1, 'one'], ['two', 2]])),
        'Map([[1, "one"], ["two", 2]])',
        'with items'
      );
      this.assertEqual(
        this.repr(new Map([[1, 'one'], ['map', new Map([['x', 3]])]])),
        'Map([[1, "one"], ["map", Map([["x", 3]])]])',
        'nested'
      );
    }

    testReprSet() {
      this.assertEqual(this.repr(new Set()), 'Set([])', 'empty');
      this.assertEqual(
        this.repr(new Set([])),
        'Set([])',
        'empty init'
      );
      this.assertEqual(
        this.repr(new Set([1, 'b', 'b', 'xyz', 99])),
        'Set([1, "b", "xyz", 99])',
        'with items'
      );
      this.assertEqual(
        this.repr(new Set([1, new Set(['x', 3]), 'qqq'])),
        'Set([1, Set(["x", 3]), "qqq"])',
        'nested'
      );
    }

    testGetEqualFunc() {
      this.assertEqual(
        this.getEqualFunc({}, []),
        this.equalEqEqEq,
        'obj vs array'
      );
      this.assertEqual(
        this.getEqualFunc('a', 'b'),
        this.equalString,
        'str vs str'
      );
      this.assertEqual(
        this.getEqualFunc('a', new String('b')),
        this.equalString,
        'str vs new str'
      );
    }

    testChangingDefaultEqual() {
      // Assemble
      this.assertEqual(this.getEqualFunc({}, []), this.equalEqEqEq, '===');
      this.defaultEqual = this.equalValueOf;

      // Act/Assert
      this.assertEqual(
        this.getEqualFunc({}, []),
        this.equalValueOf,
        'valueOf'
      );
    }

    testAddEqualFunc() {
      // Assemble
      class C {}
      const c = new C();
      function equalC(first, second) {}

      this.assertNotEqual(this.getEqualFunc(c, c), equalC, 'not equalC');

      // Act
      this.addEqualFunc(getType(c), equalC);

      // Assert
      this.assertEqual(this.getEqualFunc(c, c), equalC, 'found equalC');
    }

    testAssertEqualPrimitives() {
      this.assertEqual(0, 0, '0 vs 0');
      this.assertEqual(42, 42, 'number vs number');
      this.assertEqual(true, true, 'true vs true');
      this.assertEqual(false, false, 'false vs false');
      this.assertEqual(
        BigInt('123456789'),
        BigInt('123456789'),
        'bigint vs bigint'
      );
      this.assertEqual(undefined, {}.undef, 'undefined vs undef');
      this.assertEqual(null, null, 'null vs null');

      const bar = Symbol('bar');
      this.assertEqual(bar, bar, 'same symbol');

      // Equivalent Symbols cannot be equal.
      this.assertRaisesRegExp(
        TestCase.Fail,
        /^Symbol.foo. !== Symbol.foo.$/u,
        () => {
          this.assertEqual(Symbol('foo'), Symbol('foo'));
        },
        'different, but equiv symbols'
      );
    }

    testAssertEqualValueOf() {
      // Assemble
      class Silly extends Number {}

      const n = new Number(3);
      const s = new Silly(3);

      this.assertNotEqual(n, s, 'before');

      // Act
      this.defaultEqual = this.equalValueOf;

      // Assert
      this.assertEqual(n, s, 'after');
    }

    testAssertEqualPrimitivesWithValueOf() {
      this.defaultEqual = this.equalValueOf;

      this.assertEqual(0, 0, '0 vs 0');
      this.assertEqual(42, 42, 'number vs number');
      this.assertEqual(true, true, 'true vs true');
      this.assertEqual(false, false, 'false vs false');
      this.assertEqual(
        BigInt('123456789'),
        BigInt('123456789'),
        'bigint vs bigint'
      );
      this.assertEqual(undefined, {}.undef, 'undefined vs undef');
      this.assertEqual(null, null, 'null vs null');

      const bar = Symbol('bar');
      this.assertEqual(bar, bar, 'same symbol');

      // Equivalent Symbols cannot be equal, even with valueOf().
      this.assertRaisesRegExp(
        TestCase.Fail,
        /^Symbol.foo. !== Symbol.foo. : Using valueOf/u,
        () => {
          this.assertEqual(Symbol('foo'), Symbol('foo'));
        },
        'different, but equiv symbols'
      );
    }

    testAssertEqualFailureMessages() {
      this.assertRaisesRegExp(
        TestCase.Fail,
        /^\{\} !== \[\] :/u,
        () => {
          this.assertEqual({}, [], 'assert under test');
        },
        'obj vs array'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /^undefined !== null :/u,
        () => {
          this.assertEqual(undefined, null, 'assert under test');
        },
        'undefined vs null'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /^0 !== "0" :/u,
        () => {
          this.assertEqual(0, '0', 'assert under test');
        },
        'number vs string of same'
      );
    }

    // Old version of eslint does not know BigInt.
    /* eslint-disable no-undef */
    testAssertNotEqualPrimitives() {
      this.assertNotEqual(NaN, NaN, 'NaN');
      this.assertNotEqual(true, false, 'true/false');
      this.assertNotEqual(false, true, 'false/true');
      this.assertNotEqual(BigInt('12345678'), BigInt('123456789'), 'BigInt');
      this.assertNotEqual(undefined, null, 'undef/null');
      this.assertNotEqual(Symbol('foo'), Symbol('foo'), 'symbols');
    }

    testAssertNotEqualFailureMessages() {
      this.assertRaisesRegExp(TestCase.Fail,
        /^0 === 0 : assert under test$/u,
        () => {
          this.assertNotEqual(0, 0, 'assert under test');
        }, '0 vs 0');

      this.assertRaisesRegExp(TestCase.Fail,
        /^undefined === undefined :/u,
        () => {
          this.assertNotEqual(undefined, undefined, 'assert under test');
        }, 'undefined vs undefined');

      this.assertRaisesRegExp(TestCase.Fail,
        /^null === null :/u,
        () => {
          this.assertNotEqual(null, null, 'assert under test');
        }, 'null vs null');

      this.assertRaisesRegExp(TestCase.Fail,
        /^Symbol\(sym\) === Symbol\(sym\) :/u,
        () => {
          const sym = Symbol('sym');
          this.assertNotEqual(sym, sym, 'assert under test');
        }, 'symbol vs self');

      this.assertRaisesRegExp(
        TestCase.Fail,
        /"a" === "a" :/u,
        () => {
          this.assertNotEqual('a', 'a', 'assert under test');
        },
        'str vs str'
      );
    }

    testEqualString() {
      let expected = '';

      this.assertEqual(this.getEqualFunc('a', 'b'),
        this.equalString,
        'equalFunc');
      this.assertEqual('string', 'string', 'str === str');
      this.assertNotEqual('string 1', 'string 2', 'str !== str');

      expected = `"abc1234" !== "abc123" :[ ]
   1: abc1234
diff:       |
   2: abc123`;
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual('abc1234', 'abc123', 'assert under test');
        },
        'first longer',
      );

      expected = `"abcd" !== "abxd" :[ ]
   1: abcd
diff:   |
   2: abxd`;
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual('abcd', 'abxd', 'assert under test');
        },
        'diff in middle'
      );

      expected += '\n : extra';
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual('abcd', 'abxd', 'extra');
        },
        'diff in middle with description'
      );
    }

    testEqualObject() {
      let o1 = {};
      let o2 = {};
      let expected = '';
      const sym = Symbol('xyzzy');

      this.assertEqual(this.getEqualFunc({}, {a: 1}),
        this.equalObject,
        'equalFunc');

      o1 = {};
      o2 = {};
      this.assertEqual(o1, o2, 'empty');

      o1 = {1: 'a', b: 2};
      o2 = {b: 2, 1: 'a'};
      this.assertEqual(o1, o2, 'different order');

      o1 = {1: 1, 2: {a: 42}};
      o2 = {1: 1, 2: {a: 42}};
      this.assertEqual(o1, o2, 'nested');

      o1 = {sym: 'foo'};
      o2 = {sym: 'foo'};
      this.assertEqual(o1, o2, 'symbol');

      o1 = {1: 'a', b: 2};
      o2 = {b: 2};
      this.assertNotEqual(o1, o2, 'first has more');
      this.assertNotEqual(o2, o1, 'second has more');

      o1 = {1: 'a'};
      o2 = {1: 'b'};
      this.assertNotEqual(o1, o2, 'different values');

      o1 = {21: 'b'};
      o2 = {21: 'a'};
      expected = `\\{"21": "b"\\} !== \\{"21": "a"\\} :[ ]
Difference with key: "21"
Value in first : "b"
Value in second: "a"`;
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual(o1, o2, 'assert under test');
        },
        'same key, different values'
      );

      o1 = {1: 'a', 3: 'c', q: 86, null: 'abc', sym: 'x'};
      o2 = {1: 'a', 2: 'b', q: 99, null: 54321, sym: 'y'};
      expected = ` :[ ]
Difference with key: "q"
Value in first : 86
Value in second: 99

Difference with key: "null"
Value in first : "abc"
Value in second: 54321

Difference with key: "sym"
Value in first : "x"
Value in second: "y"

Key missing from first : "2"
Value in second: "b"

Key missing from second: "3"
Value in first : "c"`;
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual(o1, o2, 'assert under test');
        },
        'bit of everything',
      );

      o1 = {1: 1, 2: {a: 42}};
      o2 = {1: 1, 2: {a: 43}};
      expected = ` :[ ]
Difference with key: "2"
Value in first : \\{"a": 42\\}
Value in second: \\{"a": 43\\}`;
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual(o1, o2, 'assert under test');
        },
        'nested, different',
      );
    }

    testEqualArray() {
      let expected = '';

      this.assertEqual(this.getEqualFunc([1], [2, 3]),
        this.equalArray,
        'equalFunc');
      this.assertEqual([], [], 'empty');
      this.assertEqual([1, 'a'], [1, 'a'], 'mixed');
      this.assertEqual([1, [2, 3]], [1, [2, 3]], 'nested');
      this.assertNotEqual([0], [1], 'simple notequal');
      this.assertNotEqual([], [1], 'different lengths');

      expected = ` !== .* :[ ]
First difference at element 1:
1
2`;
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual([0, 1], [0, 2], 'assert under test');
        },
        'simple unequal'
      );

      expected = ` :[ ]
First array contains 1 more elements.
First additional element is at position 1:
"xyzzy"`;
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual([3, 'xyzzy'], [3], 'assert under test');
        },
        'first longer'
      );

      expected = ` :[ ]
Second array contains 1 more elements.
First additional element is at position 2:
"asdf"`;
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual([1, 2], [1, 2, 'asdf'], 'assert under test');
        },
        'second longer'
      );

      expected = ` :[ ]
First difference at element 1:
3
2

Second array contains 1 more elements.
First additional element is at position 2:
"asdf"`;
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual([1, 3], [1, 2, 'asdf'], 'assert under test');
        },
        'different element and sizes'
      );

      expected = ` :[ ]
First difference at element 2:
\\[1, 2\\]
\\[1, 3\\]`;
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual(
            [-1, 0, [1, 2]], [-1, 0, [1, 3]], 'assert under test'
          );
        },
        'nested unequal'
      );
    }

    testEqualMap() {
      let m1 = new Map();
      let m2 = new Map();
      let expected = '';

      this.assertEqual(this.getEqualFunc(m1, m2), this.equalMap, 'equalFunc');
      this.assertEqual(m1, m2, 'empty');

      m1 = new Map([[1, 'a'], ['b', 2]]);
      m2 = new Map([['b', 2], [1, 'a']]);
      this.assertEqual(m1, m2, 'different order');

      m1 = new Map([[1, 'a'], [2, new Map([['a', 42]])]]);
      m2 = new Map([[1, 'a'], [2, new Map([['a', 42]])]]);
      this.assertEqual(m1, m2, 'nested');

      m1 = new Map([[1, 'a'], ['b', 2]]);
      m2 = new Map([[1, 'a']]);
      this.assertNotEqual(m1, m2, 'first has more');
      this.assertNotEqual(m2, m1, 'second has more');

      m1 = new Map([[1, 'b']]);
      m2 = new Map([[1, 'a']]);
      this.assertNotEqual(m1, m2, 'different values');

      m1 = new Map([[19, 'a']]);
      m2 = new Map([[19, 'b']]);
      expected = ` !== .* :[ ]
Difference with key: 19
Value in first : "a"
Value in second: "b"`;
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual(m1, m2, 'assert under test');
        },
        'same key, different values'
      );

      m1 = new Map([[1, 'a']]);
      m2 = new Map([[1, 'a'], ['b', 42]]);
      expected = ` :[ ]
Key missing from first : "b"
Value in second: 42`;
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual(m1, m2, 'assert under test');
        },
        'second has extra key'
      );

      m1 = new Map([[1, 'a'], ['b', 42]]);
      m2 = new Map([[1, 'a']]);
      expected = ` :[ ]
Key missing from second: "b"
Value in first : 42`;
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual(m1, m2, 'assert under test');
        },
        'first has extra key'
      );

      m1 = new Map([[1, 'a'], [3, 'c'], ['q', 86], [null, 'abc'], [{}, 'x']]);
      m2 = new Map([[1, 'a'], [2, 'b'], ['q', 99], [null, 54321], [{}, 'y']]);
      expected = ` !== .* :[ ]
Difference with key: "q"
Value in first : 86
Value in second: 99

Difference with key: null
Value in first : "abc"
Value in second: 54321

Difference with key: \\{\\}
Value in first : "x"
Value in second: "y"

Key missing from first : 2
Value in second: "b"

Key missing from second: 3
Value in first : "c"`;
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual(m1, m2, 'assert under test');
        },
        'bit of everything'
      );

      expected = ` :[ ]
Difference with key: 2
Value in first : Map\\(\\[\\["a", 42\\]\\]\\)
Value in second: Map\\(\\[\\["a", 43\\]\\]\\)`;
      m1 = new Map([[1, 'a'], [2, new Map([['a', 42]])]]);
      m2 = new Map([[1, 'a'], [2, new Map([['a', 43]])]]);
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual(m1, m2, 'assert under test');
        },
        'nested different'
      );
    }

    testEqualSet() {
      let s1 = new Set();
      let s2 = new Set();
      let expected = '';

      this.assertEqual(this.getEqualFunc(s1, s2), this.equalSet, 'equalFunc');
      this.assertEqual(s1, s2, 'empty');

      s1 = new Set([1, 'a']);
      s2 = new Set(['a', 1]);
      this.assertEqual(s1, s2, 'different order');

      s1 = new Set([1, new Set(['a', 42])]);
      s2 = new Set([1, new Set(['a', 42])]);
      this.assertEqual(s1, s2, 'nested');

      s1 = new Set([1, 'a', 'xyz']);
      s2 = new Set([1, 'a']);
      this.assertNotEqual(s1, s2, 'first has more');
      this.assertNotEqual(s2, s1, 'second has more');

      s1 = new Set([1]);
      s2 = new Set([2]);
      this.assertNotEqual(s1, s2, 'different values');

      s1 = new Set([1, 2]);
      s2 = new Set([2, 'three']);
      expected = `Set\\(\\[1, 2\\]\\) !== Set\\(\\[2, "three"\\]\\) :[ ]
Value missing from first : "three"

Value missing from second: 1`;
      this.assertRaisesRegExp(
        TestCase.Fail,
        RegExp(expected, 'u'),
        () => {
          this.assertEqual(s1, s2);
        },
        'bit of everything'
      );
    }

    testAssertTrue() {
      this.assertTrue(true, 'boolean');
      this.assertTrue(1, 'one');
      this.assertTrue(' ', 'single space');
      this.assertTrue({}, 'empty object');
      this.assertTrue([], 'empty array');
      this.assertTrue(Symbol('true'), 'symbol');

      this.assertRaisesRegExp(
        TestCase.Fail,
        /false is not true/u,
        () => {
          this.assertTrue(false, 'assert under test');
        }, 'testing false'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /0 is not true/u,
        () => {
          this.assertTrue(0, 'assert under test');
        }, 'testing zero'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /^0 is not true : xyzzy$/u,
        () => {
          this.assertTrue(0, 'xyzzy');
        },
        'testing with description as string'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /^undefined is not true : Symbol\(xyzzy\)$/u,
        () => {
          this.assertTrue(undefined, Symbol('xyzzy'));
        },
        'testing with description as symbol'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /^null is not true$/u,
        () => {
          this.assertTrue(null, false);
        },
        'testing with description as boolean'
      );
    }

    testAssertFalse() {
      this.assertFalse(false, 'boolean');
      this.assertFalse(0, 'zero');
      this.assertFalse('', 'empty string');

      this.assertRaisesRegExp(
        TestCase.Fail,
        /true is not false/u,
        () => {
          this.assertFalse(true, 'assert under test');
        },
        'testing true'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /-1 is not false/u,
        () => {
          this.assertFalse(-1, 'assert under test');
        },
        'testing -1'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /\{\} is not false/u,
        () => {
          this.assertFalse({}, 'assert under test');
        },
        'testing Boolean({})'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /^\[\] is not false : abc123$/u,
        () => {
          this.assertFalse([], 'abc123');
        },
        'testing array'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /Symbol\(bar\) is not false/u,
        () => {
          this.assertFalse(Symbol('bar'), 'assert under test');
        },
        'testing symbol'
      );
    }

    testAssertRaises() {
      this.assertRaises(
        Error,
        () => {
          throw new Error();
        },
        'empty Error'
      );

      this.assertRaises(
        Error,
        () => {
          throw new Error('with a message');
        },
        'Error with message'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /caught nothing/u,
        () => {
          this.assertRaises(Error, () => {}, 'assert under test');
        },
        'caught nothing'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /TypeError.* Error/u,
        () => {
          this.assertRaises(
            TypeError,
            () => {
              throw new Error();
            },
            'assert under test'
          );
        },
        'regexp, empty Error, no description'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        / : hovercraft/u,
        () => {
          this.assertRaises(TypeError,
            () => {
              throw new Error();
            },
            'hovercraft full of eels');
        },
        'regexp, empty error, with eels'
      );
    }

    testAssertNoRaises() {
      this.assertNoRaises(() => {
      });

      this.assertRaisesRegExp(
        TestCase.Fail,
        /^Unexpected exception:.*threw an error/u,
        () => {
          this.assertNoRaises(() => {
            throw new Error('This function threw an error');
          }, 'assert under test');
        },
        'basic error'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /^Unexpected exception:.*: custom text/u,
        () => {
          this.assertNoRaises(() => {
            throw new Error('Bad function.  No cookie.');
          }, 'custom text');
        },
        'with descriptive text'
      );
    }

    testAssertRaisesRegExp() {
      this.assertRaisesRegExp(
        Error,
        /xyzzy/u,
        () => {
          throw new Error('xyzzy');
        },
        'match text in exception'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /caught nothing/u,
        () => {
          this.assertRaisesRegExp(
            Error,
            /.*/u,
            () => {},
            'assert under test'
          );
        },
        'no error raise, caught nothing'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        / : my message/u,
        () => {
          this.assertRaisesRegExp(
            Error,
            /.*/u,
            () => {},
            'my message'
          );
        },
        'matched description'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /Expected TypeError/u,
        () => {
          this.assertRaisesRegExp(
            TypeError,
            /message/u,
            () => {
              throw new Error('message');
            },
            'assert under test'
          );
        },
        'wrong exception thrown'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        /did not match regular expression/u,
        () => {
          this.assertRaisesRegExp(
            Error,
            /message/u,
            () => {
              throw new Error('xyzzy');
            },
            'assert under test'
          );
        },
        'wrong regexp'
      );
    }

    testAssertRegExp() {
      this.assertRegExp('abc', /ab./u, 'basic match');

      this.assertRaisesRegExp(
        TestCase.Fail,
        /Target.*did not match regular expression/u,
        () => {
          this.assertRegExp('abc', /ab.d/u, 'assert under test');
        },
        'should not match'
      );

      this.assertRaisesRegExp(
        TestCase.Fail,
        / : what do you expect/u,
        () => {
          this.assertRegExp('abc', /xyz/u, 'what do you expect');
        },
        'testing descriptive message'
      );
    }

  }
  /* eslint-enable */

  testing.testCases.push(TestCaseTestCase);

  /* eslint-disable max-lines-per-function */
  /* eslint-disable no-magic-numbers */
  /* eslint-disable require-jsdoc */
  class TestResultTestCase extends TestCase {

    setUp() {
      this.result = new TestResult();
    }

    testAddSuccess() {
      this.assertEqual(this.result.successes, [], 'paranoia check');

      // Act
      this.result.addSuccess('TestClass.testMethod');
      this.result.addSuccess('TestClass.testMethod');

      // Assert
      this.assertEqual(
        this.result.successes,
        ['TestClass.testMethod', 'TestClass.testMethod'],
        'real check'
      );
    }

    testAddError() {
      this.assertEqual(this.result.errors, [], 'paranoia check');

      // Act
      this.result.addError('name1', new Error('first message'));
      this.result.addError('name2', new TypeError('second message'));
      this.result.addError('name3', new Error('third message'));

      // Assert
      const actual = this.result.errors;
      const expected = [
        {name: 'name1', error: 'Error', message: 'first message'},
        {name: 'name2', error: 'TypeError', message: 'second message'},
        {name: 'name3', error: 'Error', message: 'third message'},
      ];
      this.assertEqual(actual, expected, 'real check');
    }

    testAddFailure() {
      this.assertEqual(this.result.failures, [], 'paranoia check');

      // Act
      this.result.addFailure('method1', 'a message');
      this.result.addFailure('method2', 'another message');

      // Assert
      const actual = this.result.failures;
      const expected = [
        {name: 'method1', message: 'a message'},
        {name: 'method2', message: 'another message'},
      ];
      this.assertEqual(actual, expected, 'real check');
    }

    testAddSkip() {
      this.assertEqual(this.result.skipped, [], 'paranoia check');

      // Act
      this.result.addSkip('Skip.Skip', 'skip to my lou');
      this.result.addSkip('Skip.Skip', 'skip to my lou');
      this.result.addSkip('Skip.ToMyLou', 'my darling');

      // Assert
      const actual = this.result.skipped;
      const expected = [
        {name: 'Skip.Skip', message: 'skip to my lou'},
        {name: 'Skip.Skip', message: 'skip to my lou'},
        {name: 'Skip.ToMyLou', message: 'my darling'},
      ];
      this.assertEqual(actual, expected, 'real check');
    }

    testStartStop() {
      // Act
      this.result.startTest('Foo.testSomething');
      this.result.startTest('Foo.testOrTheOther');
      this.result.stopTest('Foo.testSomething');

      // Assert
      this.assertEqual(this.result.tests.size, 2, 'tests ran');
      this.assertTrue(this.result.tests.get('Foo.testSomething').start,
        'first start');
      this.assertTrue(this.result.tests.get('Foo.testSomething').stop,
        'first stop');
      this.assertTrue(this.result.tests.get('Foo.testOrTheOther').start,
        'second start');
      this.assertFalse(this.result.tests.get('Foo.testOrTheOther').stop,
        'second stop');
    }

    testWasSuccessful() {
      this.assertTrue(this.result.wasSuccessful(), 'no results is a pass');

      this.result.addSuccess('Class.method');
      this.assertTrue(this.result.wasSuccessful(), 'new success is a pass');

      this.result.addSkip('Class.differentMethod', 'rocks');
      this.assertTrue(this.result.wasSuccessful(), 'a skip is a pass');

      this.result.addError('NewClass.method', new Error());
      this.assertFalse(this.result.wasSuccessful(), 'an error is not a pass');

      const result = new TestResult();

      this.assertTrue(result.wasSuccessful(), 'paranoia check');

      result.addFailure('NewClass.failedMethod', 'oops');
      this.assertFalse(result.wasSuccessful(), 'a failure is not a pass');
    }

    testSummary() {
      const result = new TestResult();

      this.assertEqual(
        result.summary(),
        [
          'total : 0',
          'successes : 0',
          'skipped : 0',
          'errors : 0',
          'failures : 0',
        ],
        'empty, no formatting'
      );

      this.assertEqual(
        result.summary(true),
        [
          'total     : 0',
          'successes : 0',
          'skipped   : 0',
          'errors    : 0',
          'failures  : 0',
        ],
        'empty, with formatting'
      );

      for (let i = 0; i < 100; i += 1) {
        const currentMethod = `test-${i}`;
        result.startTest(currentMethod);
        if (i % 17 === 0) {
          result.addError(currentMethod, new Error(`oops-${i}`));
        } else if (i % 19 === 0) {
          result.addFailure(currentMethod, `failed ${i}`);
        } else if (i % 37 === 0) {
          result.addSkip(currentMethod, `skip ${i}`);
        } else {
          result.addSuccess(currentMethod);
        }
        result.stopTest(currentMethod);
      }

      this.assertEqual(
        result.summary(),
        [
          'total : 100',
          'successes : 87',
          'skipped : 2',
          'errors : 6',
          'failures : 5',
        ],
        'full, no formatting'
      );

      this.assertEqual(
        result.summary(true),
        [
          'total     : 100',
          'successes :  87',
          'skipped   :   2',
          'errors    :   6',
          'failures  :   5',
        ],
        'full, with formatting'
      );

      for (let i = 0; i < 1000; i += 1) {
        const currentMethod = `test-${i}`;
        result.addFailure(currentMethod, `failed group 2 ${i}`);
      }

      this.assertEqual(
        result.summary(),
        [
          'total : 100',
          'successes : 87',
          'skipped : 2',
          'errors : 6',
          'failures : 1005',
        ],
        'extra failures, no formatting'
      );

      this.assertEqual(
        result.summary(true),
        [
          'total     :  100',
          'successes :   87',
          'skipped   :    2',
          'errors    :    6',
          'failures  : 1005',
        ],
        'extra, with formatting'
      );
    }

  }
  /* eslint-enable */

  testing.testCases.push(TestResultTestCase);

  /** Assembles and drives execution of {@link TestCase}s. */
  class TestRunner {

    /** @param {function(): TestCase} tests - TestCases to execute. */
    constructor(tests) {
      const badKlasses = [];
      const testMethods = [];
      for (const klass of tests) {
        if (klass.prototype instanceof TestCase) {
          testMethods.push(...this.#extractTestMethods(klass));
        } else {
          badKlasses.push(klass);
        }
      }
      if (badKlasses.length) {
        const msg = `Bad class count: ${badKlasses.length}`;
        for (const klass of badKlasses) {
          // eslint-disable-next-line no-console
          console.error('Not a TestCase:', klass);
        }
        throw new TypeError(`Bad classes: ${msg}`);
      }

      this.#tests = testMethods;
    }

    /**
     * Run each test method in turn.
     * @returns {TestResult} - Collected results.
     */
    runTests() {
      const result = new TestResult();

      let lastKlass = null;
      let doRunTests = true;
      for (const {klass, method} of this.#tests) {
        if (klass !== lastKlass) {
          this.#doClassCleanups(lastKlass, result);
          doRunTests = this.#doSetUpClass(klass, result);
        }
        lastKlass = klass;

        if (doRunTests) {
          this.#doRunTestMethod(klass, method, result);
        }
      }

      this.#doClassCleanups(lastKlass, result);

      return result;
    }

    #tests

    /** @param {function(): TestCase} klass - TestCase to process. */
    #extractTestMethods = function *extractTestMethods(klass) {
      let obj = klass;
      while (obj) {
        if (obj.prototype instanceof TestCase) {
          for (const prop of Object.getOwnPropertyNames(obj.prototype)) {
            if (prop.startsWith('test')) {
              yield {klass: klass, method: prop};
            }
          }
        }
        obj = Object.getPrototypeOf(obj);
      }
    }

    /**
     * @param {function(): TestCase} klass - TestCase to process.
     * @param {TestResult} result - Result to use if any errors.
     */
    #doClassCleanups = (klass, result) => {
      if (klass) {
        const currentMethod = `${klass.name}.doClassCleanups`;
        try {
          klass.doClassCleanups();
        } catch (e) {
          result.addError(currentMethod, e);
        }
      }
    }

    /**
     * @param {function(): TestCase} klass - TestCase to process.
     * @param {TestResult} result - Result to use if any errors.
     * @returns {boolean} - Indicates success of calling setUpClass().
     */
    #doSetUpClass = (klass, result) => {
      const currentMethod = `${klass.name}.setUpClass`;
      try {
        klass.setUpClass();
      } catch (e) {
        if (e instanceof TestCase.Skip) {
          result.addSkip(currentMethod, e.message);
        } else {
          result.addError(currentMethod, e);
        }
        return false;
      }
      return true;
    }

    /**
     * @param {function(): TestCase} Klass - TestCase to process.
     * @param {string} methodName - Name of the test method to execute.
     * @param {TestResult} result - Result of the execution.
     */
    #doRunTestMethod = (Klass, methodName, result) => {
      const instance = new Klass(methodName);
      instance.run(result);
    }

  }

  /* eslint-disable class-methods-use-this */
  /* eslint-disable no-empty-function */
  /* eslint-disable require-jsdoc */
  /**
   * TestCases require at least one test method to get instantiated by {@link
   * TestRunner}
   */
  class DummyMethodTestCase extends TestCase {

    testDummy() {}

  }
  /* eslint-enable */

  /* eslint-disable class-methods-use-this */
  /* eslint-disable max-lines-per-function */
  /* eslint-disable no-empty-function */
  /* eslint-disable no-magic-numbers */
  /* eslint-disable no-new */
  /* eslint-disable require-jsdoc */
  class TestRunnerTestCase extends TestCase {

    testNoClasses() {
      // Assemble
      const runner = new TestRunner([]);

      // Act
      const result = runner.runTests();

      // Assert
      this.assertTrue(result.wasSuccessful());
    }

    testBadClasses() {
      this.assertRaisesRegExp(TypeError, /Bad class count: 2$/u, () => {
        new TestRunner([Error, TestRunnerTestCase, TypeError]);
      });
    }

    testStrangeClassSetup() {
      // Assemble
      class ClassSetupErrorTestCase extends DummyMethodTestCase {

        static setUpClass() {
          throw new Error('erroring');
        }

      }

      class ClassSetupFailTestCase extends DummyMethodTestCase {

        static setUpClass() {
          throw new this.Fail('failing');
        }

      }

      class ClassSetupSkipTestCase extends DummyMethodTestCase {

        static setUpClass() {
          throw new this.Skip('skipping');
        }

      }

      const classes = [
        DummyMethodTestCase,
        ClassSetupErrorTestCase,
        ClassSetupFailTestCase,
        ClassSetupSkipTestCase,
      ];
      const runner = new TestRunner(classes);

      // Act
      const result = runner.runTests();

      // Assert
      this.assertFalse(result.wasSuccessful());

      // In setUpClass, TestCase.Fail should count as an error
      this.assertEqual(
        result.successes,
        ['DummyMethodTestCase.testDummy'],
        'successes'
      );
      this.assertEqual(
        result.errors,
        [
          {
            name: 'ClassSetupErrorTestCase.setUpClass',
            error: 'Error',
            message: 'erroring',
          },
          {
            name: 'ClassSetupFailTestCase.setUpClass',
            error: 'TestCase.Fail',
            message: 'failing',
          },
        ],
        'errors'
      );
      this.assertEqual(result.failures, [], 'failures');
      this.assertEqual(
        result.skipped,
        [{name: 'ClassSetupSkipTestCase.setUpClass', message: 'skipping'}],
        'skipped'
      );
    }

    testStrangeClassCleanups() {
      // Assemble
      class BaseClassCleanupTestCase extends DummyMethodTestCase {

        static setUpClass() {
          this.addClassCleanup(this.cleanupFunc);
        }

        static cleanupFunc() {}

      }
      class CleanupErrorTestCase extends BaseClassCleanupTestCase {

        static cleanupFunc() {
          throw new Error('cleanup error');
        }

      }

      class CleanupFailTestCase extends BaseClassCleanupTestCase {

        static cleanupFunc() {
          throw new this.Fail('cleanup fail');
        }

      }
      class CleanupSkipTestCase extends BaseClassCleanupTestCase {

        static cleanupFunc() {
          throw new this.Skip('cleanup skip');
        }

      }

      const classes = [
        BaseClassCleanupTestCase,
        CleanupErrorTestCase,
        CleanupFailTestCase,
        CleanupSkipTestCase,
      ];
      const runner = new TestRunner(classes);

      // Act
      const result = runner.runTests();

      // Assert
      this.assertFalse(result.wasSuccessful());

      // In doClassCleanups, TestCase.{Fail,Skip} should count as errors,
      // however, the test *also* passed already, so we get extra counts.  Not
      // sure if this is a bug or a feature.
      this.assertEqual(
        result.successes,
        [
          'BaseClassCleanupTestCase.testDummy',
          'CleanupErrorTestCase.testDummy',
          'CleanupFailTestCase.testDummy',
          'CleanupSkipTestCase.testDummy',
        ],
        'successes'
      );
      this.assertEqual(
        result.errors,
        [
          {
            name: 'CleanupErrorTestCase.doClassCleanups',
            error: 'Error',
            message: 'cleanup error',
          },
          {
            name: 'CleanupFailTestCase.doClassCleanups',
            error: 'TestCase.Fail',
            message: 'cleanup fail',
          },
          {
            name: 'CleanupSkipTestCase.doClassCleanups',
            error: 'TestCase.Skip',
            message: 'cleanup skip',
          },
        ],
        'errors'
      );
      this.assertEqual(result.failures, [], 'failures');
      this.assertEqual(result.skipped, [], 'skipped');
    }

    testFindsTestMethods() {
      // Assemble
      class One extends TestCase {

        test() {}

        test_() {}

        _test() {
          this.fail('_test');
        }

        testOne() {
          this.skip('One');
        }

        notATest() {
          this.fail('notATest');
        }

      }
      class Two extends TestCase {

        alsoNotATest() {
          this.fail('alsoNotATest');
        }

        testTwo() {
          this.skip('Two');
        }

      }
      const runner = new TestRunner([One, Two]);

      // Act
      const result = runner.runTests();

      // Assert
      this.assertTrue(result.wasSuccessful());
      this.assertEqual(
        result.successes, ['One.test', 'One.test_'], 'successes'
      );
      this.assertEqual(result.errors, [], 'errors');
      this.assertEqual(result.failures, [], 'failures');
      this.assertEqual(
        result.skipped,
        [
          {name: 'One.testOne', message: 'One'},
          {name: 'Two.testTwo', message: 'Two'},
        ],
        'skipped'
      );
    }

    testAccumulatesResults() {
      class FooTestCase extends TestCase {

        testFail() {
          this.fail('Fail failed');
        }

        testNotEqual() {
          this.assertEqual(1, 2);
        }

        testPass() {}

        testError() {
          throw new Error('Oh, dear!');
        }

        testSkip() {
          this.skip('Skip skipped');
        }

      }
      const runner = new TestRunner([FooTestCase]);

      // Act
      const result = runner.runTests();

      // Assert
      this.assertFalse(result.wasSuccessful(), 'had failures');

      this.assertEqual(
        result.errors,
        [
          {
            name: 'FooTestCase.testError',
            error: 'Error',
            message: 'Oh, dear!',
          },
        ],
        'errors'
      );
      this.assertEqual(
        result.failures,
        [
          {name: 'FooTestCase.testFail', message: 'Fail failed'},
          {name: 'FooTestCase.testNotEqual', message: '1 !== 2'},
        ],
        'failures'
      );
      this.assertEqual(
        result.skipped,
        [{name: 'FooTestCase.testSkip', message: 'Skip skipped'}],
        'skipped'
      );
      this.assertEqual(
        result.successes,
        ['FooTestCase.testPass'],
        'successes'
      );
    }

  }
  /* eslint-enable */

  testing.testCases.push(TestRunnerTestCase);

  /**
   * Run registered TestCases.
   * @returns {TestResult} - Accumulated results of these tests.
   */
  function runTests() {
    const runner = new TestRunner(testing.testCases);
    return runner.runTests();
  }

  return {
    version: version,
    testing: testing,
    TestCase: TestCase,
    runTests: runTests,
  };

}());
