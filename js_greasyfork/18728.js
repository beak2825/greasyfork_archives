// ==UserScript==
// @name        LJR fif reader
// @namespace   https://lj.rossia.org/users/weary/
// @description Helper for fif readers
// @author      weary <vsg@gmx.us>
// @license     WTFPL; http://www.wtfpl.net/txt/copying/
// @include     http://lj.rossia.org/users/ljr_fif/friends*
// @include     https://lj.rossia.org/users/ljr_fif/friends*
// @version     0.6.2
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.listValues
// @grant       GM.deleteValue
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/18728/LJR%20fif%20reader.user.js
// @updateURL https://update.greasyfork.org/scripts/18728/LJR%20fif%20reader.meta.js
// ==/UserScript==

(function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();



var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!function (global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  runtime.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function (arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
      // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function (object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function stop() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
}(
// In sloppy mode, unbound `this` refers to the global object, fallback to
// Function constructor if we're in global strict mode. That is sadly a form
// of indirect eval which violates Content Security Policy.
function () {
  return this;
}() || Function("return this")());

// Polyfills for old browsers
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement /*, fromIndex*/) {
        'use strict';

        if (this === null) {
            throw new TypeError('Array.prototype.includes called on null or undefined');
        }

        var O = Object(this);
        var len = parseInt(O.length, 10) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1], 10) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {
                k = 0;
            }
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement || searchElement !== searchElement && currentElement !== currentElement) {
                // NaN !== NaN
                return true;
            }
            k++;
        }
        return false;
    };
}

// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

/*
  Partially taken from https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
*/

if (typeof GM === 'undefined') {
    window.GM = {};
}

if (typeof GM_addStyle === 'undefined') {
    window.GM_addStyle = function (aCss) {
        'use strict';

        var head = document.getElementsByTagName('head')[0];
        if (head) {
            var style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };
}

if (typeof GM_registerMenuCommand === 'undefined') {
    window.GM_registerMenuCommand = function (caption, commandFunc, accessKey) {
        if (!document.body) {
            console.error('GM_registerMenuCommand got no body.');
            return;
        }
        var contextMenu = document.body.getAttribute('contextmenu');
        var menu = contextMenu ? document.querySelector('menu#' + contextMenu) : null;
        if (!menu) {
            menu = document.createElement('menu');
            menu.setAttribute('id', 'gm-registered-menu');
            menu.setAttribute('type', 'context');
            document.body.appendChild(menu);
            document.body.setAttribute('contextmenu', 'gm-registered-menu');
        }
        var menuItem = document.createElement('menuitem');
        menuItem.textContent = caption;
        menuItem.addEventListener('click', commandFunc, true);
        menu.appendChild(menuItem);
    };
}

if (typeof GM_getResourceText === 'undefined') {
    window.GM_getResourceText = function (aRes) {
        'use strict';

        return GM.getResourceUrl(aRes).then(function (url) {
            return fetch(url);
        }).then(function (resp) {
            return resp.text();
        }).catch(function (error) {
            GM.log('Request failed', error);
            return null;
        });
    };
}

Object.entries({
    'log': console.log, // eslint-disable-line no-console
    'info': GM_info
}).forEach(function (_ref) {
    var _ref2 = slicedToArray(_ref, 2),
        newKey = _ref2[0],
        old = _ref2[1];

    if (old && typeof GM[newKey] === 'undefined') {
        GM[newKey] = old;
    }
});

// Use hand made polyfills instead of GM version to fix old browser
// compatibility

if (typeof GM.listValues === 'undefined') {
    GM.listValues = function () {
        return new Promise(function (resolve, reject) {
            try {
                resolve(GM_listValues());
            } catch (e) {
                reject(e);
            }
        });
    };
}

if (typeof GM.getValue === 'undefined') {
    GM.getValue = function (key) {
        return new Promise(function (resolve, reject) {
            try {
                resolve(GM_getValue(key));
            } catch (e) {
                reject(e);
            }
        });
    };
}

if (typeof GM.setValue === 'undefined') {
    GM.setValue = function (key, value) {
        return new Promise(function (resolve, reject) {
            try {
                resolve(GM_setValue(key, value));
            } catch (e) {
                reject(e);
            }
        });
    };
}

if (typeof GM.deleteValue === 'undefined') {
    GM.deleteValue = function (key) {
        return new Promise(function (resolve, reject) {
            try {
                resolve(GM_deleteValue(key));
            } catch (e) {
                reject(e);
            }
        });
    };
}

var CustomEvent = function () {
    function CustomEvent(name) {
        var callbacks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        classCallCheck(this, CustomEvent);

        this.name = name;
        this.callbacks = callbacks;
    }

    createClass(CustomEvent, [{
        key: "addCallback",
        value: function addCallback(callback) {
            this.callbacks.push(callback);
        }
    }, {
        key: "trigger",
        value: function trigger() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            this.callbacks.forEach(function (callback) {
                callback.apply(undefined, args);
            });
        }
    }]);
    return CustomEvent;
}();

var EventDispatcher = function () {
    function EventDispatcher() {
        classCallCheck(this, EventDispatcher);

        this.events = new Map();
    }

    createClass(EventDispatcher, [{
        key: "addListener",
        value: function addListener(eventName, callback) {
            if (!this.events.has(eventName)) {
                this.events.set(eventName, new CustomEvent(eventName));
            }
            var event = this.events.get(eventName);
            event.addCallback(callback);
        }
    }, {
        key: "trigger",
        value: function trigger(eventName) {
            if (this.events.has(eventName)) {
                var _events$get;

                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    args[_key2 - 1] = arguments[_key2];
                }

                (_events$get = this.events.get(eventName)).trigger.apply(_events$get, args);
            }
        }
    }]);
    return EventDispatcher;
}();

var Dispatcher = new EventDispatcher();

// Base class with helpers and event interface

var Base = function () {
    function Base() {
        classCallCheck(this, Base);
    }

    createClass(Base, [{
        key: 'addListener',
        value: function addListener(eventName, callback) {
            Dispatcher.addListener(eventName, callback);
        }
    }, {
        key: 'trigger',
        value: function trigger(eventName) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            Dispatcher.trigger.apply(Dispatcher, [eventName].concat(args));
        }
    }, {
        key: 'arrayQS',
        value: function arrayQS(element, query) {
            return this.qsToArray(element.querySelectorAll(query));
        }
    }, {
        key: 'qsToArray',
        value: function qsToArray(array) {
            return Array.prototype.slice.call(array);
        }
    }]);
    return Base;
}();

// Script settings

var Settings = function (_Base) {
    inherits(Settings, _Base);

    function Settings() {
        var initial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        classCallCheck(this, Settings);

        var _this = possibleConstructorReturn(this, (Settings.__proto__ || Object.getPrototypeOf(Settings)).call(this));

        _this.defaultSettings = {
            blocked: [],
            blockedComm: [],
            collapsed: [],
            enabled: true,
            storeCollapsed: true,
            hideIframes: false,
            styleMine: false,
            setSize: true,
            hideBlocked: false,
            version: 1 // Settings version for future use
        };

        if (initial !== null) {
            _this.settings = initial;
        } else {
            // Default settings
            _this.settings = _this.defaultSettings;
        }
        // this.loadSettings();
        // // Save new default values after load. Looks not so
        // // optimal but I don't see other way
        // this.saveSettings();
        return _this;
    }

    createClass(Settings, [{
        key: 'init',
        value: function () {
            var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.loadSettings();

                            case 2:
                                _context.next = 4;
                                return this.saveSettings();

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function init() {
                return _ref.apply(this, arguments);
            }

            return init;
        }()

        // Load settings from GM storage.

    }, {
        key: 'loadSettings',
        value: function () {
            var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var settingsKeys, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key, val, _val;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return GM.listValues();

                            case 2:
                                settingsKeys = _context2.sent;
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context2.prev = 6;
                                _iterator = settingsKeys[Symbol.iterator]();

                            case 8:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context2.next = 26;
                                    break;
                                }

                                key = _step.value;
                                _context2.prev = 10;
                                _context2.next = 13;
                                return GM.getValue(key);

                            case 13:
                                val = _context2.sent;

                                if (val !== null) {
                                    this.settings[key] = JSON.parse(val);
                                }
                                _context2.next = 23;
                                break;

                            case 17:
                                _context2.prev = 17;
                                _context2.t0 = _context2['catch'](10);
                                _context2.next = 21;
                                return GM.getValue(key);

                            case 21:
                                _val = _context2.sent;

                                console.error('Settings load error: ' + _context2.t0 + ', ' + _val);

                            case 23:
                                _iteratorNormalCompletion = true;
                                _context2.next = 8;
                                break;

                            case 26:
                                _context2.next = 32;
                                break;

                            case 28:
                                _context2.prev = 28;
                                _context2.t1 = _context2['catch'](6);
                                _didIteratorError = true;
                                _iteratorError = _context2.t1;

                            case 32:
                                _context2.prev = 32;
                                _context2.prev = 33;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 35:
                                _context2.prev = 35;

                                if (!_didIteratorError) {
                                    _context2.next = 38;
                                    break;
                                }

                                throw _iteratorError;

                            case 38:
                                return _context2.finish(35);

                            case 39:
                                return _context2.finish(32);

                            case 40:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[6, 28, 32, 40], [10, 17], [33,, 35, 39]]);
            }));

            function loadSettings() {
                return _ref2.apply(this, arguments);
            }

            return loadSettings;
        }()

        // Convert settings to JSON and save. Can save only one key if
        // argument is provided

    }, {
        key: 'saveSettings',
        value: function () {
            var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

                var keys, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _key;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                keys = null;

                                if (key === null) {
                                    keys = Object.keys(this.settings);
                                } else {
                                    keys = [key];
                                }
                                // Save keys
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context3.prev = 5;
                                _iterator2 = keys[Symbol.iterator]();

                            case 7:
                                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                                    _context3.next = 14;
                                    break;
                                }

                                _key = _step2.value;
                                _context3.next = 11;
                                return GM.setValue(_key, JSON.stringify(this.settings[_key]));

                            case 11:
                                _iteratorNormalCompletion2 = true;
                                _context3.next = 7;
                                break;

                            case 14:
                                _context3.next = 20;
                                break;

                            case 16:
                                _context3.prev = 16;
                                _context3.t0 = _context3['catch'](5);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context3.t0;

                            case 20:
                                _context3.prev = 20;
                                _context3.prev = 21;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 23:
                                _context3.prev = 23;

                                if (!_didIteratorError2) {
                                    _context3.next = 26;
                                    break;
                                }

                                throw _iteratorError2;

                            case 26:
                                return _context3.finish(23);

                            case 27:
                                return _context3.finish(20);

                            case 28:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[5, 16, 20, 28], [21,, 23, 27]]);
            }));

            function saveSettings() {
                return _ref3.apply(this, arguments);
            }

            return saveSettings;
        }()

        // Clear all settings

    }, {
        key: 'clearSettings',
        value: function () {
            var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var settings, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, key;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (!window.confirm('Really clear all settings?')) {
                                    _context4.next = 30;
                                    break;
                                }

                                _context4.next = 3;
                                return GM.listValues();

                            case 3:
                                settings = _context4.sent;
                                _iteratorNormalCompletion3 = true;
                                _didIteratorError3 = false;
                                _iteratorError3 = undefined;
                                _context4.prev = 7;
                                _iterator3 = settings[Symbol.iterator]();

                            case 9:
                                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                                    _context4.next = 16;
                                    break;
                                }

                                key = _step3.value;
                                _context4.next = 13;
                                return GM.deleteValue(key);

                            case 13:
                                _iteratorNormalCompletion3 = true;
                                _context4.next = 9;
                                break;

                            case 16:
                                _context4.next = 22;
                                break;

                            case 18:
                                _context4.prev = 18;
                                _context4.t0 = _context4['catch'](7);
                                _didIteratorError3 = true;
                                _iteratorError3 = _context4.t0;

                            case 22:
                                _context4.prev = 22;
                                _context4.prev = 23;

                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }

                            case 25:
                                _context4.prev = 25;

                                if (!_didIteratorError3) {
                                    _context4.next = 28;
                                    break;
                                }

                                throw _iteratorError3;

                            case 28:
                                return _context4.finish(25);

                            case 29:
                                return _context4.finish(22);

                            case 30:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[7, 18, 22, 30], [23,, 25, 29]]);
            }));

            function clearSettings() {
                return _ref4.apply(this, arguments);
            }

            return clearSettings;
        }()

        // Set settings value, save if needed

    }, {
        key: 'set',
        value: function () {
            var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(key, value) {
                var save = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                this.settings[key] = value;

                                if (!save) {
                                    _context5.next = 4;
                                    break;
                                }

                                _context5.next = 4;
                                return this.saveSettings(key);

                            case 4:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function set$$1(_x3, _x4) {
                return _ref5.apply(this, arguments);
            }

            return set$$1;
        }()

        // Get value from saved settings. This operation is not so fast
        // because unserializing happens on every access, but otherwise
        // script will work strange if two tabs are open simultaneously

    }, {
        key: 'get',
        value: function () {
            var _ref6 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(key) {
                var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                var val;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return GM.getValue(key);

                            case 2:
                                val = _context6.sent;

                                if (!(val === undefined)) {
                                    _context6.next = 7;
                                    break;
                                }

                                return _context6.abrupt('return', defaultValue);

                            case 7:
                                return _context6.abrupt('return', JSON.parse(val));

                            case 8:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function get$$1(_x6) {
                return _ref6.apply(this, arguments);
            }

            return get$$1;
        }()
    }, {
        key: 'getAll',
        value: function () {
            var _ref7 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                var data, settings, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, key;

                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                data = {};
                                _context7.next = 3;
                                return GM.listValues();

                            case 3:
                                settings = _context7.sent;
                                _iteratorNormalCompletion4 = true;
                                _didIteratorError4 = false;
                                _iteratorError4 = undefined;
                                _context7.prev = 7;
                                _iterator4 = settings[Symbol.iterator]();

                            case 9:
                                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                                    _context7.next = 19;
                                    break;
                                }

                                key = _step4.value;
                                _context7.t0 = JSON;
                                _context7.next = 14;
                                return GM.getValue(key);

                            case 14:
                                _context7.t1 = _context7.sent;
                                data[key] = _context7.t0.parse.call(_context7.t0, _context7.t1);

                            case 16:
                                _iteratorNormalCompletion4 = true;
                                _context7.next = 9;
                                break;

                            case 19:
                                _context7.next = 25;
                                break;

                            case 21:
                                _context7.prev = 21;
                                _context7.t2 = _context7['catch'](7);
                                _didIteratorError4 = true;
                                _iteratorError4 = _context7.t2;

                            case 25:
                                _context7.prev = 25;
                                _context7.prev = 26;

                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }

                            case 28:
                                _context7.prev = 28;

                                if (!_didIteratorError4) {
                                    _context7.next = 31;
                                    break;
                                }

                                throw _iteratorError4;

                            case 31:
                                return _context7.finish(28);

                            case 32:
                                return _context7.finish(25);

                            case 33:
                                return _context7.abrupt('return', data);

                            case 34:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[7, 21, 25, 33], [26,, 28, 32]]);
            }));

            function getAll() {
                return _ref7.apply(this, arguments);
            }

            return getAll;
        }()
    }, {
        key: 'setAll',
        value: function () {
            var _ref8 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(settings) {
                var values, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, key;

                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return GM.listValues();

                            case 2:
                                values = _context8.sent;
                                _iteratorNormalCompletion5 = true;
                                _didIteratorError5 = false;
                                _iteratorError5 = undefined;
                                _context8.prev = 6;
                                _iterator5 = values[Symbol.iterator]();

                            case 8:
                                if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                                    _context8.next = 15;
                                    break;
                                }

                                key = _step5.value;
                                _context8.next = 12;
                                return GM.setValue(key, JSON.stringify(settings[key]));

                            case 12:
                                _iteratorNormalCompletion5 = true;
                                _context8.next = 8;
                                break;

                            case 15:
                                _context8.next = 21;
                                break;

                            case 17:
                                _context8.prev = 17;
                                _context8.t0 = _context8['catch'](6);
                                _didIteratorError5 = true;
                                _iteratorError5 = _context8.t0;

                            case 21:
                                _context8.prev = 21;
                                _context8.prev = 22;

                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                    _iterator5.return();
                                }

                            case 24:
                                _context8.prev = 24;

                                if (!_didIteratorError5) {
                                    _context8.next = 27;
                                    break;
                                }

                                throw _iteratorError5;

                            case 27:
                                return _context8.finish(24);

                            case 28:
                                return _context8.finish(21);

                            case 29:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[6, 17, 21, 29], [22,, 24, 28]]);
            }));

            function setAll(_x8) {
                return _ref8.apply(this, arguments);
            }

            return setAll;
        }()

        // Simple check for settings

    }, {
        key: 'isValid',
        value: function isValid(data) {
            var keys = ['blocked', 'blockedComm', 'collapsed', 'enabled', 'storeCollapsed', 'version'];
            for (var i = 0; i < keys.length; i++) {
                if (!data.hasOwnProperty(keys[i])) {
                    return false;
                }
            }
            return true;
        }
    }]);
    return Settings;
}(Base);

var styles = {
    btn: {
        color: 'dimgray',
        border: '1px solid gainsboro',
        bgcolor: 'whitesmoke',
        borderrad: '4px'
    }
};

var cssRules = {
    // Panel
    '#fifreader-container': {
        position: 'fixed',
        top: '5px',
        left: '5px'
    },
    '#fifreader-container > button': {
        'border-radius': styles.btn.borderrad,
        border: styles.btn.border,
        'background-color': styles.btn.bgcolor,
        color: styles.btn.color,
        'font-size': '1.5em',
        display: 'block'
    },

    // Settings
    '#fifreader-container > .settings-panel': {
        display: 'none',
        'background-color': 'dimgray',
        'border-radius': styles.btn.borderrad,
        padding: '4px',
        overflow: 'hidden',
        'float': 'left',
        'margin': '5px 5px 0 0'
    },

    '#fifreader-container > .settings-panel.show': {
        display: 'block'
    },

    '#fifreader-container > .settings-panel .close-btn': {
        'float': 'right',
        'text-align': 'center',
        'font-weight': 'bold',
        'font-size': '1.3em',
        cursor: 'pointer',
        color: 'lightgray'
    },

    '#fifreader-container > .settings-panel .close-btn:hover': {
        color: 'white'
    },

    '#fifreader-container .settings-panel > h3': {
        'color': 'white',
        'font-weight': 'bold',
        'font-size': '1em',
        'padding': 0,
        'margin': '5px 3px'
    },

    '#fifreader-container .settings-container': {
        clear: 'both'
    },

    '#fifreader-container .settings-container > button': {
        'display': 'block',
        'padding': '2px'
    },

    '#fifreader-container .settings-container label': {
        display: 'block',
        color: 'white'
    },
    '#fifreader-container .settings-container label > input': {
        'float': 'left'
    },

    '#fifreader-container .settings-container > *': {
        'margin': '5px 3px'
    },

    '#fifreader-container .settings-container textarea': {
        width: '260px',
        height: '130px'
    },

    '#fifreader-container .settings-container .add-container > button': {
        height: 'auto',
        'font-size': '1em',
        'font-weight': 'bold'
    },

    '#fifreader-container .settings-container .scroll-list': {
        'max-height': '300px',
        'overflow-y': 'scroll'
    },

    // Oh ugly
    '#fifreader-container .settings-container .scroll-list > label': {
        'margin': '5px 3px'
    },

    // Post buttons
    'body > #page > div.day > div.fifreader-panel': {
        padding: '5px'
    },
    'body > #page > div.day > div.fifreader-panel > button.panel-button': {
        'border-radius': styles.btn.borderrad,
        padding: '1px',
        'margin-right': '4px',
        border: styles.btn.border,
        'background-color': styles.btn.bgcolor,
        color: styles.btn.color,
        'font-size': '1em',
        'font-weight': 'bold',
        width: '1.5em',
        height: '1.5em'
    },
    'body > #page > div.day > div.fifreader-panel > button.visibility::before': {
        content: '"↓"'
    },
    'body > #page > div.day > div.fifreader-panel.hidden > button.visibility::before': {
        content: '"→"'
    },
    'body > #page > div.day > div.fifreader-panel > button.block::before': {
        content: '"⨯"',
        color: 'darkred'
    },
    'body > #page > div.day > div.fifreader-panel.blocked > button.block::before': {
        content: '"✔"',
        color: 'limegreen'
    },

    'body > #page > div.day > div.fifreader-panel > button.comm-block::before': {
        content: '"⨯"',
        color: 'darkred'
    },
    'body > #page > div.day > div.fifreader-panel.blocked-comm > button.comm-block::before': {
        content: '"✔"',
        color: 'limegreen'
    },

    'body > #page > div.day > div.fifreader-panel > span.post-info': {
        display: 'none',
        'margin-left': '10px'
    },
    'body > #page > div.day > div.fifreader-panel.hidden > span.post-info': {
        display: 'inline'
    },

    'body > #page > div.day > div.fifreader-panel > span.post-info a': {
        'white-space': 'nowrap'
    },

    'body .entry.hidden': {
        display: 'none'
    },

    'body .entry .iframe-placeholder': {
        display: 'block',
        width: '90px',
        height: '60px',
        'line-height': '60px',
        'text-align': 'center',
        'border-radius': styles.btn.borderrad,
        border: styles.btn.border,
        'background-color': styles.btn.bgcolor,
        color: styles.btn.color,
        'text-decoration': 'none'
    },

    'body .entry ul.entryextra:last-child > li.fifreader-uncollapse': {
        display: 'inline'
    },

    'body .entry ul.entryextra:last-child > li.fifreader-uncollapse::after': {
        content: '" :: "'
    },

    'body .entry .fif-max-size:not([src$="lj.rossia.org/img/poll/mainbar.gif"])': {
        'max-width': '100% !important',
        height: 'auto !important'
    },

    'body.hide-blocked .blocked,body.hide-blocked .blocked-comm,body.hide-blocked .blocked-entry': {
        display: 'none'
    },

    // Load more link
    'body > #fifreader-load-more': {
        width: '100%',
        border: styles.btn.border,
        'background-color': styles.btn.bgcolor,
        color: styles.btn.color,
        'margin-top': '10px',
        'font-size': '2em'
    },

    'body > #fifreader-load-more > span::before': {
        content: '" ↓ Load more "'
    },

    // This thing not really rotating around center though
    'body > #fifreader-load-more.loading > span': {
        display: 'inline-block',
        animation: 'spinner 1s linear infinite'
    },

    'body > #fifreader-load-more.loading > span::before': {
        content: '" ☸ "' // U+2638: Wheel Of Dharma. You can't escape.
    },

    'body > #fifreader-load-more.disabled > span::before': {
        content: '" × next link not found × "',
        color: 'red'
    },

    'body > #page > .fifreader-load-more-stat': {
        'font-weight': 'bold'
    },

    'body > #page > .fifreader-load-more-stat.error': {
        color: 'red'
    },

    // Animation
    '@keyframes spinner': {
        to: {
            transform: 'rotate(360deg)'
        }
    }
};

var Panel = function (_Base) {
    inherits(Panel, _Base);

    function Panel(opts) {
        classCallCheck(this, Panel);

        var _this = possibleConstructorReturn(this, (Panel.__proto__ || Object.getPrototypeOf(Panel)).call(this));

        _this.opts = opts;
        _this.opts.hide = _this.opts.hide || false;
        _this.panel = null;
        return _this;
    }

    createClass(Panel, [{
        key: 'createLabel',
        value: function createLabel(text) {
            var el = document.createElement('label');
            el.textContent = text;
            return el;
        }
    }, {
        key: 'createButton',
        value: function createButton(name, text) {
            var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            var button = document.createElement('button');
            button.id = name;
            button.name = name;
            button.textContent = text;
            classes.forEach(function (cls) {
                return button.classList.add(cls);
            });
            return button;
        }
    }, {
        key: 'createCheckbox',
        value: function createCheckbox(name, text) {
            var checked = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = name;
            checkbox.id = name;
            checkbox.checked = checked;
            var label = document.createElement('label');
            label.htmlFor = name;
            label.textContent = text;
            label.appendChild(checkbox);
            return label;
        }

        // Override in subclass

    }, {
        key: 'renderContents',
        value: function renderContents() {}
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            this.panel = document.createElement('div');
            this.panel.classList.add('settings-panel');

            // Close button
            this.closeBtn = document.createElement('a');
            this.closeBtn.classList.add('close-btn');
            this.closeBtn.textContent = '×';
            this.closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                if (_this2.opts.hide) {
                    _this2.hide();
                } else {
                    _this2.remove();
                }
            });
            this.panel.appendChild(this.closeBtn);

            if (this.opts.heading) {
                var head = document.createElement('h3');
                head.textContent = this.opts.heading;
                this.panel.appendChild(head);
            }

            // Contents container
            this.container = document.createElement('div');
            this.container.classList.add('settings-container');
            this.panel.appendChild(this.container);

            // Must be implemented in subclass
            this.renderContents();

            // Append to container if provided
            if (container !== null) {
                container.appendChild(this.panel);
            }
            return this.panel;
        }
    }, {
        key: 'isRendered',
        value: function isRendered() {
            return this.panel !== null;
        }
    }, {
        key: 'remove',
        value: function remove() {
            if (this.panel !== null) {
                this.panel.parentNode.removeChild(this.panel);
                this.panel = null;
            }
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.panel.classList.remove('show');
        }
    }, {
        key: 'show',
        value: function show() {
            this.panel.classList.add('show');
        }
    }, {
        key: 'toggle',
        value: function toggle() {
            if (this.panel.classList.contains('show')) {
                this.hide();
            } else {
                this.show();
            }
        }
    }]);
    return Panel;
}(Base);

var BlockedPanel = function (_Panel) {
    inherits(BlockedPanel, _Panel);

    function BlockedPanel(opts) {
        classCallCheck(this, BlockedPanel);

        var _this3 = possibleConstructorReturn(this, (BlockedPanel.__proto__ || Object.getPrototypeOf(BlockedPanel)).call(this, opts));

        _this3.addListener(_this3.opts.event, _this3.itemBlocked.bind(_this3));
        _this3.itemsList = [];
        return _this3;
    }

    createClass(BlockedPanel, [{
        key: 'itemBlocked',
        value: function itemBlocked(item) {
            if (!this.container || !this.itemsContainer) {
                // Panel isn't created yet
                return;
            }
            if (!this.itemsList.includes(item)) {
                // Add new item as blocked
                this.addItem(item);
            } else {
                // Find existing checkbox and change state
                var input = this.container.querySelector('#blocked-' + this.opts.type + '-' + item);
                if (input && !input.classList.contains('suspended')) {
                    // Little hack
                    input.classList.add('suspended');
                    input.checked = !input.checked;
                    input.classList.remove('suspended');
                }
            }
        }
    }, {
        key: 'addItem',
        value: function addItem(item) {
            var _this4 = this;

            var el = this.createCheckbox('blocked-' + this.opts.type + '-' + item, item, true);
            el.addEventListener('change', function (e) {
                var input = el.querySelector('input');
                input.classList.add('suspended');
                _this4.trigger(_this4.opts.event, item);
                input.classList.remove('suspended');
            });
            this.itemsList.push(item);
            this.itemsContainer.appendChild(el);
        }
    }, {
        key: 'renderContents',
        value: function () {
            var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var _this5 = this;

                var addInputCont, addInput, addInputBtn;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                // Add input for new item
                                addInputCont = document.createElement('div');

                                addInputCont.classList.add('add-container');
                                addInput = document.createElement('input');

                                addInput.placeholder = 'Names, comma-separated';
                                addInputBtn = this.createButton('add-block', '+');

                                addInputBtn.title = 'Add';
                                addInputBtn.addEventListener('click', function (e) {
                                    var line = addInput.value.trim();
                                    if (line) {
                                        line.split(',').forEach(function (item) {
                                            var name = item.trim();
                                            if (name && !_this5.itemsList.includes(name)) {
                                                _this5.trigger(_this5.opts.event, name);
                                            }
                                        });
                                        addInput.value = '';
                                    }
                                });
                                addInputCont.appendChild(addInput);
                                addInputCont.appendChild(addInputBtn);
                                this.container.appendChild(addInputCont);

                                // Create scrollable container for items list
                                this.itemsContainer = document.createElement('div');
                                this.itemsContainer.classList.add('scroll-list');
                                this.container.appendChild(this.itemsContainer);

                                _context.next = 15;
                                return this.opts.settings.get(this.opts.settingName, []);

                            case 15:
                                this.itemsList = _context.sent;

                                this.itemsList.sort();
                                this.itemsList.forEach(function (item) {
                                    _this5.addItem(item);
                                }, this);

                            case 18:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function renderContents() {
                return _ref.apply(this, arguments);
            }

            return renderContents;
        }()
    }]);
    return BlockedPanel;
}(Panel);

var ImportExportPanel = function (_Panel2) {
    inherits(ImportExportPanel, _Panel2);

    function ImportExportPanel() {
        classCallCheck(this, ImportExportPanel);
        return possibleConstructorReturn(this, (ImportExportPanel.__proto__ || Object.getPrototypeOf(ImportExportPanel)).apply(this, arguments));
    }

    createClass(ImportExportPanel, [{
        key: 'renderContents',
        value: function () {
            var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var _this7 = this;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                // Export
                                this.container.appendChild(this.createLabel('Warning: may not work as intended'));
                                this.container.appendChild(this.createLabel('Current settings:'));
                                this.settingsTxt = document.createElement('textarea');
                                _context3.t0 = JSON;
                                _context3.next = 6;
                                return this.opts.settings.getAll();

                            case 6:
                                _context3.t1 = _context3.sent;
                                this.settingsTxt.value = _context3.t0.stringify.call(_context3.t0, _context3.t1);

                                this.container.appendChild(this.settingsTxt);

                                // Import
                                this.container.appendChild(this.createLabel('Import:'));
                                this.importTxt = document.createElement('textarea');
                                this.importTxt.placeholder = 'Paste settings, press button and reload page';
                                this.container.appendChild(this.importTxt);
                                this.importBtn = this.createButton('import', 'Import');
                                this.importBtn.addEventListener('click', function () {
                                    var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
                                        var val, data;
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        val = _this7.importTxt.value;

                                                        if (val) {
                                                            _context2.next = 4;
                                                            break;
                                                        }

                                                        _this7.errorTxt.textContent = 'Empty value';
                                                        return _context2.abrupt('return');

                                                    case 4:
                                                        _context2.prev = 4;
                                                        data = JSON.parse(_this7.importTxt.value);

                                                        if (_this7.opts.settings.isValid(data)) {
                                                            _context2.next = 10;
                                                            break;
                                                        }

                                                        _this7.errorTxt.textContent = 'Error: bad value';
                                                        _context2.next = 14;
                                                        break;

                                                    case 10:
                                                        _context2.next = 12;
                                                        return _this7.opts.settings.setAll(data);

                                                    case 12:
                                                        _this7.importTxt.value = '';
                                                        _this7.errorTxt.textContent = 'Success';

                                                    case 14:
                                                        _context2.next = 19;
                                                        break;

                                                    case 16:
                                                        _context2.prev = 16;
                                                        _context2.t0 = _context2['catch'](4);

                                                        _this7.errorTxt.textContent = 'Error: ' + _context2.t0;

                                                    case 19:
                                                    case 'end':
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this7, [[4, 16]]);
                                    }));

                                    return function (_x5) {
                                        return _ref3.apply(this, arguments);
                                    };
                                }());
                                this.container.appendChild(this.importBtn);
                                this.errorTxt = this.createLabel('');
                                this.container.appendChild(this.errorTxt);

                            case 18:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function renderContents() {
                return _ref2.apply(this, arguments);
            }

            return renderContents;
        }()
    }]);
    return ImportExportPanel;
}(Panel);

var SettingsPanel = function (_Panel3) {
    inherits(SettingsPanel, _Panel3);

    function SettingsPanel() {
        classCallCheck(this, SettingsPanel);
        return possibleConstructorReturn(this, (SettingsPanel.__proto__ || Object.getPrototypeOf(SettingsPanel)).apply(this, arguments));
    }

    createClass(SettingsPanel, [{
        key: 'createPanelCls',
        value: function createPanelCls(clsName, args) {
            if (clsName === 'BlockedPanel') {
                return new BlockedPanel(args);
            } else if (clsName === 'ImportExportPanel') {
                return new ImportExportPanel(args);
            }
        }

        // Create checbox element for option :name: with label :label:
        // that triggers :event: on change

    }, {
        key: 'createToggleOpt',
        value: function () {
            var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(name, label, event) {
                var _this9 = this;

                var box;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.t0 = this;
                                _context4.t1 = name;
                                _context4.t2 = label;
                                _context4.next = 5;
                                return this.opts.settings.get(name);

                            case 5:
                                _context4.t3 = _context4.sent;
                                box = _context4.t0.createCheckbox.call(_context4.t0, _context4.t1, _context4.t2, _context4.t3);

                                box.addEventListener('change', function (e) {
                                    _this9.trigger(event, e.target.checked);
                                });
                                this.container.appendChild(box);

                            case 9:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function createToggleOpt(_x6, _x7, _x8) {
                return _ref4.apply(this, arguments);
            }

            return createToggleOpt;
        }()
    }, {
        key: 'renderContents',
        value: function () {
            var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                var _this10 = this;

                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:

                                // Side panels
                                this.panelList = [{
                                    btn: {
                                        name: 'blocked-users',
                                        label: 'Blocked users →'
                                    },
                                    panel: {
                                        cls: 'BlockedPanel',
                                        prop: 'blockedUsersPanel',
                                        args: {
                                            settings: this.opts.settings,
                                            type: 'users',
                                            event: 'toggleUserBlock',
                                            heading: 'Blocked users',
                                            settingName: 'blocked'
                                        }
                                    }
                                }, {
                                    btn: {
                                        name: 'blocked-comm',
                                        label: 'Blocked communities →'
                                    },
                                    panel: {
                                        cls: 'BlockedPanel',
                                        prop: 'blockedCommPanel',
                                        args: {
                                            settings: this.opts.settings,
                                            type: 'comm',
                                            event: 'toggleCommBlock',
                                            heading: 'Blocked communities',
                                            settingName: 'blockedComm'
                                        }
                                    }
                                }, {
                                    btn: {
                                        name: 'import-export',
                                        label: 'Import/Export →'
                                    },
                                    panel: {
                                        cls: 'ImportExportPanel',
                                        prop: 'importExportPanel',
                                        args: {
                                            settings: this.opts.settings,
                                            heading: 'Import/Export'
                                        }
                                    }
                                }];
                                this.panelList.forEach(function (i) {
                                    var btn = _this10.createButton(i.btn.name, i.btn.label);
                                    _this10[i.panel.prop] = _this10.createPanelCls(i.panel.cls, i.panel.args);
                                    btn.addEventListener('click', function (e) {
                                        e.preventDefault();
                                        if (_this10[i.panel.prop].isRendered()) {
                                            _this10[i.panel.prop].remove();
                                        } else {
                                            _this10[i.panel.prop].render(_this10.panel.parentNode);
                                            _this10[i.panel.prop].show();
                                        }
                                    });
                                    _this10.container.appendChild(btn);
                                });

                                // Enable/disable
                                this.createToggleOpt('enabled', 'Enable script', 'scriptEnable');

                                // Save collapsed posts state
                                this.createToggleOpt('storeCollapsed', 'Store collapsed state', 'storeCollapsed');

                                // Hide iframes
                                this.createToggleOpt('hideIframes', 'Hide iframes', 'hideIframesToggle');

                                // Set max image width
                                this.createToggleOpt('setSize', 'Force max img size', 'toggleSetSize');

                                // Add style=mine
                                this.createToggleOpt('styleMine', 'Add style=mine', 'styleMineToggle');

                                // Hide blocked posts completely
                                this.createToggleOpt('hideBlocked', 'Hide blocked', 'hideBlockedToggle');

                                // Clear settings button
                                this.clearSettings = this.createButton('clear-settings', 'Clear settings');
                                this.clearSettings.addEventListener('click', function (e) {
                                    _this10.trigger('clearSettings');
                                });
                                this.container.appendChild(this.clearSettings);

                            case 11:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function renderContents() {
                return _ref5.apply(this, arguments);
            }

            return renderContents;
        }()

        // Hide everything on hide

    }, {
        key: 'hide',
        value: function hide() {
            var _this11 = this;

            get(SettingsPanel.prototype.__proto__ || Object.getPrototypeOf(SettingsPanel.prototype), 'hide', this).call(this);
            this.panelList.forEach(function (i) {
                _this11[i.panel.prop].remove();
            });
        }
    }]);
    return SettingsPanel;
}(Panel);

var Controls = function (_Base2) {
    inherits(Controls, _Base2);

    function Controls(opts) {
        classCallCheck(this, Controls);

        var _this12 = possibleConstructorReturn(this, (Controls.__proto__ || Object.getPrototypeOf(Controls)).call(this));

        _this12.opts = opts;
        _this12.addCss();
        _this12.addControls();
        return _this12;
    }

    createClass(Controls, [{
        key: 'setStyle',
        value: function setStyle(node, style) {
            for (var rule in style) {
                if (style.hasOwnProperty(rule)) node.style[rule] = style[rule];
            }
        }
    }, {
        key: 'addCss',
        value: function addCss() {
            var style = document.createElement('style');
            document.head.appendChild(style);
            var css = style.sheet;
            var count = 0;
            for (var sel in cssRules) {
                if (!cssRules.hasOwnProperty(sel)) {
                    continue;
                }
                var rules = [];
                for (var prop in cssRules[sel]) {
                    if (typeof cssRules[sel][prop] === 'string') {
                        rules.push(prop + ': ' + cssRules[sel][prop] + ';');
                    } else {
                        // I don't know how much I hate js for this shit
                        if (Object.prototype.toString.call(cssRules[sel][prop]) === '[object Object]') {
                            // Looks like we have another object here
                            var sub = [];
                            for (var s in cssRules[sel][prop]) {
                                sub.push(s + ': ' + cssRules[sel][prop][s] + ';');
                            }
                            rules.push(prop + ' { ' + sub.join("\n") + ' }');
                        }
                    }
                }
                css.insertRule(sel + ' { ' + rules.join("\n") + ' }', count++);
            }
        }
    }, {
        key: 'addControls',
        value: function addControls() {
            var _this13 = this;

            // Create container
            this.panel = document.createElement('div');
            this.panel.id = 'fifreader-container';

            // Settings button
            this.button = document.createElement('button');
            this.button.textContent = '⚙';
            this.button.addEventListener('click', function (e) {
                _this13.settings.toggle();
            });
            this.panel.appendChild(this.button);

            // Main settings panel
            this.settings = new SettingsPanel({
                settings: this.opts.settings,
                hide: true
            });
            this.settings.render(this.panel);

            document.body.appendChild(this.panel);

            // Load more button
            var prevLink = document.querySelector('ul.viewspecnavbar a');
            if (prevLink) {
                var link = prevLink.href;
                this.loadMore = document.createElement('button');
                this.loadMore.id = 'fifreader-load-more';
                this.loadMore.dataset.link = link;

                // Add label because we can't animate ::before on same
                // element
                this.loadMore.appendChild(document.createElement('span'));
                document.body.appendChild(this.loadMore);

                // Trigger load event and show animation
                this.loadMore.addEventListener('click', function () {
                    if (_this13.loadMore.classList.contains('loading')) return;
                    _this13.loadMore.classList.add('loading');
                    _this13.trigger('loadMore', _this13.loadMore.dataset.link);
                });

                // Stop animation and update link if succeeded
                this.addListener('loadFinished', function (newLink) {
                    if (newLink) {
                        _this13.loadMore.dataset.link = newLink;
                    } else {
                        _this13.loadMore.disabled = true;
                        _this13.loadMore.classList.add('disabled');
                    }
                    _this13.loadMore.classList.remove('loading');
                });
            }
        }
    }]);
    return Controls;
}(Base);

var Post = function (_Base) {
    inherits(Post, _Base);

    function Post(opts) {
        classCallCheck(this, Post);

        var _this = possibleConstructorReturn(this, (Post.__proto__ || Object.getPrototypeOf(Post)).call(this));

        _this.node = opts.node;
        _this.styleMine = opts.styleMine;

        _this.id = _this.node.id;
        _this.user = _this.node.querySelector('span.ljuser b').textContent;
        _this.heading = _this.node.querySelector('h2.entryheading');
        _this.dateString = _this.heading.childNodes[0].textContent.replace(' - ', '').trim();

        // Get comments count for uncollapse
        _this.uncollapseThreshold = 149;
        _this.cntRe = /html\?nc=(\d+)/;
        _this.commentsCount = 0;
        _this.commentsLink = _this.node.querySelector('ul.entryextra:last-child li.entryreadlink a');
        if (_this.commentsLink) {
            var match = _this.commentsLink.href.match(_this.cntRe);
            if (match && match.length > 1) {
                _this.commentsCount = parseInt(match[1], 10);
            }
        }

        // Check community post
        _this.community = null;
        if (_this.heading.childNodes.length > 3) {
            var chunk = _this.heading.childNodes[3]; // Shortcut
            // Check private too
            if (!chunk.alt && chunk.childNodes[0].childNodes.length > 0) {
                // Try to distinguish between community and username
                var img = chunk.childNodes[0].childNodes[0].src;
                if (img.match(/community.gif$/)) _this.community = chunk.textContent;
            }
        }
        _this.isCommunity = _this.community !== null;
        _this.title = _this.getTitle();
        _this.addPanel();

        // Initial visibility setup
        _this.show();
        _this.unblock();
        _this.unblockComm();
        return _this;
    }

    // Get title for simple and community posts


    createClass(Post, [{
        key: 'getTitle',
        value: function getTitle() {
            var title = '';

            var hasTitle = false;
            if (!this.isCommunity && this.heading.childNodes.length === 3) hasTitle = true;
            if (this.isCommunity && this.heading.childNodes.length === 5) hasTitle = true;

            if (hasTitle) {
                title = this.heading.childNodes[this.heading.childNodes.length - 1].textContent.trim();
            }
            return title;
        }

        // Force max size of images

    }, {
        key: 'setSize',
        value: function setSize(toggle) {
            var imgs = this.node.querySelectorAll('table td:nth-child(2) img');
            for (var i = 0; i < imgs.length; i++) {
                if (toggle) imgs[i].classList.add('fif-max-size');else imgs[i].classList.remove('fif-max-size');
            }
        }
    }, {
        key: 'createBtn',
        value: function createBtn(cls, clickHandler) {
            var btn = document.createElement('button');
            btn.classList.add('panel-button');
            btn.classList.add(cls);
            btn.addEventListener('click', clickHandler.bind(this));
            return btn;
        }
    }, {
        key: 'addUncollapseLink',
        value: function addUncollapseLink() {
            var a = document.createElement('a');
            a.href = this.commentsLink.href + '&uncollapse=1';
            a.textContent = 'Uncollapse';
            var li = document.createElement('li');
            li.appendChild(a);
            li.className = 'fifreader-uncollapse';
            this.node.querySelector('ul.entryextra:last-child').insertBefore(li, this.commentsLink.parentNode);
        }
    }, {
        key: 'addStyleMine',
        value: function addStyleMine() {
            // Append to entryextra
            var links = this.arrayQS(this.node, 'ul.entryextra:last-child a');
            links.forEach(function (link) {
                link.href += '&style=mine';
            });
            // Append to blog link
            var blog = this.node.querySelector('span.ljuser a:nth-child(2)');
            if (blog) {
                blog.href += '?style=mine';
            }
            // Append to community link
            if (this.isCommunity) {
                this.heading.childNodes[3].querySelector('a:nth-child(2)').href += '?style=mine';
            }
        }
    }, {
        key: 'addPanel',
        value: function addPanel() {
            var _this2 = this;

            // Add button panel
            this.node.style.position = 'relative';
            this.panel = document.createElement('div');
            this.panel.classList.add('fifreader-panel');
            this.node.parentNode.insertBefore(this.panel, this.node);

            // Add buttons
            // Show/hide
            this.visibilityBtn = this.createBtn('visibility', this.visibilityHandler);
            this.panel.appendChild(this.visibilityBtn);

            // Block/unblock
            this.blockBtn = this.createBtn('block', this.blockHandler);
            this.panel.appendChild(this.blockBtn);

            // Community block
            if (this.isCommunity) {
                this.commBlockBtn = this.createBtn('comm-block', this.commBlockHandler);
                this.panel.appendChild(this.commBlockBtn);
            }

            // Add style=mine if needed
            if (this.styleMine) {
                this.addStyleMine();
            }

            // Add postinfo
            this.postInfo = document.createElement('span');
            this.postInfo.classList.add('post-info');

            // Username
            this.postInfo.appendChild(this.node.querySelector('span.ljuser').cloneNode(true));
            // Append community name if exists
            if (this.isCommunity) {
                var sep = document.createTextNode(' => ');
                this.postInfo.appendChild(sep);
                this.postInfo.appendChild(this.heading.childNodes[3].cloneNode(true));
            }

            // Date
            var dateStr = document.createElement('strong');
            dateStr.textContent = ' - ' + this.dateString;
            this.postInfo.appendChild(dateStr);

            // Title
            var title = document.createElement('strong');
            title.textContent = ' ' + this.title;
            this.postInfo.appendChild(title);

            // Process uncollapse
            if (this.commentsLink && this.commentsCount > this.uncollapseThreshold) {
                this.addUncollapseLink();
            }

            // Comments
            var links = this.arrayQS(this.node, 'ul.entryextra:last-child a');
            links.forEach(function (link) {
                var span = document.createElement('span');
                span.appendChild(document.createTextNode(' '));
                span.appendChild(link.cloneNode(true));
                _this2.postInfo.appendChild(span);
            }, this);

            this.panel.appendChild(this.postInfo);
        }

        // Toggle post visibility

    }, {
        key: 'visibilityHandler',
        value: function visibilityHandler(event) {
            if (this.isHidden) {
                this.show();
            } else {
                this.hide();
            }
            this.trigger('toggleCollapse', this.id);
        }

        // Toggle blocked status

    }, {
        key: 'blockHandler',
        value: function blockHandler(event) {
            this.trigger('toggleUserBlock', this.user);
        }

        // Toggle community blocked status

    }, {
        key: 'commBlockHandler',
        value: function commBlockHandler(event) {
            this.trigger('toggleCommBlock', this.community);
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.panel.classList.add('hidden');
            this.node.classList.add('hidden');
            this.isHidden = true;
            this.visibilityBtn.title = 'Show';
        }
    }, {
        key: 'show',
        value: function show() {
            this.panel.classList.remove('hidden');
            this.node.classList.remove('hidden');
            this.isHidden = false;
            this.visibilityBtn.title = 'Hide';
        }

        // Block user. Hide and show posts even if status is blocked
        // because post may be collapsed or uncollapsed by user

    }, {
        key: 'block',
        value: function block() {
            this.hide();
            this.isBlocked = true;
            this.panel.classList.add('blocked');
            this.node.classList.add('blocked-entry');
            this.blockBtn.title = 'Unblock user';
        }
    }, {
        key: 'unblock',
        value: function unblock() {
            if (this.isBlockedComm === false) this.show();
            this.isBlocked = false;
            this.panel.classList.remove('blocked');
            this.node.classList.remove('blocked-entry');
            this.blockBtn.title = 'Block user';
        }

        // Block community

    }, {
        key: 'blockComm',
        value: function blockComm() {
            if (!this.isCommunity) return;
            this.hide();
            this.isBlockedComm = true;
            this.panel.classList.add('blocked-comm');
            this.node.classList.add('blocked-entry');
            this.commBlockBtn.title = 'Unblock community';
        }
    }, {
        key: 'unblockComm',
        value: function unblockComm() {
            this.isBlockedComm = false;
            if (!this.isCommunity) return;
            if (this.isBlocked === false) this.show();
            this.panel.classList.remove('blocked-comm');
            this.node.classList.remove('blocked-entry');
            this.commBlockBtn.title = 'Block community';
        }
    }]);
    return Post;
}(Base);

// Main script logic

var Main = function (_Base) {
    inherits(Main, _Base);

    function Main() {
        classCallCheck(this, Main);

        // Set maximum length of save collapsed posts list to avoid
        // storage problems in future
        var _this = possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this));

        _this.maxCollapsedLength = 8000;
        _this.settings = new Settings();
        _this.posts = [];
        _this.loadedIds = [];

        // When DOM isn't ready
        // this.onPageStart();

        // document.addEventListener('DOMContentLoaded', () => {
        //     this.onPageLoaded();
        // });
        return _this;
    }

    createClass(Main, [{
        key: 'init',
        value: function () {
            var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var isEnabled, nodes;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.settings.init();

                            case 2:
                                _context.next = 4;
                                return this.settings.get('enabled');

                            case 4:
                                isEnabled = _context.sent;

                                if (!isEnabled) {
                                    _context.next = 27;
                                    break;
                                }

                                // Chromium/Tampermonkey can't really run script on document
                                // start because async load, so we also need to process
                                // iframes that aren't hidden with mutations on page
                                // load. That sucks a lot.

                                // UPD: and now document-start doesn't work even in GM. Thank
                                // you, Mozilla.

                                // if (await this.settings.get('hideIframes')) {
                                //     this.hideIframesMutation();
                                // }

                                this.listenEvents();
                                this.controls = new Controls({
                                    settings: this.settings
                                });
                                _context.next = 10;
                                return this.settings.get('enabled');

                            case 10:
                                if (_context.sent) {
                                    _context.next = 12;
                                    break;
                                }

                                return _context.abrupt('return');

                            case 12:
                                _context.next = 14;
                                return this.settings.get('hideIframes');

                            case 14:
                                if (!_context.sent) {
                                    _context.next = 16;
                                    break;
                                }

                                this.hideIframesLoaded(document);

                            case 16:
                                _context.next = 18;
                                return this.settings.get('hideBlocked');

                            case 18:
                                if (!_context.sent) {
                                    _context.next = 20;
                                    break;
                                }

                                this.hideBlockedToggle(true);

                            case 20:
                                nodes = this.arrayQS(document, 'body > #page > div.day > div.entry');
                                _context.t0 = Array.prototype.push;
                                _context.t1 = this.posts;
                                _context.next = 25;
                                return this.getPosts(nodes);

                            case 25:
                                _context.t2 = _context.sent;

                                _context.t0.apply.call(_context.t0, _context.t1, _context.t2);

                            case 27:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function init() {
                return _ref.apply(this, arguments);
            }

            return init;
        }()

        // Listen to external events

    }, {
        key: 'listenEvents',
        value: function listenEvents() {
            this.addListener('toggleUserBlock', this.blockUser.bind(this));
            this.addListener('toggleCommBlock', this.blockComm.bind(this));
            this.addListener('clearSettings', this.settings.clearSettings);
            this.addListener('scriptEnable', this.scriptEnable.bind(this));
            this.addListener('toggleCollapse', this.toggleCollapse.bind(this));
            this.addListener('storeCollapsed', this.storeCollapsed.bind(this));
            this.addListener('hideIframesToggle', this.hideIframesTgl.bind(this));
            this.addListener('toggleSetSize', this.toggleSetSize.bind(this));
            this.addListener('styleMineToggle', this.styleMineToggle.bind(this));
            this.addListener('hideBlockedToggle', this.hideBlockedToggle.bind(this));
            this.addListener('loadMore', this.loadMore.bind(this));
        }

        // Enable/disable script

    }, {
        key: 'scriptEnable',
        value: function scriptEnable(enable) {
            this.settings.set('enabled', enable);
        }

        // Store collapsed posts state

    }, {
        key: 'storeCollapsed',
        value: function storeCollapsed(enable) {
            this.settings.set('storeCollapsed', enable);
        }

        // Iframes hiding settings

    }, {
        key: 'hideIframesTgl',
        value: function hideIframesTgl(enable) {
            this.settings.set('hideIframes', enable);
        }

        // Add style=mine settings

    }, {
        key: 'styleMineToggle',
        value: function styleMineToggle(enable) {
            this.settings.set('styleMine', enable);
        }

        // Hide blocked completely

    }, {
        key: 'hideBlockedToggle',
        value: function hideBlockedToggle(enable) {
            this.settings.set('hideBlocked', enable);
            // Do it with style
            if (enable) {
                document.body.classList.add('hide-blocked');
            } else {
                document.body.classList.remove('hide-blocked');
            }
        }

        // Set max size toggle

    }, {
        key: 'toggleSetSize',
        value: function toggleSetSize(enable) {
            this.settings.set('setSize', enable);
            this.posts.forEach(function (post) {
                post.setSize(enable);
            });
        }

        // Save collapsed state of post

    }, {
        key: 'toggleCollapse',
        value: function () {
            var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id) {
                var collapsed;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.settings.get('storeCollapsed');

                            case 2:
                                if (_context2.sent) {
                                    _context2.next = 4;
                                    break;
                                }

                                return _context2.abrupt('return');

                            case 4:
                                _context2.next = 6;
                                return this.settings.get('collapsed');

                            case 6:
                                collapsed = _context2.sent;


                                if (collapsed.includes(id)) {
                                    collapsed.splice(collapsed.indexOf(id), 1);
                                } else {
                                    collapsed.push(id);
                                }
                                // Cut collapsed posts list by half when lenght exceeds max to
                                // avoid storage problems
                                if (collapsed.length > this.maxCollapsedLength) {
                                    collapsed.splice(0, this.maxCollapsedLength / 2);
                                }
                                _context2.next = 11;
                                return this.settings.set('collapsed', collapsed);

                            case 11:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function toggleCollapse(_x) {
                return _ref2.apply(this, arguments);
            }

            return toggleCollapse;
        }()

        // Parse posts and create Post objects

    }, {
        key: 'getPosts',
        value: function () {
            var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(nodes) {
                var posts, styleMine, setSize, storeCollapsed, collapsed, blocked, blockComm, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, post;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                posts = [];
                                _context3.next = 3;
                                return this.settings.get('styleMine');

                            case 3:
                                styleMine = _context3.sent;
                                _context3.next = 6;
                                return this.settings.get('setSize');

                            case 6:
                                setSize = _context3.sent;
                                _context3.next = 9;
                                return this.settings.get('storeCollapsed');

                            case 9:
                                storeCollapsed = _context3.sent;
                                _context3.next = 12;
                                return this.settings.get('collapsed');

                            case 12:
                                collapsed = _context3.sent;
                                _context3.next = 15;
                                return this.settings.get('blocked');

                            case 15:
                                blocked = _context3.sent;
                                _context3.next = 18;
                                return this.settings.get('blockedComm');

                            case 18:
                                blockComm = _context3.sent;
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context3.prev = 22;


                                for (_iterator = nodes[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    entry = _step.value;
                                    post = new Post({
                                        node: entry,
                                        styleMine: styleMine
                                    });

                                    this.loadedIds.push(post.id);
                                    if (storeCollapsed && collapsed.includes(post.id)) {
                                        post.hide();
                                    }
                                    if (blocked.includes(post.user)) {
                                        post.block();
                                    }
                                    if (post.isCommunity && blockComm.includes(post.community)) {
                                        post.blockComm();
                                    }
                                    if (setSize) {
                                        post.setSize(true);
                                    }
                                    posts.push(post);
                                }
                                _context3.next = 30;
                                break;

                            case 26:
                                _context3.prev = 26;
                                _context3.t0 = _context3['catch'](22);
                                _didIteratorError = true;
                                _iteratorError = _context3.t0;

                            case 30:
                                _context3.prev = 30;
                                _context3.prev = 31;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 33:
                                _context3.prev = 33;

                                if (!_didIteratorError) {
                                    _context3.next = 36;
                                    break;
                                }

                                throw _iteratorError;

                            case 36:
                                return _context3.finish(33);

                            case 37:
                                return _context3.finish(30);

                            case 38:
                                return _context3.abrupt('return', posts);

                            case 39:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[22, 26, 30, 38], [31,, 33, 37]]);
            }));

            function getPosts(_x2) {
                return _ref3.apply(this, arguments);
            }

            return getPosts;
        }()

        // Hide or show all user posts and set user block status

    }, {
        key: 'blockUser',
        value: function () {
            var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(user) {
                var action, blocked;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                action = null;
                                _context4.next = 3;
                                return this.settings.get('blocked');

                            case 3:
                                blocked = _context4.sent;

                                if (blocked.includes(user)) {
                                    // Unblock user
                                    blocked.splice(blocked.indexOf(user), 1);
                                    action = function action(p) {
                                        p.unblock();
                                    };
                                } else {
                                    // Block user
                                    blocked.push(user);
                                    action = function action(p) {
                                        p.block();
                                    };
                                }
                                _context4.next = 7;
                                return this.settings.set('blocked', blocked);

                            case 7:
                                this.posts.forEach(function (post) {
                                    if (post.user === user) {
                                        action(post);
                                    }
                                });

                            case 8:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function blockUser(_x3) {
                return _ref4.apply(this, arguments);
            }

            return blockUser;
        }()

        // Hide or show all community posts and set community block status

    }, {
        key: 'blockComm',
        value: function () {
            var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(community) {
                var action, blocked;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                action = null;
                                _context5.next = 3;
                                return this.settings.get('blockedComm');

                            case 3:
                                blocked = _context5.sent;

                                if (blocked.includes(community)) {
                                    // Unblock user
                                    blocked.splice(blocked.indexOf(community), 1);
                                    action = function action(p) {
                                        p.unblockComm();
                                    };
                                } else {
                                    // Block user
                                    blocked.push(community);
                                    action = function action(p) {
                                        p.blockComm();
                                    };
                                }
                                _context5.next = 7;
                                return this.settings.set('blockedComm', blocked);

                            case 7:
                                this.posts.forEach(function (post) {
                                    if (post.isCommunity && post.community === community) {
                                        action(post);
                                    }
                                });

                            case 8:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function blockComm(_x4) {
                return _ref5.apply(this, arguments);
            }

            return blockComm;
        }()

        // Replace iframe with placeholder

    }, {
        key: 'hideIframe',
        value: function hideIframe(node) {
            var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (node.noreplace) return;
            var placeholder = document.createElement('a');
            var iframe = node.cloneNode(true);
            iframe.noreplace = true;
            if (parent === null) {
                parent = node.parentNode;
            }
            parent.replaceChild(placeholder, node);
            placeholder.href = '#';
            placeholder.classList.add('iframe-placeholder');
            placeholder.textContent = '↕ iframe';
            placeholder.addEventListener('click', function (ev) {
                ev.preventDefault();
                ev.target.parentNode.replaceChild(iframe, ev.target);
            });
        }

        // Replace iframes on mutation
        // hideIframesMutation() {
        //     const observer = new MutationObserver((mutations) => {
        //         mutations.forEach((mutation) => {
        //             if (mutation.type === 'childList') {
        //                 this.qsToArray(mutation.addedNodes).forEach((node) => {
        //                     if (['iframe', 'IFRAME'].includes(node.nodeName)) {
        //                         // Don't replace iframes that we add
        //                         this.hideIframe(node, mutation.target);
        //                     }
        //                 });
        //             }
        //         });
        //     });
        //     observer.observe(document, {
        //         attributes: true,
        //         childList: true,
        //         characterData: true,
        //         subtree: true
        //     });
        // }

        // Replace iframes when page is loaded

    }, {
        key: 'hideIframesLoaded',
        value: function hideIframesLoaded(doc) {
            var _this2 = this;

            this.arrayQS(doc, 'iframe').forEach(function (node) {
                _this2.hideIframe(node);
            });
        }

        // Small helper for loadmore

    }, {
        key: 'createLogBar',
        value: function createLogBar(text, error) {
            var logBar = document.createElement('p');
            logBar.className = 'fifreader-load-more-stat';
            if (error) {
                logBar.className = 'fifreader-load-more-stat error';
            }
            logBar.textContent = text;
            return logBar;
        }

        // Load more posts

    }, {
        key: 'loadMore',
        value: function loadMore(link) {
            var _this3 = this;

            var req = new XMLHttpRequest();
            if (!req) {
                alert("Your browser can't create xhr. Why?");
                return false;
            }
            // If browser don't support html responses in xhr, we're in
            // trouble. But alternative solutions are clumsy, so let it
            // go.
            req.responseType = "document";

            var page = document.getElementById('page');
            // New data will be inserted before next page link at bottom
            var place = document.querySelectorAll('body > #page > ul.viewspecnavbar')[1];

            // Shortcut for reporting stats
            var addLogBar = function addLogBar(text, error) {
                var logBar = document.createElement('p');
                logBar.className = 'fifreader-load-more-stat';
                if (error) {
                    logBar.className = 'fifreader-load-more-stat error';
                }
                logBar.textContent = text;
                page.insertBefore(logBar, place);
            };

            // Process success requests (even 404s!)
            req.onload = function () {
                var _ref6 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(e) {
                    var doc, skipped, displayed, newDay, msg, newLink;
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                        while (1) {
                            switch (_context6.prev = _context6.next) {
                                case 0:
                                    if (!(req.status !== 200)) {
                                        _context6.next = 3;
                                        break;
                                    }

                                    addLogBar('Error when loading new posts, status ' + req.status, true);
                                    return _context6.abrupt('return');

                                case 3:
                                    doc = req.responseXML;
                                    // Process posts for new page

                                    skipped = 0;
                                    displayed = 0;
                                    // New day won't bring new hope

                                    newDay = document.createElement('div');

                                    newDay.className = 'day';

                                    _context6.next = 10;
                                    return _this3.settings.get('hideIframes');

                                case 10:
                                    if (!_context6.sent) {
                                        _context6.next = 12;
                                        break;
                                    }

                                    _this3.hideIframesLoaded(doc);

                                case 12:
                                    _context6.t0 = Array.prototype.push;
                                    _context6.t1 = _this3.posts;
                                    _context6.next = 16;
                                    return _this3.getPosts(_this3.arrayQS(doc, 'body > #page > div.day > div.entry').filter(function (entry) {
                                        if (_this3.loadedIds.includes(entry.id)) {
                                            skipped++;
                                            return false;
                                        }
                                        displayed++;
                                        newDay.appendChild(entry);
                                        return true;
                                    }));

                                case 16:
                                    _context6.t2 = _context6.sent;

                                    _context6.t0.apply.call(_context6.t0, _context6.t1, _context6.t2);

                                    // Show some stats about loading
                                    page.insertBefore(document.createElement('hr'), place);

                                    msg = link + ' displayed posts: ' + displayed;

                                    if (skipped !== 0) {
                                        msg += '; skipped already displayed posts: ' + skipped;
                                    }
                                    addLogBar(msg);

                                    // Append new posts to current page
                                    page.insertBefore(newDay, place);

                                    // Send new link to button
                                    newLink = doc.querySelector('body > #page > ul.viewspecnavbar a');

                                    if (newLink) link = newLink.href;else link = null;
                                    _this3.trigger('loadFinished', link);

                                case 26:
                                case 'end':
                                    return _context6.stop();
                            }
                        }
                    }, _callee6, _this3);
                }));

                return function (_x6) {
                    return _ref6.apply(this, arguments);
                };
            }();

            req.onabort = req.onerror = function () {
                // Append error bar
                addLogBar('Error when loading new posts, status ' + req.status, true);
                _this3.trigger('loadFinished', link);
            };

            // Sometimes chromium tries to replace https with http and
            // fails miserably
            if (window.location.protocol === 'https:') {
                if (link.startsWith('http:')) {
                    link.replace('http:', 'https:');
                }
            } else if (window.location.protocol === 'http:') {
                if (link.startsWith('https:')) {
                    link.replace('https:', 'http:');
                }
            }
            req.open('GET', link);
            req.send();
        }
    }]);
    return Main;
}(Base);

var main = new Main();
main.init();

}());
