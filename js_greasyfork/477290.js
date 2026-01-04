// ==UserScript==
// ==UserLibrary==
// @name        NH_base
// @description Base library usable any time.
// @version     52
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0-standalone.html
// @homepageURL https://github.com/nexushoratio/userscripts
// @supportURL  https://github.com/nexushoratio/userscripts/issues
// @match       https://www.example.com/*
// ==/UserLibrary==
// ==/UserScript==

window.NexusHoratio ??= {};

window.NexusHoratio.base = (function base() {
  'use strict';

  /** @type {number} - Bumped per release. */
  const version = 52;

  /**
   * @type {number} - Constant (to make eslint's `no-magic-numbers` setting
   * happy).
   */
  const NOT_FOUND = -1;

  /**
   * @type {number} - Constant useful for testing length of an array.
   */
  const ONE_ITEM = 1;

  /**
   * @typedef {object} NexusHoratioVersion
   * @property {string} name - Library name.
   * @property {number} [minVersion=0] - Minimal version needed.
   */

  /**
   * Ensures appropriate versions of NexusHoratio libraries are loaded.
   * @param {NexusHoratioVersion[]} versions - Versions required.
   * @returns {object} - Namespace with only ensured libraries present.
   * @throws {Error} - When requirements not met.
   */
  function ensure(versions) {
    let msg = 'Forgot to set a message';
    const namespace = {};
    for (const ver of versions) {
      const {
        name,
        minVersion = 0,
      } = ver;
      const lib = window.NexusHoratio[name];
      if (!lib) {
        msg = `Library "${name}" is not loaded`;
        throw new Error(`Not Loaded: ${msg}`);
      }
      if (minVersion > lib.version) {
        msg = `At least version ${minVersion} of library "${name}" ` +
          `required; version ${lib.version} present.`;
        throw new Error(`Min Version: ${msg}`);
      }
      namespace[name] = lib;
    }
    return namespace;
  }

  const NH = ensure([{name: 'xunit', minVersion: 49}]);

  /* eslint-disable require-jsdoc */
  class EnsureTestCase extends NH.xunit.TestCase {

    testEmpty() {
      const actual = ensure([]);
      const expected = {};
      this.assertEqual(actual, expected);
    }

    testNameOnly() {
      const ns = ensure([{name: 'base'}]);
      this.assertTrue(ns.base);
    }

    testMinVersion() {
      this.assertRaisesRegExp(
        Error, /^Min Version:.*required.*present.$/u, () => {
          ensure([{name: 'base', minVersion: Number.MAX_VALUE}]);
        }
      );
    }

    testMissing() {
      this.assertRaisesRegExp(
        Error, /^Not Loaded: /u, () => {
          ensure([{name: 'missing'}]);
        }
      );
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(EnsureTestCase);

  /** Base exception that uses the name of the class. */
  class Exception extends Error {

    /** @type {string} */
    get name() {
      return this.constructor.name;
    }

  }

  /* eslint-disable require-jsdoc */
  class ExceptionTestCase extends NH.xunit.TestCase {

    testBase() {
      // Assemble/Act
      const e = new Exception(this.id);

      // Assert
      this.assertEqual(e.name, 'Exception', 'name');
      this.assertEqual(
        e.toString(), 'Exception: ExceptionTestCase.testBase', 'toString'
      );
      this.assertTrue(e instanceof Exception, 'is exception');
      this.assertTrue(e instanceof Error, 'is error');
      this.assertFalse(e instanceof TypeError, 'is NOT type-error');
    }

    testInheritance() {
      // Assemble
      class TestException extends Exception {}
      class DifferentException extends Exception {}

      // Act
      const te = new TestException('silly message');

      // Assert
      this.assertEqual(te.name, 'TestException', 'name');
      this.assertEqual(
        te.toString(), 'TestException: silly message', 'toString'
      );
      this.assertTrue(te instanceof TestException, 'is test-exception');
      this.assertTrue(te instanceof Exception, 'is exception');
      this.assertTrue(te instanceof Error, 'is error');
      this.assertFalse(te instanceof TypeError, 'is NOT type-error');
      this.assertFalse(te instanceof DifferentException,
        'is NOT different-exception');
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(ExceptionTestCase);

  /**
   * Simple dispatcher (event bus).
   *
   * It takes a fixed list of event types upon construction and attempts to
   * use an unknown event will throw an error.
   */
  class Dispatcher {

    /**
     * @callback Handler
     * @param {string} eventType - Event type.
     * @param {*} data - Event data.
     */

    /**
     * @param {...string} eventTypes - Event types this instance can handle.
     */
    constructor(...eventTypes) {
      for (const eventType of eventTypes) {
        this.#handlers.set(eventType, []);
      }
    }

    /**
     * Attach a function to an eventType.
     * @param {string} eventType - Event type to connect with.
     * @param {Handler} func - Single argument function to call.
     * @returns {Dispatcher} - This instance, for chaining.
     */
    on(eventType, func) {
      const handlers = this.#getHandlers(eventType);
      handlers.push(func);
      return this;
    }

    /**
     * Remove all instances of a function registered to an eventType.
     * @param {string} eventType - Event type to disconnect from.
     * @param {Handler} func - Function to remove.
     * @returns {Dispatcher} - This instance, for chaining.
     */
    off(eventType, func) {
      const handlers = this.#getHandlers(eventType);
      let index = 0;
      while ((index = handlers.indexOf(func)) !== NOT_FOUND) {
        handlers.splice(index, 1);
      }
      return this;
    }

    /**
     * Calls all registered functions for the given eventType.
     * @param {string} eventType - Event type to use.
     * @param {object} data - Data to pass to each function.
     * @returns {Dispatcher} - This instance, for chaining.
     */
    fire(eventType, data) {
      const handlers = this.#getHandlers(eventType);
      for (const handler of handlers) {
        handler(eventType, data);
      }
      return this;
    }

    #handlers = new Map();

    /**
     * Look up array of handlers by event type.
     * @param {string} eventType - Event type to look up.
     * @throws {Error} - When eventType was not registered during
     * instantiation.
     * @returns {Handler[]} - Handlers currently registered for this
     * eventType.
     */
    #getHandlers = (eventType) => {
      const handlers = this.#handlers.get(eventType);
      if (!handlers) {
        const eventTypes = Array.from(this.#handlers.keys())
          .join(', ');
        throw new Error(
          `Unknown event type: ${eventType}, must be one of: ${eventTypes}`
        );
      }
      return handlers;
    }

  }

  /* eslint-disable max-lines-per-function */
  /* eslint-disable max-statements */
  /* eslint-disable no-new */
  /* eslint-disable no-empty-function */
  /* eslint-disable require-jsdoc */
  class DispatcherTestCase extends NH.xunit.TestCase {

    testConstruction() {
      this.assertNoRaises(() => {
        new Dispatcher();
      }, 'empty');

      this.assertNoRaises(() => {
        new Dispatcher('one');
      }, 'single');

      this.assertNoRaises(() => {
        new Dispatcher('one', 'two', 'three');
      }, 'multiple');
    }

    testOnOff() {
      const dispatcher = new Dispatcher('boo');
      const handler = () => {};

      this.assertNoRaises(() => {
        dispatcher.on('boo', handler);
        dispatcher.on('boo', handler);
      }, 'on twice');

      this.assertNoRaises(() => {
        dispatcher.off('boo', handler);
        dispatcher.off('boo', handler);
      }, 'off twice');

      this.assertNoRaises(() => {
        dispatcher.on('boo', handler)
          .off('boo', handler)
          .on('boo', handler)
          .off('boo', handler);
      }, 'chaining works');

      this.assertRaisesRegExp(
        Error,
        /Unknown event type: hoo, must be one of: boo/u,
        () => {
          dispatcher.on('hoo', handler);
        },
        'on, bad event type'
      );

      this.assertRaisesRegExp(
        Error,
        /Unknown event type: hoo, must be one of: boo/u,
        () => {
          dispatcher.off('hoo', handler);
        },
        'on, bad event type'
      );
    }

    testFire() {
      const dispatcher = new Dispatcher('boo', 'ya');
      const calls1 = [];
      const calls2 = new Map();
      const handler1 = (...args) => {
        calls1.push(args);
      };
      const handler2 = (type, data) => {
        calls2.set(type, data);
      };

      this.assertNoRaises(() => {
        dispatcher.fire('boo', 'random data')
          .fire('ya', 'other stuff');
      });
      this.assertEqual(calls1, [], 'calls1 empty');
      this.assertEqual(calls2, new Map(), 'calls2 empty');

      dispatcher.on('boo', handler1)
        .on('ya', handler2)
        .fire('boo', 'more random data');
      this.assertEqual(
        calls1, [['boo', 'more random data']], 'single handler1 registered'
      );
      this.assertEqual(calls2, new Map(), 'calls2 still empty');

      calls1.length = 0;
      calls2.clear();
      dispatcher.on('boo', handler1)
        .on('boo', handler2)
        .on('ya', handler2)
        .fire('boo', {an: 'object'})
        .fire('ya', 'ya stuff');
      this.assertEqual(
        calls1,
        [['boo', {an: 'object'}], ['boo', {an: 'object'}]],
        'handler1 registered twice'
      );
      this.assertEqual(
        calls2,
        new Map([['boo', {an: 'object'}], ['ya', 'ya stuff']]),
        'calls2 registered once'
      );

      calls1.length = 0;
      calls2.clear();
      dispatcher.off('boo', handler1)
        .fire('boo', {a: 'different object'});
      this.assertEqual(calls1, [], 'single off got rid of all handler1');
      this.assertEqual(
        calls2,
        new Map([['boo', {a: 'different object'}]]),
        'handler2 still there'
      );

      calls1.length = 0;
      calls2.clear();
      this.assertRaisesRegExp(
        Error,
        /Unknown event type: hoo, must be one of: boo, ya/u,
        () => {
          dispatcher.fire('hoo', 'oops');
        },
        'bad eventType'
      );
      this.assertEqual(calls1, [], 'calls1 should be empty');
      this.assertEqual(calls2, new Map(), 'calls2 should be empty');
    }

    testBadHandler() {
      const dispatcher = new Dispatcher('oops');

      this.assertNoRaises(() => {
        dispatcher.on('oops', null);
      }, 'happily sets silly handler');

      this.assertRaises(
        TypeError,
        () => {
          dispatcher.fire('oops', 'this will not end well');
        },
        'and then it crashes'
      );
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(DispatcherTestCase);

  /**
   * A simple message system that will queue messages to be delivered.
   *
   * This is similar to the WEB API's `MessageChannel`.
   */
  class MessageQueue {

    /** @type {number} - Number of messages currently queued. */
    get count() {
      return this.#messages.length;
    }

    /**
     * @param {...*} items - Whatever to add to the queue.
     * @returns {MessageQueue} - This instance, for chaining.
     */
    post(...items) {
      this.#messages.push(items);
      this.#dispatcher.fire('post');
      return this;
    }

    /**
     * @param {?function(...*)} func - Function that receives the messages.
     * If falsy, listener is removed.
     * @returns {MessageQueue} - This instance, for chaining.
     */
    listen(func) {
      if (func) {
        this.#listener = func;
        this.#dispatcher.on('post', this.#handler);
        this.#handler();
      } else {
        this.#listener = null;
        this.#dispatcher.off('post', this.#handler);
      }
      return this;
    }

    #dispatcher = new Dispatcher('post');
    #listener
    #messages = [];

    #handler = () => {
      while (this.#messages.length && this.#listener) {
        this.#listener(...this.#messages.shift());
      }
    }

  }

  /* eslint-disable no-magic-numbers */
  /* eslint-disable require-jsdoc */
  class MessageQueueTestCase extends NH.xunit.TestCase {

    testCount() {
      // Assemble
      const mq = new MessageQueue();

      // Act
      for (let i = 0; i < 20; i += 1) {
        mq.post(i);
      }

      // Assert
      this.assertEqual(mq.count, 20);
    }

    testListener() {
      // Assemble
      const mq = new MessageQueue();
      const messages = [];
      const cb = (message) => {
        messages.push(message);
      };
      mq.post('a')
        .post('b')
        .post('c');

      // Act
      mq.listen(cb)
        .post(1);
      mq.post(2)
        .post(3);

      // Assert
      this.assertEqual(messages, ['a', 'b', 'c', 1, 2, 3], 'received');
      this.assertEqual(mq.count, 0, 'final count');
    }

    testDisconnect() {
      // Assemble
      const mq = new MessageQueue();
      const messages = [];
      const cb = (message) => {
        messages.push(message);
        mq.listen();
      };
      mq.post('a')
        .post('b')
        .post('c');

      // Act
      mq.listen(cb);
      mq.post(1)
        .post(2);

      // Assert
      this.assertEqual(messages, ['a'], 'received');
      this.assertEqual(mq.count, 4, 'final count');
    }

    testListenerChange() {
      // Assemble
      const mq = new MessageQueue();
      const newMessages = [];
      const origMessages = [];
      const newCallback = (message) => {
        newMessages.push(message);
      };
      const origCallback = (message) => {
        origMessages.push(message);
        mq.listen(newCallback);
      };
      mq.post('a')
        .post('b')
        .post('c');

      // Act
      mq.listen(origCallback)
        .post(1)
        .post(2);

      // Assert
      this.assertEqual(origMessages, ['a'], 'orig messages');
      this.assertEqual(newMessages, ['b', 'c', 1, 2], 'new messages');
      this.assertEqual(mq.count, 0, 'final count');
    }

    testFancyMessages() {
      // Assemble
      const mq = new MessageQueue();
      const messages = [];
      const cb = (...items) => {
        messages.push(...items);
        messages.push('---');
      };
      mq.listen(cb);
      const obj = {z: 26};

      mq.post('line 1', 'line 2', 'line 3');
      mq.post(1)
        .post(obj, [4, 'd']);

      this.assertEqual(
        messages,
        ['line 1', 'line 2', 'line 3', '---', 1, '---', obj, [4, 'd'], '---']
      );
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(MessageQueueTestCase);

  /**
   * NexusHoratio libraries and apps should log issues here.
   *
   * They should be logged in the form of multiple strings:
   * NH.base.issues.post('Something bad', 'detail 1', 'detail 2');
   *
   * An eventual listener should do something like:
   * listen(...issues) {
   *   for (const issue of issues) {
   *     displayIssueMessage(issue);
   *   }
   *   displayIssueSeparator();
   * }
   */
  const issues = new MessageQueue();

  /**
   * A Number like class that supports operations.
   *
   * For lack of any other standard, methods will be named like those in
   * Python's operator module.
   *
   * All operations should return `this` to allow chaining.
   *
   * The existence of the valueOf(), toString() and toJSON() methods will
   * probably allow this class to work in many situations through type
   * coercion.
   */
  class NumberOp {

    /** @param {number} value - Initial value, parsed by Number(). */
    constructor(value) {
      this.assign(value);
    }

    /** @returns {number} - Current value. */
    valueOf() {
      return this.#value;
    }

    /** @returns {string} - Current value. */
    toString() {
      return `${this.valueOf()}`;
    }

    /** @returns {number} - Current value. */
    toJSON() {
      return this.valueOf();
    }

    /**
     * @param {number} value - Number to assign.
     * @returns {NumberOp} - This instance.
     */
    assign(value = 0) {
      this.#value = Number(value);
      return this;
    }

    /**
     * @param {number} value - Number to add.
     * @returns {NumberOp} - This instance.
     */
    add(value) {
      this.#value += Number(value);
      return this;
    }

    #value

  }

  /* eslint-disable newline-per-chained-call */
  /* eslint-disable no-magic-numbers */
  /* eslint-disable no-undefined */
  /* eslint-disable require-jsdoc */
  class NumberOpTestCase extends NH.xunit.TestCase {

    testValueOf() {
      this.assertEqual(new NumberOp().valueOf(), 0, 'default');
      this.assertEqual(new NumberOp(null).valueOf(), 0, 'null');
      this.assertEqual(new NumberOp(undefined).valueOf(), 0, 'undefined');
      this.assertEqual(new NumberOp(42).valueOf(), 42, 'number');
      this.assertEqual(new NumberOp('52').valueOf(), 52, 'string');
    }

    testToString() {
      this.assertEqual(new NumberOp(123).toString(), '123', 'number');
      this.assertEqual(new NumberOp(null).toString(), '0', 'null');
      this.assertEqual(new NumberOp(undefined).toString(), '0', 'undefined');
    }

    testTemplateLiteral() {
      const val = new NumberOp(456);
      this.assertEqual(`abc${val}xyz`, 'abc456xyz');
    }

    testBasicMath() {
      this.assertEqual(new NumberOp(124) + 6, 130, 'NO + x');
      this.assertEqual(3 + new NumberOp(5), 8, 'x + NO');
    }

    testStringManipulation() {
      const a = 'abc';
      const x = 'xyz';
      const n = new NumberOp('654');

      this.assertEqual(a + n, 'abc654', 's + NO');
      this.assertEqual(n + x, '654xyz', 'NO + s');
    }

    testAssignOp() {
      const n = new NumberOp(123);
      n.assign(42);
      this.assertEqual(n.valueOf(), 42, 'number');

      n.assign(null);
      this.assertEqual(n.valueOf(), 0, 'null');

      n.assign(789);
      this.assertEqual(n.valueOf(), 789, 'number, reset');

      n.assign(undefined);
      this.assertEqual(n.valueOf(), 0, 'undefined');
    }

    testAddOp() {
      this.assertEqual(new NumberOp(3).add(1)
        .valueOf(), 4,
      'number');
      this.assertEqual(new NumberOp(1).add('5')
        .valueOf(), 6,
      'string');
      this.assertEqual(new NumberOp(3).add(new NumberOp(8))
        .valueOf(), 11,
      'NO.add(NO)');
      this.assertEqual(new NumberOp(9).add(-16)
        .valueOf(), -7,
      'negative');
    }

    testChaining() {
      this.assertEqual(new NumberOp().add(1)
        .add(2)
        .add('3')
        .valueOf(), 6,
      'adds');
      this.assertEqual(new NumberOp(3).assign(40)
        .add(2)
        .valueOf(), 42,
      'mixed');
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(NumberOpTestCase);

  /**
   * Subclass of {Map} similar to Python's defaultdict.
   *
   * First argument is a factory function that will create a new default value
   * for the key if not already present in the container.
   *
   * The factory function may take arguments.  If `.get()` is called with
   * extra arguments, those will be passed to the factory if it needed.
   */
  class DefaultMap extends Map {

    /**
     * @param {function(...args) : *} factory - Function that creates a new
     * default value if a requested key is not present.
     * @param {Iterable} [iterable] - Passed to {Map} super().
     */
    constructor(factory, iterable) {
      if (!(factory instanceof Function)) {
        throw new TypeError('The factory argument MUST be of ' +
                            `type Function, not ${typeof factory}.`);
      }
      super(iterable);

      this.#factory = factory;
    }

    /**
     * Enhanced version of `Map.prototype.get()`.
     * @param {*} key - The key of the element to return from this instance.
     * @param {...*} args - Extra arguments passed tot he factory function if
     * it is called.
     * @returns {*} - The value associated with the key, perhaps newly
     * created.
     */
    get(key, ...args) {
      if (!this.has(key)) {
        this.set(key, this.#factory(...args));
      }

      return super.get(key);
    }

    #factory

  }

  /* eslint-disable newline-per-chained-call */
  /* eslint-disable no-magic-numbers */
  /* eslint-disable no-new */
  /* eslint-disable require-jsdoc */
  class DefaultMapTestCase extends NH.xunit.TestCase {

    testNoFactory() {
      this.assertRaisesRegExp(TypeError, /MUST.*not undefined/u, () => {
        new DefaultMap();
      });
    }

    testBadFactory() {
      this.assertRaisesRegExp(TypeError, /MUST.*not string/u, () => {
        new DefaultMap('a');
      });
    }

    testFactorWithArgs() {
      // Assemble
      const dummy = new DefaultMap(x => new NumberOp(x));
      this.defaultEqual = this.equalValueOf;

      // Act
      dummy.get('a');
      dummy.get('b', 5);

      // Assert
      this.assertEqual(Array.from(dummy.entries()),
        [['a', 0], ['b', 5]]);
    }

    testWithIterable() {
      // Assemble
      const dummy = new DefaultMap(Number, [[1, 'one'], [2, 'two']]);

      // Act
      dummy.set(3, ['a', 'b']);
      dummy.get(4);

      // Assert
      this.assertEqual(Array.from(dummy.entries()),
        [[1, 'one'], [2, 'two'], [3, ['a', 'b']], [4, 0]]);
    }

    testCounter() {
      // Assemble
      const dummy = new DefaultMap(() => new NumberOp());
      this.defaultEqual = this.equalValueOf;

      // Act
      dummy.get('a');
      dummy.get('b').add(1);
      dummy.get('b').add(1);
      dummy.get('c');
      dummy.get(4).add(1);

      // Assert
      this.assertEqual(Array.from(dummy.entries()),
        [['a', 0], ['b', 2], ['c', 0], [4, 1]]);
    }

    testArray() {
      // Assemble
      const dummy = new DefaultMap(Array);

      // Act
      dummy.get('a').push(1, 2, 3);
      dummy.get('b').push(4, 5, 6);
      dummy.get('a').push('one', 'two', 'three');

      // Assert
      this.assertEqual(Array.from(dummy.entries()),
        [['a', [1, 2, 3, 'one', 'two', 'three']], ['b', [4, 5, 6]]]);
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(DefaultMapTestCase);

  /**
   * Fancy-ish log messages (likely over engineered).
   *
   * Console nested message groups can be started and ended using the special
   * method pairs, {@link Logger#entered}/{@link Logger#leaving} and {@link
   * Logger#starting}/{@link Logger#finished}.  By default, the former are
   * opened and the latter collapsed (documented here as closed).
   *
   * Individual Loggers can be enabled/disabled by setting the {@link
   * Logger##Config.enabled} boolean property.
   *
   * Each Logger will have also have a collection of {@link Logger##Group}s
   * associated with it.  These groups can have one of three modes: "opened",
   * "closed", "silenced".  The first two correspond to the browser console
   * nested message groups.  The intro and outro type of methods will handle
   * the nesting.  If a group is set as "silenced", no messages will be sent
   * to the console.
   *
   * All Logger instances register a configuration with a singleton Map keyed
   * by the instance name.  If more than one instance is created with the same
   * name, they all share the same configuration.
   *
   * Configurations can be exported as a plain object and reimported using the
   * {@link Logger.configs} property.  The object could be saved via the
   * userscript script manager.  Depending on which one, it may have to be
   * processed with the JSON.{stringify,parse} functions.  Once exported, the
   * object may be modified.  This could be used to provide a UI to edit the
   * object, though no schema is provided.
   *
   * Some values may be of interest to users for help in debugging a script.
   *
   * The {callCount} value is how many times a logger would have been used for
   * messages, even if the logger is disabled.  Similarly, each group
   * associated with a logger also has a {callCount}.  These values can be
   * used to determine which loggers and groups generate a lot of messages and
   * could be disabled or silenced.
   *
   * The {sequence} value is a rough indicator of how recently a logger or
   * group was actually used.  It is purposely not a timestamp, but rather,
   * more closely associated with how often configurations are restored,
   * e.g. during web page reloads.  A low sequence number, relative to the
   * others, may indicate a logger was renamed, groups removed, or simply
   * parts of an application that have not been visited recently.  Depending
   * on the situation, the could clean up old configs, or explore other parts
   * of the script.
   *
   * @example
   * const log = new Logger('Bob');
   * foo(x) {
   *  const me = 'foo';
   *  log.entered(me, x);
   *  ... do stuff ...
   *  log.starting('loop');
   *  for (const item in items) {
   *    log.log(`Processing ${item}`);
   *    ...
   *  }
   *  log.finished('loop');
   *  log.leaving(me, y);
   *  return y;
   * }
   *
   * Logger.config('Bob').enabled = true;
   * Logger.config('Bob').group('foo').mode = 'silenced');
   *
   * GM.setValue('Logger', Logger.configs);
   * ... restart browser ...
   * Logger.configs = GM.getValue('Logger');
   */
  class Logger {

    /** @param {string} name - Name for this logger. */
    constructor(name) {
      this.#mq.listen(this.#errMsgListener);
      this.#name = name;
      this.#config = Logger.config(name);
      Logger.#loggers.get(this.#name)
        .push(new WeakRef(this));
    }

    static sequence = 1;

    /** @type {object} - Logger configurations. */
    static get configs() {
      return Logger.#toPojo();
    }

    /** @param {object} val - Logger configurations. */
    static set configs(val) {
      Logger.#fromPojo(val);
      Logger.#resetLoggerConfigs();
    }

    /** @type {string[]} - Names of known loggers. */
    static get loggers() {
      return Array.from(this.#loggers.keys());
    }

    /**
     * Get configuration of a specific Logger.
     * @param {string} name - Logger configuration to get.
     * @returns {Logger.Config} - Current config for that Logger.
     */
    static config(name) {
      return this.#configs.get(name);
    }

    /** Reset all configs to an empty state. */
    static resetConfigs() {
      this.#configs.clear();
      this.sequence = 1;
    }

    /** Clear the console. */
    static clear() {
      this.#clear();
    }

    /** @type {boolean} - Whether logging is currently enabled. */
    get enabled() {
      return this.#config.enabled;
    }

    /** @type {boolean} - Indicates whether messages include a stack trace. */
    get includeStackTrace() {
      return this.#config.includeStackTrace;
    }

    /** @type {MessageQueue} */
    get mq() {
      return this.#mq;
    }

    /** @type {string} - Name for this logger. */
    get name() {
      return this.#name;
    }

    /** @type {boolean} - Indicates whether current group is silenced. */
    get silenced() {
      let ret = false;
      const group = this.#groupStack.at(-1);
      if (group) {
        const mode = this.#config.group(group).mode;
        ret = mode === Logger.#GroupMode.Silenced;
      }
      return ret;
    }

    /**
     * Log a specific message.
     * @param {string} msg - Message to send to console.debug.
     * @param {...*} rest - Arbitrary items to pass to console.debug.
     */
    log(msg, ...rest) {
      this.#log(msg, ...rest);
    }

    /**
     * Indicate entered a specific group.
     * @param {string} group - Group that was entered.
     * @param {...*} rest - Arbitrary items to pass to console.debug.
     */
    entered(group, ...rest) {
      this.#intro(group, Logger.#GroupMode.Opened, ...rest);
    }

    /**
     * Indicate leaving a specific group.
     * @param {string} group - Group leaving.
     * @param {...*} rest - Arbitrary items to pass to console.debug.
     */
    leaving(group, ...rest) {
      this.#outro(group, ...rest);
    }

    /**
     * Indicate starting a specific collapsed group.
     * @param {string} group - Group that is being started.
     * @param {...*} rest - Arbitrary items to pass to console.debug.
     */
    starting(group, ...rest) {
      this.#intro(group, Logger.#GroupMode.Closed, ...rest);
    }

    /**
     * Indicate finishe a specific collapsed group.
     * @param {string} group - Group that was entered.
     * @param {...*} rest - Arbitrary items to pass to console.debug.
     */
    finished(group, ...rest) {
      this.#outro(group, ...rest);
    }

    static #Config = class {

      sequence = 0;

      /** @type {NumberOp} */
      get callCount() {
        return this.#callCount;
      }

      /** @type {boolean} - Whether logging is currently enabled. */
      get enabled() {
        return this.#enabled;
      }

      /** @param {boolean} val - Set whether logging is currently enabled. */
      set enabled(val) {
        this.#enabled = Boolean(val);
      }

      /** @type {Map<string,Logger.#Group>} - Per group settings. */
      get groups() {
        return this.#groups;
      }

      /** @type {boolean} - Whether messages include a stack trace. */
      get includeStackTrace() {
        return this.#includeStackTrace;
      }

      /** @param {boolean} val - Set inclusion of stack traces. */
      set includeStackTrace(val) {
        this.#includeStackTrace = Boolean(val);
      }

      /**
       * @param {string} name - Name of the group to get.
       * @param {Logger.#GroupMode} mode - Default mode if not seen before.
       * @returns {Logger.#Group} - Requested group, perhaps newly made.
       */
      group(name, mode) {
        const sanitizedName = name ?? 'null';
        const defaultMode = mode ?? 'opened';
        return this.#groups.get(sanitizedName, defaultMode);
      }

      /**
       * Capture that the associated Logger was used.
       * @param {string} name - Which group was used.
       */
      used(name) {
        const grp = this.group(name);

        this.callCount.add(1);
        this.sequence = Logger.sequence;

        grp.callCount.add(1);
        grp.sequence = Logger.sequence;
      }

      /** @returns {object} - Config as a plain object. */
      toPojo() {
        const pojo = {
          callCount: this.callCount.valueOf(),
          sequence: this.sequence,
          enabled: this.enabled,
          includeStackTrace: this.includeStackTrace,
          groups: {},
        };

        for (const [k, v] of this.groups) {
          pojo.groups[k] = v.toPojo();
        }

        return pojo;
      }

      /** @param {object} pojo - Config as a plain object. */
      fromPojo(pojo) {
        if (Object.hasOwn(pojo, 'callCount')) {
          this.callCount.assign(pojo.callCount);
        }
        if (Object.hasOwn(pojo, 'sequence')) {
          this.sequence = pojo.sequence;
          Logger.sequence = Math.max(Logger.sequence, this.sequence);
        }
        if (Object.hasOwn(pojo, 'enabled')) {
          this.enabled = pojo.enabled;
        }
        if (Object.hasOwn(pojo, 'includeStackTrace')) {
          this.includeStackTrace = pojo.includeStackTrace;
        }
        if (Object.hasOwn(pojo, 'groups')) {
          for (const [k, v] of Object.entries(pojo.groups)) {
            const gm = Logger.#GroupMode.byName(v.mode);
            if (gm) {
              this.group(k)
                .fromPojo(v);
            }
          }
        }
      }

      #callCount = new NumberOp();
      #enabled = false;
      #groups = new DefaultMap(x => new Logger.#Group(x));
      #includeStackTrace = false;

    }

    static #Group = class {

      /** @param {Logger.#GroupMode} mode - Initial mode for this group. */
      constructor(mode) {
        this.mode = mode;
        this.sequence = 0;
      }

      /** @type {NumberOp} */
      get callCount() {
        return this.#callCount;
      }

      /** @type {Logger.#GroupMode} */
      get mode() {
        return this.#mode;
      }

      /** @param {Logger.#GroupMode} val - Mode to set this group. */
      set mode(val) {
        let newVal = val;
        if (!(newVal instanceof Logger.#GroupMode)) {
          newVal = Logger.#GroupMode.byName(newVal);
        }
        if (newVal) {
          this.#mode = newVal;
        }
      }

      /** @returns {object} - Group as a plain object. */
      toPojo() {
        const pojo = {
          mode: this.mode.name,
          callCount: this.callCount.valueOf(),
          sequence: this.sequence,
        };

        return pojo;
      }

      /** @param {object} pojo - Group as a plain object. */
      fromPojo(pojo) {
        this.mode = pojo.mode;
        this.callCount.assign(pojo.callCount);
        this.sequence = pojo.sequence ?? 0;
        Logger.sequence = Math.max(Logger.sequence, this.sequence);
      }

      #callCount = new NumberOp();
      #mode

    }

    /** Enum/helper for Logger groups. */
    static #GroupMode = class {

      /**
       * @param {string} name - Mode name.
       * @param {string} [greeting] - Greeting when opening group.
       * @param {string} [farewell] - Salutation when closing group.
       * @param {string} [func] - console.func to use for opening group.
       */
      constructor(name, greeting, farewell, func) {  // eslint-disable-line max-params
        this.#farewell = farewell;
        this.#func = func;
        this.#greeting = greeting;
        this.#name = name;

        Logger.#GroupMode.#known.set(name, this);

        Object.freeze(this);
      }

      /**
       * Find GroupMode by name.
       * @param {string} name - Mode name.
       * @returns {GroupMode} - Mode, if found.
       */
      static byName(name) {
        return this.#known.get(name);
      }

      /** @type {string} - Farewell when closing group. */
      get farewell() {
        return this.#farewell;
      }

      /** @type {string} - console.func to use for opening group. */
      get func() {
        return this.#func;
      }

      /** @type {string} - Greeting when opening group. */
      get greeting() {
        return this.#greeting;
      }

      /** @type {string} - Mode name. */
      get name() {
        return this.#name;
      }

      static #known = new Map();

      #farewell
      #func
      #greeting
      #name

    }

    static {
      Logger.#GroupMode.Silenced = new Logger.#GroupMode('silenced');
      Logger.#GroupMode.Opened = new Logger.#GroupMode(
        'opened', 'Entered', 'Leaving', 'group'
      );
      Logger.#GroupMode.Closed = new Logger.#GroupMode(
        'closed', 'Starting', 'Finished', 'groupCollapsed'
      );

      Object.freeze(Logger.#GroupMode);
    }

    static #configs = new DefaultMap(() => new Logger.#Config());
    static #loggers = new DefaultMap(Array);

    /**
     * Set Logger configs from a plain object.
     * @param {object} pojo - Created by {Logger.#toPojo}.
     */
    static #fromPojo = (pojo) => {
      if (pojo && pojo.type === 'LoggerConfigs') {
        this.resetConfigs();
        for (const [k, v] of Object.entries(pojo.entries)) {
          this.#configs.get(k)
            .fromPojo(v);
        }
        Logger.sequence += 1;
      }
    }

    /** @returns {object} - Logger.#configs as a plain object. */
    static #toPojo = () => {
      const pojo = {
        type: 'LoggerConfigs',
        entries: {},
      };
      for (const [k, v] of this.#configs.entries()) {
        pojo.entries[k] = v.toPojo();
      }
      return pojo;
    }

    /**
     * This only resets Logger instances that have know configs.
     *
     * That way, Loggers created during tests wrapped with a save/restore
     * sequence, will not have their configs regenerated.
     */
    static #resetLoggerConfigs = () => {
      for (const key of this.#configs.keys()) {
        // We do not want to accidentally create a key in this DefaultMap.
        if (this.#loggers.has(key)) {
          const loggerArrays = this.#loggers.get(key);
          for (const loggerRef of loggerArrays) {
            const logger = loggerRef.deref();
            if (logger) {
              logger.#config = Logger.config(key);
            }
          }
        }
      }
    }

    /* eslint-disable no-console */
    static #clear = () => {
      console.clear();
    }

    #config
    #groupStack = [];
    #mq = new MessageQueue();
    #name

    #errMsgListener = (...msgs) => {
      console.error(...msgs);
    }

    /**
     * Log a specific message.
     * @param {string} msg - Message to send to console.debug.
     * @param {...*} rest - Arbitrary items to pass to console.debug.
     */
    #log = (msg, ...rest) => {
      const group = this.#groupStack.at(-1);
      this.#config.used(group);
      if (this.enabled && !this.silenced) {
        if (this.includeStackTrace) {
          console.groupCollapsed(`${this.name} call stack`);
          console.trace();
          console.groupEnd();
        }
        console.debug(`${this.name}: ${msg}`, ...rest);
      }
    }

    /**
     * Introduces a specific group.
     * @param {string} group - Group being created.
     * @param {Logger.#GroupMode} defaultMode - Mode to use if new.
     * @param {...*} rest - Arbitrary items to pass to console.debug.
     */
    #intro = (group, defaultMode, ...rest) => {
      this.#groupStack.push(group);
      const mode = this.#config.group(group, defaultMode).mode;

      if (this.enabled && mode !== Logger.#GroupMode.Silenced) {
        console[mode.func](`${this.name}: ${group}`);
      }

      if (rest.length) {
        const msg = `${mode.greeting} ${group} with`;
        this.log(msg, ...rest);
      }
    }

    /**
     * Concludes a specific group.
     * @param {string} group - Group leaving.
     * @param {...*} rest - Arbitrary items to pass to console.debug.
     */
    #outro = (group, ...rest) => {
      const mode = this.#config.group(group).mode;

      let msg = `${mode.farewell} ${group}`;
      if (rest.length) {
        msg += ' with:';
      }
      this.log(msg, ...rest);

      const lastGroup = this.#groupStack.pop();
      if (group !== lastGroup) {
        this.#mq.post(`${this.name}: Logging group mismatch!  Received ` +
                      `"${group}", expected to see "${lastGroup}"`);
      }

      if (this.enabled && mode !== Logger.#GroupMode.Silenced) {
        console.groupEnd();
      }
    }
    /* eslint-enable */

    /* eslint-disable require-jsdoc */
    /* eslint-disable no-undefined */
    /** This must be nested due to accessing #private fields. */
    static GroupModeTestCase = class extends NH.xunit.TestCase {

      testClassIsFrozen() {
        this.assertRaisesRegExp(TypeError, /is not extensible/u, () => {
          Logger.#GroupMode.Bob = {};
        });
      }

      testInstanceIsFrozen() {
        this.assertRaisesRegExp(TypeError, /is not extensible/u, () => {
          Logger.#GroupMode.Silenced.newProp = 'data';
        });
      }

      testLookupByValidName() {
        // Act
        const gm = Logger.#GroupMode.byName('closed');

        // Assert
        this.assertEqual(gm, Logger.#GroupMode.Closed);
      }

      testLookupByInvalidName() {
        // Act
        const gm = Logger.#GroupMode.byName('nope');

        // Assert
        this.assertEqual(gm, undefined);
      }

    }
    /* eslint-enable */

  }

  NH.xunit.testing.testCases.push(Logger.GroupModeTestCase);

  /* eslint-disable class-methods-use-this */
  /* eslint-disable newline-per-chained-call */
  /* eslint-disable no-magic-numbers */
  /* eslint-disable require-jsdoc */
  class LoggerTestCase extends NH.xunit.TestCase {

    setUp() {
      this.addCleanup(this.restoreConfigs, Logger.configs);
      Logger.resetConfigs();
    }

    restoreConfigs(saved) {
      Logger.configs = saved;
    }

    testReset() {
      // Assemble
      Logger.config(this.id).enabled = true;

      // Act
      Logger.resetConfigs();

      // Assert
      this.assertEqual(Logger.configs.entries, {});
    }

    testInitialValues() {
      // Assemble
      const logger = new Logger(this.id);

      // Assert
      this.assertFalse(logger.enabled, 'enabled');
      this.assertFalse(logger.includeStackTrace, 'stack trace');
      this.assertEqual(Logger.config(this.id).groups.size, 0, 'no groups');
    }

    testGroupDefaults() {
      // Assemble
      const logger = new Logger(this.id);

      // Act
      logger.entered('func');
      logger.starting('loop');

      // Assert
      const groups = Logger.config(this.id).groups;
      this.assertEqual(groups.size, 2, 'we saw two groups');
      this.assertEqual(groups.get('func').mode.name, 'opened', 'func');
      this.assertEqual(groups.get('loop').mode.name, 'closed', 'loop');
    }

    testCountsCollected() {
      // Assemble
      Logger.sequence = 10;
      const logger = new Logger(this.id);

      // Act
      // Results in counts
      logger.log('one');
      logger.log('two');

      // Basic intros do not log a message
      logger.entered('ent1');

      // Intros with extra stuff do log
      logger.entered('ent2', 'extra');

      // Count is in a group
      logger.log('three');

      // Outros cause logs
      logger.leaving('ent2');
      logger.leaving('ent1', 'extra');

      // Assert

      // Some of these are {@link NumberOp}
      this.defaultEqual = this.equalValueOf;

      const config = Logger.config(this.id);
      this.assertEqual(config.callCount, 6, 'call count');
      this.assertEqual(config.sequence, 10, 'sequence');
      this.assertEqual(config.groups.get('null').callCount, 2, 'null count');
      this.assertEqual(config.groups.get('null').sequence, 10, 'null seq');
      this.assertEqual(config.groups.get('ent1').callCount, 1, '1 count');
      this.assertEqual(config.groups.get('ent1').sequence, 10, '1 seq');
      this.assertEqual(config.groups.get('ent2').callCount, 3, '2 count');
      this.assertEqual(config.groups.get('ent2').sequence, 10, '2 seq');
    }

    testExpectMismatchedGroup() {
      // Assemble
      const messages = [];
      const listener = (...msgs) => {
        messages.push(...msgs);
      };
      const logger = new Logger(this.id);
      logger.mq.listen(listener);

      // Act
      logger.entered('one');
      logger.leaving('two');

      // Assert
      this.assertEqual(messages, [
        'LoggerTestCase.testExpectMismatchedGroup: Logging group mismatch!' +
          '  Received "two", expected to see "one"',
      ]);
    }

    testUpdateGroupByString() {
      // Assemble
      const logger = new Logger(this.id);
      logger.entered('one');

      // Act
      Logger.config('updateGroupByString').group('one').mode = 'silenced';
      this.assertEqual(
        Logger.config('updateGroupByString').group('one').mode.name,
        'silenced'
      );
    }

    testSaveRestoreConfigsTopLevel() {
      // This test does not strictly follow Assemble/Act/Assert as it has
      // extra verifications during state changes.

      // Some of these are {@link NumberOp}
      this.defaultEqual = this.equalValueOf;

      // Initial
      Logger.config(this.id).includeStackTrace = true;
      const logger = new Logger(this.id);
      logger.log('bumping the call count');

      const savedConfigs = Logger.configs;

      this.assertTrue(Logger.config(this.id).includeStackTrace, 'init trace');
      this.assertEqual(Logger.config(this.id).callCount, 1, 'init count');

      // Reset
      Logger.resetConfigs();

      this.assertFalse(Logger.config(this.id).includeStackTrace,
        'reset trace');
      this.assertEqual(Logger.config(this.id).callCount, 0, 'reset count');

      // Bob was not present before saving the configs.  So, the following
      // tweak away from defaults should reset after restoration.
      Logger.config('Bob').enabled = true;

      // Restore
      Logger.configs = savedConfigs;

      this.assertTrue(Logger.config(this.id).includeStackTrace,
        'restore trace');
      this.assertEqual(Logger.config(this.id).callCount, 1, 'restore count');
      this.assertFalse(Logger.config('Bob').enabled, 'restore Bob');
    }

    testSaveRestoreConfigsGroups() {
      // This test does not strictly follow Assemble/Act/Assert as it has
      // extra verifications during state changes.

      // Some of these are {@link NumberOp}
      this.defaultEqual = this.equalValueOf;

      const grp = 'a-loop';

      // Initial
      const logger = new Logger(this.id);
      logger.starting(grp);
      logger.finished(grp, 'bumping the call count');

      this.assertEqual(Logger.config(this.id).group(grp).mode.name,
        'closed',
        'init mode');
      this.assertEqual(Logger.config(this.id).group(grp).callCount,
        1,
        'init count');

      const savedConfigs = Logger.configs;

      // Reset
      Logger.resetConfigs();

      this.assertEqual(Logger.config(this.id).group(grp).mode.name,
        'opened',
        'reset mode');
      this.assertEqual(Logger.config(this.id).group(grp).callCount,
        0,
        'reset count');

      // Restore
      Logger.configs = savedConfigs;

      this.assertEqual(Logger.config(this.id).group(grp).mode.name,
        'closed',
        'restore mode');
      this.assertEqual(Logger.config(this.id).group(grp).callCount,
        1,
        'restore count');
    }

    testSaveRestoreBumpsSequenceAboveHighest() {
      const grp = 'some-group';
      Logger.sequence = 23;
      const logger = new Logger(this.id);

      // Just generating a group so it can have a sequence
      logger.starting(grp);
      logger.finished(grp);

      const savedConfigs = Logger.configs;

      this.assertEqual(savedConfigs.entries[this.id].groups[grp].sequence,
        23,
        'just checking....');

      savedConfigs.entries[this.id].sequence = 34;
      savedConfigs.entries[this.id].groups[grp].sequence = 42;

      // Restore - sequence should be > max(34, 42) from above
      Logger.configs = savedConfigs;
      this.assertTrue(Logger.sequence > 42, 'better be bumped');
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(LoggerTestCase);

  /**
   * Execute TestCase tests.
   * @param {Logger} logger - Logger to use.
   * @returns {boolean} - Success status.
   */
  function doTestCases(logger) {
    const me = 'Running TestCases';
    logger.entered(me);

    const savedConfigs = Logger.configs;
    const result = NH.xunit.runTests();
    Logger.configs = savedConfigs;

    const summary = result.summary(true)
      .join('\n');
    logger.log(`summary:\n${summary}`);
    if (result.errors.length) {
      logger.starting('Errors');

      for (const error of result.errors) {
        logger.log('error:', error);
      }

      logger.finished('Errors');
    }

    if (result.failures.length) {
      logger.starting('Failures');

      for (const failure of result.failures) {
        logger.log('failure:', failure.name, failure.message);
      }

      logger.finished('Failures');
    }

    logger.leaving(me, result.wasSuccessful());
    return result.wasSuccessful();
  }

  /**
   * Basic test runner.
   *
   * This depends on {Logger}, hence the location in this file.
   */
  function runTests() {
    if (NH.xunit.testing.enabled) {
      const logger = new Logger('Testing');
      if (doTestCases(logger)) {
        logger.log('All TestCases passed.');
      } else {
        logger.log('At least one TestCase failed.');
      }
    }
  }

  NH.xunit.testing.run = runTests;

  /**
   * Create a UUID-like string with a base.
   * @param {string} strBase - Base value for the string.
   * @returns {string} - A unique string.
   */
  function uuId(strBase) {
    return `${strBase}-${crypto.randomUUID()}`;
  }

  /**
   * Normalizes a string to be safe to use as an HTML element id.
   * @param {string} input - The string to normalize.
   * @returns {string} - Normlized string.
   */
  function safeId(input) {
    let result = input
      .replaceAll(' ', '-')
      .replaceAll('.', '_')
      .replaceAll(',', '__comma__')
      .replaceAll(':', '__colon__');
    if (!(/^[a-z_]/iu).test(result)) {
      result = `a${result}`;
    }
    return result;
  }

  /* eslint-disable no-undefined */
  /* eslint-disable require-jsdoc */
  class SafeIdTestCase extends NH.xunit.TestCase {

    testNormalInputs() {
      const tests = [
        {text: 'Tabby Cat', expected: 'Tabby-Cat'},
        {text: '_', expected: '_'},
        {text: '', expected: 'a'},
        {text: '0', expected: 'a0'},
        {text: 'a.b.c', expected: 'a_b_c'},
        {text: 'a,b,c', expected: 'a__comma__b__comma__c'},
        {text: 'a:b::c', expected: 'a__colon__b__colon____colon__c'},
      ];
      for (const {text, expected} of tests) {
        this.assertEqual(safeId(text), expected, text);
      }
    }

    testBadInputs() {
      this.assertRaises(
        TypeError,
        () => {
          safeId(undefined);
        },
        'undefined'
      );

      this.assertRaises(
        TypeError,
        () => {
          safeId(null);
        },
        'null'
      );
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(SafeIdTestCase);

  /**
   * Equivalent (for now) Java's hashCode (do not store externally).
   *
   * Do not expect it to be stable across releases.
   *
   * Implements: s[0]*31(n-1) + s[1]*31(n-2) + ... + s[n-1]
   * @param {string} s - String to hash.
   * @returns {string} - Hash value.
   */
  function strHash(s) {
    let hash = 0;
    for (let i = 0; i < s.length; i += 1) {
      // eslint-disable-next-line no-magic-numbers
      hash = (hash * 31) + s.charCodeAt(i) | 0;
    }
    return `${hash}`;
  }

  /**
   * Separate a string of concatenated words along transitions.
   *
   * Transitions are:
   *   lower to upper (lowerUpper -> lower Upper)
   *   grouped upper to lower (ABCd -> AB Cd)
   *   underscores (snake_case -> snake case)
   *   spaces
   *   character/numbers (lower2Upper -> lower 2 Upper)
   * Likely only works with ASCII.
   * Empty strings return an empty array.
   * Extra separators are consolidated.
   * @param {string} text - Text to parse.
   * @returns {string[]} - Parsed text.
   */
  function simpleParseWords(text) {
    const results = [];

    const working = [text];
    const moreWork = [];

    while (working.length || moreWork.length) {
      if (working.length === 0) {
        working.push(...moreWork);
        moreWork.length = 0;
      }

      // Unicode categories used below:
      // L - Letter
      // Ll - Letter, lower
      // Lu - Letter, upper
      // N - Number
      let word = working.shift();
      if (word) {
        word = word.replace(
          /(?<lower>\p{Ll})(?<upper>\p{Lu})/u,
          '$<lower> $<upper>'
        );

        word = word.replace(
          /(?<upper>\p{Lu}+)(?<lower>\p{Lu}\p{Ll})/u,
          '$<upper> $<lower>'
        );

        word = word.replace(
          /(?<letter>\p{L})(?<number>\p{N})/u,
          '$<letter> $<number>'
        );

        word = word.replace(
          /(?<number>\p{N})(?<letter>\p{L})/u,
          '$<number> $<letter>'
        );

        const split = word.split(/[ _]/u);
        if (split.length > 1 || moreWork.length) {
          moreWork.push(...split);
        } else {
          results.push(word);
        }
      }
    }

    return results;
  }

  /* eslint-disable require-jsdoc */
  class SimpleParseWordsTestCase extends NH.xunit.TestCase {

    testEmpty() {
      // Act
      const actual = simpleParseWords('');

      // Assert
      this.assertEqual(actual, []);
    }

    testSeparatorsOnly() {
      // Act
      const actual = simpleParseWords(' _ __  _');

      // Assert
      this.assertEqual(actual, []);
    }

    testAllLower() {
      // Act
      const actual = simpleParseWords('lower');

      // Assert
      const expected = ['lower'];
      this.assertEqual(actual, expected);
    }

    testAllUpper() {
      // Act
      const actual = simpleParseWords('UPPER');

      // Assert
      const expected = ['UPPER'];
      this.assertEqual(actual, expected);
    }

    testMixed() {
      // Act
      const actual = simpleParseWords('Mixed');

      // Assert
      const expected = ['Mixed'];
      this.assertEqual(actual, expected);
    }

    testSimpleCamelCase() {
      // Act
      const actual = simpleParseWords('SimpleCamelCase');

      // Assert
      const expected = ['Simple', 'Camel', 'Case'];
      this.assertEqual(actual, expected);
    }

    testLongCamelCase() {
      // Act
      const actual = simpleParseWords('AnUPPERWord');

      // Assert
      const expected = ['An', 'UPPER', 'Word'];
      this.assertEqual(actual, expected);
    }

    testLowerCamelCase() {
      // Act
      const actual = simpleParseWords('lowerCamelCase');

      // Assert
      const expected = ['lower', 'Camel', 'Case'];
      this.assertEqual(actual, expected);
    }

    testSnakeCase() {
      // Act
      const actual = simpleParseWords('snake_case_Example');

      // Assert
      const expected = ['snake', 'case', 'Example'];
      this.assertEqual(actual, expected);
    }

    testDoubleSnakeCase() {
      // Act
      const actual = simpleParseWords('double__snake_Case_example');

      // Assert
      const expected = ['double', 'snake', 'Case', 'example'];
      this.assertEqual(actual, expected);
    }

    testWithNumbers() {
      // Act
      const actual = simpleParseWords('One23fourFive');

      // Assert
      const expected = ['One', '23', 'four', 'Five'];
      this.assertEqual(actual, expected);
    }

    testWithSpaces() {
      // Act
      const actual = simpleParseWords('ABCd EF  ghIj');

      // Assert
      const expected = ['AB', 'Cd', 'EF', 'gh', 'Ij'];
      this.assertEqual(actual, expected);
    }

    testComplicated() {
      // Act
      const actual = simpleParseWords(
        'A_VERYComplicated_Wordy __ _  Example'
      );

      // Assert
      const expected = ['A', 'VERY', 'Complicated', 'Wordy', 'Example'];
      this.assertEqual(actual, expected);
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(SimpleParseWordsTestCase);

  /**
   * Base class for building services that can be turned on and off.
   *
   * Subclasses should NOT override methods here, except for constructor().
   * Instead they should register listeners for appropriate events.
   *
   * Generally, methods will fire two event verbs.  The first, in present
   * tense, will instruct what should happen (activate, deactivate).  The
   * second, in past tense, will describe what should have happened
   * (activated, deactivated).  Typically, subclasses will act upon the
   * present tense, and users of the class may act upon the past tense.
   *
   * @example
   * class DummyService extends Service {
   *
   *   constructor(name, dummyArgs) {
   *     super(`The ${name}`);
   *     this.#args = dummyArgs
   *     this.on('activate', this.#onActivate)
   *       .on('deactivate', this.#onDeactivate);
   *   }
   *
   *   #onActivate = (event) => {
   *     ... do activate stuff with this.#args ...
   *   }
   *
   *   #onDeactivate = (event) => {
   *     ... do deactivate stuff with this.#args ...
   *   }
   *
   * }
   *
   * ... else where ...
   * function dummyEventCallback(event, svc) {
   *   console.info(`${svc.name}` was ${event}`);
   * }
   *
   * const service = new DummyService('Bob', bobInfo)
   *   .on('activated', dummyEventCallback)
   *   .on('deactivated', dummyEventCallback);
   * service.activate();
   * service.deactivate();
   *
   */
  class Service {

    /** @param {string} name - Custom portion of this instance. */
    constructor(name) {
      if (new.target === Service) {
        throw new TypeError('Abstract class; do not instantiate directly.');
      }
      this.#name = `${this.constructor.name}: ${name}`;
      this.#shortName = name;
      this.#dispatcher = new Dispatcher(...Service.#knownEvents);
      this.#logger = new Logger(this.#name);
    }

    /** @type {Logger} - Logger instance. */
    get logger() {
      return this.#logger;
    }

    /** @type {string} - Instance name. */
    get name() {
      return this.#name;
    }

    /** @type {string} - Shorter instance name. */
    get shortName() {
      return this.#shortName;
    }

    /**
     * Called each time service is activated.
     *
     * @fires 'activate' 'activated'
     */
    activate() {
      if (!this.#activated || this.#allowReactivation) {
        this.#dispatcher.fire('activate', this);
        this.#dispatcher.fire('activated', this);
      }
      this.#activated = true;
    }

    /**
     * Called each time service is deactivated.
     *
     * @fires 'deactivate' 'deactivated'
     */
    deactivate() {
      this.#dispatcher.fire('deactivate', this);
      this.#dispatcher.fire('deactivated', this);
      this.#activated = false;
    }

    /**
     * Attach a function to an eventType.
     * @param {string} eventType - Event type to connect with.
     * @param {Dispatcher~Handler} func - Single argument function to
     * call.
     * @returns {Service} - This instance, for chaining.
     */
    on(eventType, func) {
      this.#dispatcher.on(eventType, func);
      return this;
    }

    /**
     * Remove all instances of a function registered to an eventType.
     * @param {string} eventType - Event type to disconnect from.
     * @param {Dispatcher~Handler} func - Function to remove.
     * @returns {Service} - This instance, for chaining.
     */
    off(eventType, func) {
      this.#dispatcher.off(eventType, func);
      return this;
    }

    /**
     * @param {boolean} allow - Whether to allow this service to be activated
     * when already active.
     * @returns {ScrollerService} - This instance, for chaining.
     */
    allowReactivation(allow) {
      this.#allowReactivation = allow;
      return this;
    }

    static #knownEvents = [
      'activate',
      'activated',
      'deactivate',
      'deactivated',
    ];

    #activated = false
    #allowReactivation = true
    #dispatcher
    #logger
    #name
    #shortName

  }

  /* eslint-disable max-lines-per-function */
  /* eslint-disable max-statements */
  /* eslint-disable no-new */
  /* eslint-disable require-jsdoc */
  class ServiceTestCase extends NH.xunit.TestCase {

    static Test = class extends Service {

      constructor(name) {
        super(`The ${name}`);
        this.on('activate', this.#onEvent)
          .on('deactivated', this.#onEvent);
      }

      set mq(val) {
        this.#mq = val;
      }

      #mq

      #onEvent = (evt, data) => {
        this.#mq.post('via Service', evt, data.shortName);
      }

    }

    testAbstract() {
      this.assertRaises(TypeError, () => {
        new Service();
      });
    }

    testProperties() {
      // Assemble
      const s = new ServiceTestCase.Test(this.id);

      // Assert
      this.assertEqual(
        s.name, 'Test: The ServiceTestCase.testProperties', 'name'
      );
      this.assertEqual(
        s.shortName, 'The ServiceTestCase.testProperties', 'short name'
      );
    }

    testSimpleEvents() {
      // Assemble
      const s = new ServiceTestCase.Test(this.id);
      const mq = new MessageQueue();
      s.mq = mq;

      const messages = [];
      const capture = (...message) => {
        messages.push(message);
      };
      const cb = (evt, service) => {
        mq.post('via cb', evt, service.name);
      };

      const shortName = 'The ServiceTestCase.testSimpleEvents';
      const longName = 'Test: The ServiceTestCase.testSimpleEvents';

      // Act I - Basic captures
      s.on('activated', cb)
        .on('deactivate', cb);
      s.activate();
      s.deactivate();

      mq.listen(capture);

      // Assert
      this.assertEqual(
        messages,
        [
          ['via Service', 'activate', shortName],
          ['via cb', 'activated', longName],
          ['via cb', 'deactivate', longName],
          ['via Service', 'deactivated', shortName],
        ],
        'first run through'
      );

      messages.length = 0;
      // Act II - Make sure *off()* is wired in.
      s.off('deactivate', cb);

      s.activate();
      s.deactivate();

      // Assert
      this.assertEqual(
        messages,
        [
          ['via Service', 'activate', shortName],
          ['via cb', 'activated', longName],
          // No deactivate in this spot this time
          ['via Service', 'deactivated', shortName],
        ],
        'second run through'
      );
    }

    testReactivation() {
      // Assemble
      const messages = [];
      const capture = (...message) => {
        messages.push(message);
      };

      const s = new ServiceTestCase.Test(this.id);
      s.mq = new MessageQueue()
        .listen(capture);

      const shortName = `The ${this.id}`;

      // Act I - Allowed by default
      s.activate();
      s.activate();
      s.deactivate();

      // Assert
      this.assertEqual(
        messages,
        [
          ['via Service', 'activate', shortName],
          // Activation while active worked
          ['via Service', 'activate', shortName],
          ['via Service', 'deactivated', shortName],
        ],
        'allowed by default'
      );

      // Act II - Turning off works
      messages.length = 0;
      s.allowReactivation(false);

      s.activate();
      s.activate();
      s.deactivate();

      // Assert
      this.assertEqual(
        messages,
        [
          ['via Service', 'activate', shortName],
          // No reactivation here
          ['via Service', 'deactivated', shortName],
        ],
        'turning off works'
      );

      // Act III - Turning back on works
      messages.length = 0;
      s.allowReactivation(true);

      s.activate();
      s.activate();
      s.deactivate();

      // Assert
      this.assertEqual(
        messages,
        [
          ['via Service', 'activate', shortName],
          // Activation while active worked
          ['via Service', 'activate', shortName],
          ['via Service', 'deactivated', shortName],
        ],
        'turning back on works'
      );
    }

  }
  /* eslint-enable */

  NH.xunit.testing.testCases.push(ServiceTestCase);

  return {
    version: version,
    NOT_FOUND: NOT_FOUND,
    ONE_ITEM: ONE_ITEM,
    ensure: ensure,
    Exception: Exception,
    Dispatcher: Dispatcher,
    MessageQueue: MessageQueue,
    issues: issues,
    DefaultMap: DefaultMap,
    Logger: Logger,
    uuId: uuId,
    safeId: safeId,
    strHash: strHash,
    simpleParseWords: simpleParseWords,
    Service: Service,
  };

}());
