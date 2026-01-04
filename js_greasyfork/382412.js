var MyTest = {version: 2};

(function() {
  if (!window.MyTest) {
    window.MyTest = MyTest;
    console.log('window.MyTest initialized to version ' + MyTest.version);
  } else if (window.MyTest.version < MyTest.version) {
    window.MyTest = MyTest;
    console.log('window.MyTest overwritten to ' + MyTest.version);
  }
})();